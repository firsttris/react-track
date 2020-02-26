import { API_DATE } from 'cons';
import { filter } from 'lodash';
import * as moment from 'moment';
import * as t from 'types';
import uuid = require('uuid/v4');
import { StatisticCalculator } from '../calculators/StatisticCalculator';
import { WorkDayCalculator } from '../calculators/WorkDayCalculator';
import { LeaveErrorKeys } from './../errorKeys';
import { WorkDay } from './../types';
import { DbAdapterWithColAndDbKey } from './DbAdapterWithColAndDbKey';
import { TimestampCollection } from './TimestampCollection';
import { UserCollection } from './UserCollection';

export class LeaveCollection extends DbAdapterWithColAndDbKey {
  static db: { [userId: string]: any } = {};
  static jsonFileName: string = 'leaveDays.json';

  static async removeLeave(userId: string, leave: t.LeaveInput): Promise<t.Leave[]> {
    const year = this.getDateKey(leave);
    if (leave.id) {
      await this.removeById(userId, year, leave.id);
    }
    return this.getLeaveDays(userId, year);
  }

  static async getUncalculatedLeaveDays(userId: string, year: string): Promise<t.Leave[]> {
    return (await this.getCol(userId, year)).value() as t.Leave[];
  }

  static async getLeaveDays(userId: string, year: string): Promise<t.Leave[]> {
    const savedLeaves = (await this.getCol(userId, year)).value() as t.Leave[];
    const result = [];
    for (const savedLeave of savedLeaves) {
      const leave = { ...savedLeave };
      const startDate = moment(leave.start.date);
      const endDate = moment(leave.end.date);
      const workDays = await WorkDayCalculator.calculateWorkDatesExcludingLeaves(startDate, endDate, userId);
      leave.requestedLeaveDays = await this.calculateLeaveDays(leave.start, leave.end, workDays, userId);
      result.push(leave);
    }
    return result;
  }

  static getDateKey(leave: t.LeaveInput): string {
    return moment(leave.start.date).format('YYYY');
  }

  static async create(userId: string, newLeave: t.LeaveInput): Promise<t.Leave[]> {
    const startDate = moment(newLeave.start.date);
    const endDate = moment(newLeave.end.date);
    const year = this.getDateKey(newLeave);
    if (startDate.isAfter(endDate)) {
      throw new Error(LeaveErrorKeys.LEAVEDAY_START_DATE_AFTER_END_DATE);
    }

    if (startDate.get('year') !== endDate.get('year')) {
      throw new Error(LeaveErrorKeys.LEAVEDAY_DATES_IN_OTHER_YEAR);
    }

    if (await this.isTimestampAlreadyExisting(userId, newLeave)) {
      throw new Error(LeaveErrorKeys.LEAVEDAY_TIMESTAMPS_ALREADY_EXIST);
    }

    if (await this.isLeaveDayTimestampAlreadyExisting(userId, newLeave)) {
      throw new Error(LeaveErrorKeys.LEAVEDAY_ALREADY_EXISTS);
    }
    const workDays = await WorkDayCalculator.calculateWorkDates(startDate, endDate, userId);
    const alreadyUsedLeaveDays = await this.getAlreadyUsedLeaveDays(userId, year, workDays);
    const requestedLeaveDays = await this.calculateLeaveDays(newLeave.start, newLeave.end, workDays, userId);

    const maxNumberOfLeaveDays = await this.getMaxNumberOfLeaveDays(userId, year);
    const leaveDaysLeft = maxNumberOfLeaveDays - alreadyUsedLeaveDays - requestedLeaveDays;
    if (leaveDaysLeft < 0 && newLeave.type === t.DayType.HOLIDAY) {
      throw new Error(LeaveErrorKeys.LEAVEDAY_MISSING_DAYS);
    }

    const leave = LeaveCollection.createLeave(newLeave);
    leave.requestedLeaveDays = requestedLeaveDays;
    await this.push(userId, year, leave);
    return this.getLeaveDays(userId, year);
  }

  static async getMaxNumberOfLeaveDays(userId: string, year: string): Promise<number> {
    const user = await UserCollection.getById(userId);
    if (user.holidays) {
      const maxLeaveDays = filter(user.holidays, { year }).reduce((a, b) => a + b.days, 0);
      if (!isNaN(maxLeaveDays)) {
        return maxLeaveDays;
      }
    }

    return 0;
  }

  static createLeave(newLeave: t.LeaveInput): t.Leave {
    return {
      id: uuid(),
      start: newLeave.start,
      end: newLeave.end,
      type: newLeave.type,
      requestedLeaveDays: newLeave.requestedLeaveDays || Number(0)
    };
  }

  static async getAlreadyUsedLeaveDays(userId: string, year: string, workDays: WorkDay[]): Promise<number> {
    let holidayDaysInThisYear = 0;
    const leaveDays = await this.getLeaveDays(userId, year);
    for (const leaveDay of leaveDays) {
      if (leaveDay.type !== t.DayType.HOLIDAY) {
        continue;
      }
      holidayDaysInThisYear += leaveDay.requestedLeaveDays;
    }
    return holidayDaysInThisYear;
  }

  static async calculateLeaveDays(
    startDate: t.LeaveDate,
    endDate: t.LeaveDate,
    workdays: WorkDay[],
    userId: string
  ): Promise<number> {
    let days = 0;
    for (const workday of workdays) {
      if (workday.dayType === t.DayType.PUBLIC_HOLIDAY) {
        continue;
      }
      let workTimeInMilliseconds = await StatisticCalculator.getHoursForDay(workday, userId);
      if (startDate.date === workday.date && startDate.type === t.WorkDayType.HALF_DAY) {
        workTimeInMilliseconds *= 0.5;
      } else if (endDate.date === workday.date && endDate.type === t.WorkDayType.HALF_DAY) {
        workTimeInMilliseconds *= 0.5;
      }
      days += moment.duration(workTimeInMilliseconds, 'milliseconds').asHours() / 8;
    }

    return days;
  }

  static async isTimestampAlreadyExisting(userId: string, leave: t.LeaveInput): Promise<boolean> {
    let startDate = moment(leave.start.date);
    const endDate = moment(leave.end.date);
    while (startDate < endDate) {
      const timestamps = await TimestampCollection.getTimestamps(userId, startDate.format('YYYY'));
      if (timestamps.length > 0) {
        return true;
      }
      startDate = startDate.add(1, 'day');
    }

    return false;
  }

  static async isLeaveDayTimestampAlreadyExisting(userId: string, newLeave: t.LeaveInput): Promise<boolean> {
    const year = this.getDateKey(newLeave);
    const leavedays = await this.getLeaveDays(userId, year);
    const startDate = moment(newLeave.start.date);

    for (const h of leavedays) {
      const otherStartDate = moment(h.start.date);
      const otherEndDate = moment(h.end.date);
      if (startDate.isBetween(otherStartDate, otherEndDate)) {
        return true;
      }
      if (startDate.format(API_DATE) === h.start.date) {
        return true;
      }
    }
    return false;
  }
}
