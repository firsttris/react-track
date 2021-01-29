import * as t from 'common/types';

export const leaveDaysMock: t.Leave[] = [
  {
    id: 'c1ae2916-c518-4b61-b79d-8defee1f9c50',
    start: '2017-10-31',
    end: '2017-10-31',
    type: t.DayType.HOLIDAY,
    requestedLeaveDays: 1,
    hoursPerDay: 8
  },
  {
    id: 'c1ae2916-c518-4b61-b79d-8defee1f9c51',
    start: '2017-10-02',
    end: '2017-10-05',
    type: t.DayType.SICKDAY,
    requestedLeaveDays: 1,
    hoursPerDay: 8
  }
];

export const leaveMock: t.Leave = {
  id: 'af0536de-450c-4384-9902-51f2cd886e6b',
  start: '2017-12-03',
  end: '2017-12-07',
  type: t.DayType.HOLIDAY,
  hoursPerDay: 8,
  requestedLeaveDays: 4
};

export const leaveDaysMockOnlyHoliday: t.Leave[] = [leaveMock];
