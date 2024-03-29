import * as moment from 'moment';
import * as t from 'common/types';
import { UserCollection } from './../collections/UserCollection';
import { MomentHelper } from './../helper/MomentHelper';
import { StatisticValues, WorkDay } from './../types';
import { StatisticCalculator } from './StatisticCalculator';
import { WorkDayCalculator } from './WorkDayCalculator';
import { omitTypeName } from 'common/utils';

export class EvaluationCalculator {
  static async getEvaluationForUsers(date: string): Promise<t.UserEvaluation[]> {
    const userEvaluation: t.UserEvaluation[] = [];
    const users = await UserCollection.getUsers();
    for (const user of users) {
      const listOfEvaluation = await this.getEvaluationForMonth(date, user.id);
      userEvaluation.push({ userName: user.name, listOfEvaluation });
    }
    return userEvaluation;
  }

  static async getEvaluationForMonth(date: string, userId: string): Promise<t.Evaluation[]> {
    const firstDateInMonth = moment(date).startOf('month');
    const lastDateInMonth = moment(date).endOf('month');
    const daysOfMonth: t.Evaluation[] = [];
    const workDays = await WorkDayCalculator.calculateWorkDates(firstDateInMonth, lastDateInMonth, userId);
    for (const workDay of workDays) {
      if (this.isPublicHoliday(workDay)) {
        const publicHoliday = await this.createPublicHoliday(workDay, userId);
        daysOfMonth.push(publicHoliday);
        continue;
      }
      if (this.isLeaveDay(workDay)) {
        const leaveDay = await this.createLeaveDay(workDay, userId);
        daysOfMonth.push(leaveDay);
        continue;
      }
      if (this.isWorkDayOrWeekend(workDay)) {
        const workDayy = await this.createWorkDay(workDay, userId);
        daysOfMonth.push(workDayy);
      }
    }
    const total = this.calculateTotal(daysOfMonth);
    const totalHoliday = this.calculateTotalHoliday(daysOfMonth);
    const totalSickness = this.calculateTotalSickness(daysOfMonth);
    const totalShortTimeWork = this.calculateTotalShortTimeWork(daysOfMonth);
    daysOfMonth.push(...total, totalHoliday, totalSickness, totalShortTimeWork);
    return daysOfMonth;
  }

  static isPublicHoliday(workDay: WorkDay): boolean {
    return workDay.dayType === t.DayType.PUBLIC_HOLIDAY;
  }

  static isLeaveDay(workDay: WorkDay): boolean {
    return (
      workDay.dayType === t.DayType.SICKDAY ||
      workDay.dayType === t.DayType.HOLIDAY ||
      workDay.dayType === t.DayType.SCHOOLDAY ||
      workDay.dayType === t.DayType.SHORT_TIME_WORK
    );
  }

  static isWorkDayOrWeekend(workDay: WorkDay): boolean {
    return workDay.dayType === t.DayType.WORKDAY || workDay.dayType === t.DayType.WEEKEND;
  }

  static async createWorkDay(day: WorkDay, userId: string): Promise<t.Evaluation> {
    const result = await StatisticCalculator.getStatisticForWorkDay(day, userId);
    let title = day.dayType;
    if (day.dayType === t.DayType.WORKDAY && result.statistic.timeSpent <= 0) {
      title = t.DayType.AWAY;
    }
    return {
      date: day.date,
      title,
      icon: result.statistic.timeSpent > 0 ? 'fa-briefcase' : 'fa-times-circle',
      ...omitTypeName(this.formatStatistic(result.statistic))
    };
  }

  static formatStatistic(statistic: StatisticValues): t.Statistic {
    return {
      timeSpent: MomentHelper.formatDuration(moment.duration(statistic.timeSpent)),
      timeLeft: MomentHelper.formatDuration(moment.duration(statistic.timeLeft)),
      timeEarned: MomentHelper.formatDuration(moment.duration(statistic.timeEarned)),
      timePause: MomentHelper.formatDuration(moment.duration(statistic.timePause)),
      timeComplain: MomentHelper.formatDuration(moment.duration(statistic.timeComplain)),
      totalHours: MomentHelper.formatDuration(moment.duration(statistic.totalHours))
    };
  }

