import { API_DATE } from 'cons';
import { camelCase } from 'lodash';
import * as moment from 'moment';
import * as t from 'types';
import { ComplainCollection } from './../collections/ComplainCollection';
import { SettingsCollection } from './../collections/SettingsCollection';
import { TimestampCollection } from './../collections/TimestampCollection';
import { UserCollection } from './../collections/UserCollection';
import { MomentHelper } from './../helper/MomentHelper';
import { StatisticValues, WorkDay } from './../types';
import { WorkDayCalculator } from './WorkDayCalculator';

export class StatisticCalculator {
  static async getFormattedStatisticForDate(date: string, userId: string) {
    const result = await this.getStatisticForDate(date, userId);
    return {
      statisticForDate: this.formatStatistic(result),
      selectedDate: date
    };
  }

  static formatStatistic(result: StatisticValues): t.Statistic {
    return {
      timeSpent: MomentHelper.formatDuration(moment.duration(result.timeSpent)),
      timeLeft: MomentHelper.formatDuration(moment.duration(result.timeLeft)),
      timeEarned: MomentHelper.formatDuration(moment.duration(result.timeEarned)),
      timePause: MomentHelper.formatDuration(moment.duration(result.timePause)),
      timeComplain: MomentHelper.formatDuration(moment.duration(result.timeComplain)),
      totalHours: MomentHelper.formatDuration(moment.duration(result.totalHours))
    };
  }

  static async getStatisticForDate(date: string, userId: string) {
    const result = await this.getStatisticsForTimespan(moment(date), moment(date), userId);
    return {
      timeComplain: result.statistic.timeComplain,
      timeSpent: result.statistic.timeSpent,
      timeLeft: result.statistic.timeLeft,
      timeEarned: result.statistic.timeEarned,
      timePause: result.statistic.timePause,
      totalHours: result.statistic.totalHours
    };
  }

  static async getStatisticForWeek(date: string, userId: string) {
    const firstDateOfWeek = moment(date).startOf('week');
    const lastDateOfWeek = moment(date).endOf('week');
    const result = await this.getStatisticsForTimespan(firstDateOfWeek, lastDateOfWeek, userId);
    return {
      statisticForWeek: this.formatStatistic(result.statistic),
      selectedDate: date
    };
  }

  static async getStatisticForMonth(date: string, userId: string) {
    const firstDateInMonth = moment(date).startOf('month');
    const lastDateInMonth = moment(date).endOf('month');
    const result = await this.getStatisticsForTimespan(firstDateInMonth, lastDateInMonth, userId);
    return {
      statisticForMonth: this.formatStatistic(result.statistic),
      hoursSpentForMonthPerDay: result.hoursSpentPerDay,
      selectedDate: date
    };
  }

  static async calculateSpentTime(timestamps?: t.Timestamp[]) {
    if (!timestamps) {
      return { timeSpent: 0, timePause: 0, timeEarned: 0 };
    }
    const pauses = await SettingsCollection.getPauses();
    let timePause = 0;
    let timeSpent = 0;
    for (let i = 0; i < timestamps.length - 1; i += 2) {
      const firstTimestamp = timestamps[i];
      const secondTimestamp = timestamps[i + 1];
      if (firstTimestamp.status.includes('K') && secondTimestamp.status.includes('G')) {
        timeSpent += moment(secondTimestamp.time).valueOf() - moment(firstTimestamp.time).valueOf();
      }
    }

    for (const pause of pauses) {
      if (moment.duration(timeSpent) >= moment.duration(pause.time)) {
        timePause += Number(pause.durationInMinutes);
      }
    }

    timePause = timePause * 60 * 1000;
    const timeEarned = timeSpent - timePause;
    return { timeSpent, timePause, timeEarned };
  }

  static async getStatisticsForTimespan(start: moment.Moment, end: moment.Moment, userId: string) {
    const hoursSpentPerDay: t.HoursPerDay[] = [];
    const statistic = {
      totalHours: 0,
      timeSpent: 0,
      timePause: 0,
      timeEarned: 0,
      timeComplain: 0,
      timeLeft: 0
    };
    const workDays = await WorkDayCalculator.calculateWorkDates(start, end, userId);
    for (const workDay of workDays) {
      const result = await this.getStatisticForWorkDay(workDay, userId);
      statistic.timeComplain += result.statistic.timeComplain;
      statistic.timeSpent += result.statistic.timeSpent;
      statistic.timePause += result.statistic.timePause;
      statistic.timeEarned += result.statistic.timeEarned;
      statistic.timeLeft += result.statistic.timeLeft;
      statistic.totalHours += result.statistic.totalHours;
      hoursSpentPerDay.push(...result.hoursSpentPerDay);
    }
    return {
      statistic,
      hoursSpentPerDay
    };
  }

