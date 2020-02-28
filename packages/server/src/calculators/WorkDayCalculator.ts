import { API_DATE } from 'common/constants';
import { find } from 'lodash';
import * as moment from 'moment';
import * as t from 'common/types';
import { LeaveCollection } from './../collections/LeaveCollection';
import { PublicHolidayCollection } from './../collections/PublicHolidayCollection';
import { WorkDay } from './../types';

export class WorkDayCalculator {
  static async calculateWorkDates(start: moment.Moment, end: moment.Moment, userId: string): Promise<WorkDay[]> {
    const startDate = moment(start);
    const endDate = moment(end);
    const currentYear = startDate.format('YYYY');
    const publicHolidays = await PublicHolidayCollection.getPublicHolidays(currentYear);
    const leaveDates = await LeaveCollection.getUncalculatedLeaveDays(userId, currentYear);
    const workdays: WorkDay[] = [];
    while (startDate <= endDate) {
      if (this.isSunday(startDate)) {
        workdays.push(this.createSunday(startDate));
        this.nextDay(startDate);
        continue;
      }
      const findPublicHolidayResult = find(publicHolidays, { date: startDate.format(API_DATE) });
      if (findPublicHolidayResult) {
        workdays.push(this.createPublicHoliday(findPublicHolidayResult));
        this.nextDay(startDate);
        continue;
      }
      const leaveDays = this.findLeaveDay(leaveDates, startDate);
      if (leaveDays.length === 1) {
        if (leaveDays[0].workDayType === t.WorkDayType.HALF_DAY) {
          workdays.push(this.createHalfWorkDay(startDate));
        }
        workdays.push(leaveDays[0]);

        this.nextDay(startDate);
        continue;
      }
      if (leaveDays.length > 1) {
        workdays.push(...leaveDays);
        this.nextDay(startDate);
        continue;
      }
      workdays.push(this.createWorkday(startDate));
      this.nextDay(startDate);
    }
    return workdays;
  }

  static async calculateWorkDatesExcludingLeaves(
    start: moment.Moment,
    end: moment.Moment,
    userId: string
  ): Promise<WorkDay[]> {
    const startDate = moment(start);
    const endDate = moment(end);
    const currentYear = startDate.format('YYYY');
    const publicHolidays = await PublicHolidayCollection.getPublicHolidays(currentYear);
    const workdays: WorkDay[] = [];
    while (startDate <= endDate) {
      if (this.isSunday(startDate)) {
        workdays.push(this.createSunday(startDate));
        this.nextDay(startDate);
        continue;
      }
      const findPublicHolidayResult = find(publicHolidays, { date: startDate.format(API_DATE) });
      if (findPublicHolidayResult) {
        workdays.push(this.createPublicHoliday(findPublicHolidayResult));
        this.nextDay(startDate);
        continue;
      }
      workdays.push(this.createWorkday(startDate));
      this.nextDay(startDate);
    }
    return workdays;
  }

  static nextDay(startDate: moment.Moment): void {
    startDate.add(1, 'day');
  }

  static isSunday(startDate: moment.Moment): boolean {
    return startDate.format('d') === '0';
  }
  static isSaturday(startDate: moment.Moment): boolean {
    return startDate.format('d') === '6';
  }

  static createWorkday(startDate: moment.Moment): WorkDay {
    return {
      date: startDate.format(API_DATE),
      dayType: t.DayType.WORKDAY,
      workDayType: t.WorkDayType.FULL_DAY
    };
  }

  static createHalfWorkDay(startDate: moment.Moment): WorkDay {
    return {
      date: startDate.format(API_DATE),
      dayType: t.DayType.WORKDAY,
      workDayType: t.WorkDayType.HALF_DAY
    };
  }

  static createSunday(startDate: moment.Moment): WorkDay {
    return {
      date: startDate.format(API_DATE),
      dayType: t.DayType.WEEKEND,
      workDayType: t.WorkDayType.FULL_DAY
    };
  }

  static createPublicHoliday(findPublicHolidayResult: t.PublicHoliday): WorkDay {
    return {
      date: findPublicHolidayResult.date,
      dayType: t.DayType.PUBLIC_HOLIDAY,
      title: findPublicHolidayResult.title,
      workDayType: t.WorkDayType.FULL_DAY
    };
  }

  static calculateWorkDays(workdays: WorkDay[]): number {
    let days = 0;
    for (const workday of workdays) {
      // on a workday it can be a full or half day
      if (workday.dayType === t.DayType.WORKDAY) {
        if (workday.workDayType === t.WorkDayType.FULL_DAY) {
          days += 1.0;
        } else {
          days += 0.5;
        }
      }
      // on holiday and sickday it can only be a half day
      if (workday.dayType === t.DayType.HOLIDAY || workday.dayType === t.DayType.SICKDAY) {
        if (workday.workDayType === t.WorkDayType.HALF_DAY) {
          days += 0.5;
        }
      }
    }
    return days;
  }

  static findLeaveDay(leaveDates: t.Leave[], startDate: moment.Moment): WorkDay[] {
    const workdays = [];
    for (const leaveDate of leaveDates) {
      const leaveStart = moment(leaveDate.start.date);
      const leaveEnd = moment(leaveDate.end.date);
      while (leaveStart <= leaveEnd) {
        if (startDate.format(API_DATE) !== leaveStart.format(API_DATE)) {
          leaveStart.add(1, 'day');
          continue;
        }
        let workDayType = t.WorkDayType.FULL_DAY;
        if (leaveStart.format(API_DATE) === leaveDate.start.date) {
          workDayType = leaveDate.start.type;
        }
        if (leaveStart.format(API_DATE) === leaveDate.end.date) {
          workDayType = leaveDate.end.type;
        }
        workdays.push({
          date: leaveStart.format(API_DATE),
          dayType: t.DayType[leaveDate.type],
          workDayType
        });
        leaveStart.add(1, 'day');
      }
    }
    return workdays;
  }
}