  static async createPublicHoliday(day: WorkDay, userId: string): Promise<t.Evaluation> {
    const result = await StatisticCalculator.getStatisticForWorkDay(day, userId);
    return {
      date: day.date,
      title: day.title || t.DayType.PUBLIC_HOLIDAY,
      icon: 'fa-tree',
      ...omitTypeName(this.formatStatistic(result.statistic))
    };
  }

  static async createLeaveDay(day: WorkDay, userId: string): Promise<t.Evaluation> {
    const result = await StatisticCalculator.getStatisticForWorkDay(day, userId);
    let icon = day.dayType === t.DayType.SICKDAY ? 'fa-user-md' : 'fa-sun-o';
    icon = day.dayType === t.DayType.SCHOOLDAY ? 'fa-graduation-cap' : 'fa-sun-o';
    return {
      date: day.date,
      title: day.dayType,
      icon,
      ...omitTypeName(this.formatStatistic(result.statistic))
    };
  }

  static calculateTotal(daysOfMonth: t.Evaluation[]): t.Evaluation[] {
    const timeSpent = moment.duration();
    const timeLeft = moment.duration();
    const timeEarned = moment.duration();
    const timePause = moment.duration();
    const timeComplain = moment.duration();
    const totalHours = moment.duration();
    for (const day of daysOfMonth) {
      timeSpent.add(moment.duration(day.timeSpent));
      timeLeft.add(moment.duration(day.timeLeft));
      timeEarned.add(moment.duration(day.timeEarned));
      timePause.add(moment.duration(day.timePause));
      timeComplain.add(moment.duration(day.timeComplain));
      totalHours.add(moment.duration(day.totalHours));
    }
    return [
      {
        date: '',
        title: '',
        icon: '',
        timeSpent: MomentHelper.formatDuration(timeSpent),
        timeLeft: MomentHelper.formatDuration(timeLeft),
        timeEarned: MomentHelper.formatDuration(timeEarned),
        timePause: MomentHelper.formatDuration(timePause),
        timeComplain: MomentHelper.formatDuration(timeComplain),
        totalHours: MomentHelper.formatDuration(totalHours)
      },
      {
        date: '',
        title: '',
        icon: '',
        timeSpent: MomentHelper.formatAsDecimal(timeSpent),
        timeLeft: MomentHelper.formatAsDecimal(timeLeft),
        timeEarned: MomentHelper.formatAsDecimal(timeEarned),
        timePause: MomentHelper.formatAsDecimal(timePause),
        timeComplain: MomentHelper.formatAsDecimal(timeComplain),
        totalHours: MomentHelper.formatAsDecimal(totalHours)
      }
    ];
  }

  static calculateTotalHoliday(daysOfMonth: t.Evaluation[]): t.Evaluation {
    const totalHours = moment.duration();
    for (const day of daysOfMonth) {
      if (day.title === t.DayType.HOLIDAY) {
        totalHours.add(day.timeSpent, 'hours');
      }
    }
    return {
      date: '',
      title: t.DayType.HOLIDAY,
      icon: '',
      timeSpent: '',
      timeLeft: '',
      timeEarned: MomentHelper.formatDuration(totalHours),
      timePause: '',
      timeComplain: '',
      totalHours: ''
    };
  }

  static calculateTotalSickness(daysOfMonth: t.Evaluation[]): t.Evaluation {
    const totalHours = moment.duration();
    for (const day of daysOfMonth) {
      if (day.title === t.DayType.SICKDAY) {
        totalHours.add(day.timeSpent, 'hours');
      }
    }
    return {
      date: '',
      title: 'SICK',
      icon: '',
      timeSpent: '',
      timeLeft: '',
      timeEarned: MomentHelper.formatDuration(totalHours),
      timePause: '',
      timeComplain: '',
      totalHours: ''
    };
  }

  static calculateTotalShortTimeWork(daysOfMonth: t.Evaluation[]): t.Evaluation {
    const totalHours = moment.duration();
    for (const day of daysOfMonth) {
      if (day.title === t.DayType.SHORT_TIME_WORK) {
        totalHours.add(day.timeSpent, 'hours');
      }
    }
    return {
      date: '',
      title: 'SHORT_TIME_WORK',
      icon: '',
      timeSpent: '',
      timeLeft: '',
      timeEarned: MomentHelper.formatDuration(totalHours),
      timePause: '',
      timeComplain: '',
      totalHours: ''
    };
  }
}
