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
      if (leaveDays.length) {
        workdays.push(...leaveDays);
        for (const leaveDay of leaveDays) {
          if (
            leaveDay.dayType === t.DayType.SHORT_TIME_WORK ||
            leaveDay.dayType === t.DayType.HOLIDAY ||
            leaveDay.dayType === t.DayType.SCHOOLDAY ||
            leaveDay.dayType === t.DayType.SICKDAY
          ) {
            workdays.push(this.createWorkday(startDate, leaveDay.hoursPerDay));
          }
        }
        this.nextDay(startDate);
        continue;
      }
      workdays.push(this.createWorkday(startDate, 8));
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
      workdays.push(this.createWorkday(startDate, 8));
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

  static createWorkday(startDate: moment.Moment, hoursPerDay: number): WorkDay {
    return {
      date: startDate.format(API_DATE),
      dayType: t.DayType.WORKDAY,
      hoursPerDay
    };
  }

  static createHalfWorkDay(startDate: moment.Moment): WorkDay {
    return {
      date: startDate.format(API_DATE),
      dayType: t.DayType.WORKDAY,
      hoursPerDay: 4
    };
  }

  static createSunday(startDate: moment.Moment): WorkDay {
    return {
      date: startDate.format(API_DATE),
      dayType: t.DayType.WEEKEND,
      hoursPerDay: 8
    };
  }

  static createPublicHoliday(findPublicHolidayResult: t.PublicHoliday): WorkDay {
    return {
      date: findPublicHolidayResult.date,
      dayType: t.DayType.PUBLIC_HOLIDAY,
      title: findPublicHolidayResult.title,
      hoursPerDay: 8
    };
  }

  static findLeaveDay(leaveDates: t.Leave[], startDate: moment.Moment): WorkDay[] {
    const workdays = [];
    for (const leaveDate of leaveDates) {
      const leaveStart = moment(leaveDate.start);
      const leaveEnd = moment(leaveDate.end);
      while (leaveStart <= leaveEnd) {
        if (startDate.format(API_DATE) !== leaveStart.format(API_DATE)) {
          leaveStart.add(1, 'day');
          continue;
        }
        workdays.push({
          date: leaveStart.format(API_DATE),
          dayType: t.DayType[leaveDate.type],
          hoursPerDay: leaveDate.hoursPerDay
        });
        leaveStart.add(1, 'day');
      }
    }
    return workdays;
  }
}
