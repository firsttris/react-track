import { DayType, WorkDayType } from 'common/types';

export interface WorkDay {
  date: string;
  title?: string;
  dayType: DayType;
  workDayType: WorkDayType;
}

export const workDayHolidayMock: WorkDay = {
  date: '2017-06-01T00:00:00.000Z',
  workDayType: WorkDayType.FULL_DAY,
  dayType: DayType.HOLIDAY,
  title: ''
};

export const workDayMock: WorkDay = {
  date: '2017-06-01T00:00:00.000Z',
  workDayType: WorkDayType.FULL_DAY,
  dayType: DayType.WORKDAY,
  title: ''
};

export const workDayPulicHolidayMock: WorkDay = {
  date: '2017-06-01T00:00:00.000Z',
  workDayType: WorkDayType.FULL_DAY,
  dayType: DayType.PUBLIC_HOLIDAY,
  title: 'PublicHolidayName'
};

export const workDatesMock: WorkDay[] = [
  {
    date: '2017-06-01T00:00:00.000Z',
    workDayType: WorkDayType.FULL_DAY,
    dayType: DayType.SICKDAY,
    title: ''
  },
  {
    date: '2017-06-02T00:00:00.000Z',
    workDayType: WorkDayType.FULL_DAY,
    dayType: DayType.HOLIDAY,
    title: ''
  },
  {
    date: '2017-06-03T00:00:00.000Z',
    workDayType: WorkDayType.FULL_DAY,
    dayType: DayType.PUBLIC_HOLIDAY,
    title: ''
  },
  {
    date: '2017-06-06T00:00:00.000Z',
    workDayType: WorkDayType.FULL_DAY,
    dayType: DayType.WORKDAY,
    title: ''
  },
  {
    date: '2017-06-07T00:00:00.000Z',
    workDayType: WorkDayType.FULL_DAY,
    dayType: DayType.WORKDAY,
    title: ''
  },
  {
    date: '2017-06-08T00:00:00.000Z',
    workDayType: WorkDayType.FULL_DAY,
    dayType: DayType.WORKDAY,
    title: ''
  },
  {
    date: '2017-06-09T00:00:00.000Z',
    workDayType: WorkDayType.FULL_DAY,
    dayType: DayType.WORKDAY,
    title: ''
  },
  {
    date: '2017-06-10T00:00:00.000Z',
    workDayType: WorkDayType.FULL_DAY,
    dayType: DayType.WORKDAY,
    title: ''
  },
  {
    date: '2017-06-12T00:00:00.000Z',
    workDayType: WorkDayType.FULL_DAY,
    dayType: DayType.WORKDAY,
    title: ''
  },
  {
    date: '2017-06-13T00:00:00.000Z',
    workDayType: WorkDayType.FULL_DAY,
    dayType: DayType.WORKDAY,
    title: ''
  },
  {
    date: '2017-06-14T00:00:00.000Z',
    workDayType: WorkDayType.FULL_DAY,
    dayType: DayType.WORKDAY,
    title: ''
  },
  {
    date: '2017-06-16T00:00:00.000Z',
    workDayType: WorkDayType.FULL_DAY,
    dayType: DayType.WORKDAY,
    title: ''
  },
  {
    date: '2017-06-17T00:00:00.000Z',
    workDayType: WorkDayType.FULL_DAY,
    dayType: DayType.WORKDAY,
    title: ''
  },
  {
    date: '2017-06-19T00:00:00.000Z',
    workDayType: WorkDayType.FULL_DAY,
    dayType: DayType.WORKDAY,
    title: ''
  },
  {
    date: '2017-06-20T00:00:00.000Z',
    workDayType: WorkDayType.FULL_DAY,
    dayType: DayType.WORKDAY,
    title: ''
  },
  {
    date: '2017-06-21T00:00:00.000Z',
    workDayType: WorkDayType.FULL_DAY,
    dayType: DayType.WORKDAY,
    title: ''
  },
  {
    date: '2017-06-22T00:00:00.000Z',
    workDayType: WorkDayType.FULL_DAY,
    dayType: DayType.WORKDAY,
    title: ''
  },
  {
    date: '2017-06-23T00:00:00.000Z',
    workDayType: WorkDayType.FULL_DAY,
    dayType: DayType.WORKDAY,
    title: ''
  },
  {
    date: '2017-06-24T00:00:00.000Z',
    workDayType: WorkDayType.FULL_DAY,
    dayType: DayType.WORKDAY,
    title: ''
  },
  {
    date: '2017-06-26T00:00:00.000Z',
    workDayType: WorkDayType.FULL_DAY,
    dayType: DayType.WORKDAY,
    title: ''
  },
  {
    date: '2017-06-27T00:00:00.000Z',
    workDayType: WorkDayType.HALF_DAY,
    dayType: DayType.WORKDAY,
    title: ''
  },
  {
    date: '2017-06-28T00:00:00.000Z',
    workDayType: WorkDayType.HALF_DAY,
    dayType: DayType.WORKDAY,
    title: ''
  },
  {
    date: '2017-06-29T00:00:00.000Z',
    workDayType: WorkDayType.HALF_DAY,
    dayType: DayType.WORKDAY,
    title: ''
  },
  {
    date: '2017-06-30T00:00:00.000Z',
    workDayType: WorkDayType.HALF_DAY,
    dayType: DayType.WORKDAY,
    title: ''
  }
];
