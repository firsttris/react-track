import * as t from 'common/types';

export const leaveDaysMock: t.Leave[] = [
  {
    id: 'c1ae2916-c518-4b61-b79d-8defee1f9c50',
    start: {
      date: '2017-10-25',
      type: t.WorkDayType.FULL_DAY
    },
    end: {
      date: '2017-10-31',
      type: t.WorkDayType.FULL_DAY
    },
    type: t.DayType.HOLIDAY,
    requestedLeaveDays: 1
  },
  {
    id: 'c1ae2916-c518-4b61-b79d-8defee1f9c51',
    start: {
      date: '2017-10-02',
      type: t.WorkDayType.HALF_DAY
    },
    end: {
      date: '2017-10-05',
      type: t.WorkDayType.FULL_DAY
    },
    type: t.DayType.SICKDAY,
    requestedLeaveDays: 1
  }
];

export const leaveMock = {
  id: 'af0536de-450c-4384-9902-51f2cd886e6b',
  start: {
    date: '2017-12-03',
    type: t.WorkDayType.HALF_DAY
  },
  end: {
    date: '2017-12-07',
    type: t.WorkDayType.FULL_DAY
  },
  type: t.DayType.HOLIDAY,
  requestedLeaveDays: 4
};

export const leaveDaysMockOnlyHoliday: t.Leave[] = [leaveMock];