  static async getStatisticForWorkDay(workDay: WorkDay, userId: string) {
    const hoursSpentPerDay: t.HoursPerDay[] = [];
    let statistic = {
      totalHours: await this.getTotalHours(workDay, userId),
      timeSpent: 0,
      timePause: 0,
      timeEarned: 0,
      timeComplain: 0,
      timeLeft: 0
    };
    if (this.isBillable(workDay.dayType)) {
      const timestampsForDay = await TimestampCollection.getTimestamps(userId, workDay.date);
      statistic = { ...statistic, ...(await this.calculateSpentTime(timestampsForDay)) };
      statistic.timeComplain = await StatisticCalculator.getComplainsForWorkDay(userId, workDay);
      statistic.timeEarned -= statistic.timeComplain;
      hoursSpentPerDay.push(this.calculateHoursPerDay(timestampsForDay, workDay, statistic.timeEarned));
    } else if (this.isLeaveDay(workDay.dayType)) {
      const time = await StatisticCalculator.getTimeForLeaveDay(workDay, userId);
      statistic.timeSpent = time;
      statistic.timeEarned = time;
    }
    statistic.timePause *= -1;
    statistic.timeComplain *= -1;
    statistic.timeLeft = statistic.timeEarned - statistic.totalHours;
    return {
      statistic,
      hoursSpentPerDay
    };
  }

  static async getTimeForLeaveDay(workDay: WorkDay, userId: string): Promise<number> {
    const WorkTimeSettings: any = await SettingsCollection.getWorkTimeSettings();
    const paidType: t.WorkDayPaymentType = WorkTimeSettings[camelCase(workDay.dayType)];
    if (paidType) {
      if (paidType === t.WorkDayPaymentType.PAID) {
        const time = await StatisticCalculator.getHoursForDay(workDay, userId);
        if (workDay.workDayType === t.WorkDayType.HALF_DAY) {
          return time / 2;
        }
        return time;
      }
      if (paidType === t.WorkDayPaymentType.UNPAID) {
        return 0;
      }
    }
    return 0;
  }

  static async getTotalHours(workDay: WorkDay, userId: string) {
    if (workDay.dayType === t.DayType.WORKDAY || workDay.dayType === t.DayType.WEEKEND) {
      const totalHours = await StatisticCalculator.getHoursForDay(workDay, userId);
      if (workDay.workDayType === t.WorkDayType.HALF_DAY) {
        return totalHours / 2;
      }
      return totalHours;
    }
    return this.getTimeForLeaveDay(workDay, userId);
  }

  static async getHoursForDay(workDay: WorkDay, userId: string) {
    const user = await UserCollection.getById(userId);
    const workTimes: any = user.workTimes;
    const weekDayName = moment(workDay.date)
      .format('dddd')
      .toLowerCase();
    const hours: string = workTimes[weekDayName].mandatoryHours;
    return moment.duration(hours).asMilliseconds();
  }

  static async getComplainsForWorkDay(userId: string, workDay: WorkDay) {
    let timeComplain = 0;
    const complains = await ComplainCollection.get(userId, workDay.date);
    for (const complain of complains) {
      timeComplain += moment.duration(complain.duration).asMilliseconds();
    }
    return timeComplain;
  }

  static calculateHoursPerDay(timestamps: t.Timestamp[], workDay: WorkDay, spentTime: number): t.HoursPerDay {
    const hours = moment
      .duration(spentTime)
      .asHours()
      .toPrecision(2);
    let come = 0;
    let go = 0;
    const hasError = !TimestampCollection.isTimestampsValid(timestamps);
    if (timestamps.length) {
      if (hasError) {
        come = 0;
        go = 24;
      } else {
        come = moment.duration(moment(timestamps[0].actualTime).format('HH:mm')).asHours();
        go = moment.duration(moment(timestamps[timestamps.length - 1].actualTime).format('HH:mm')).asHours();
        if (go === come) {
          go += 0.1;
        }
      }
    }
    return {
      day: moment(workDay.date).get('date'),
      hours: spentTime ? hours : '',
      range: [this.round(come), this.round(go)],
      hasError
    };
  }

  static round(num: number): number {
    return Math.round(num * 100) / 100;
  }

  static async calculateYearSaldo(date: string, userId: string): Promise<string> {
    let startDate = moment(date).startOf('year');
    const user = await UserCollection.getById(userId);
    if (user.startDate) {
      const userStartDate = moment(user.startDate, API_DATE);
      if (userStartDate.year() === startDate.year()) {
        startDate = userStartDate;
      }
    }
    const statisticForYear = await this.getStatisticsForTimespan(startDate, moment(date), user.id);
    const userSaldo = this.getUserSaldoForYear(user, moment(date).format('YYYY'));
    return MomentHelper.formatDuration(moment.duration(statisticForYear.statistic.timeLeft + userSaldo));
  }

  static getUserSaldoForYear(user: t.User, year: string): number {
    if (!user.saldos) {
      return 0;
    }

    return user.saldos.reduce((a, b) => a + b.hours * 60 * 60 * 1000, 0);
  }

  static isBillable(value: t.DayType): boolean {
    return value === t.DayType.WORKDAY || value === t.DayType.WEEKEND;
  }

  static isLeaveDay(value: t.DayType): boolean {
    return (
      value === t.DayType.HOLIDAY ||
      value === t.DayType.SICKDAY ||
      value === t.DayType.SCHOOLDAY ||
      value === t.DayType.PUBLIC_HOLIDAY
    );
  }
}
