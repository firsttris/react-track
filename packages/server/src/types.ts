import * as t from 'common/types';

export interface StatisticValues {
  timeComplain: number;
  timeSpent: number;
  timeLeft: number;
  timeEarned: number;
  timePause: number;
  totalHours: number;
}

export interface WorkDay {
  date: string;
  title?: string;
  dayType: t.DayType;
  hoursPerDay: number;
}
