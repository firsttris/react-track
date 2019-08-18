import * as t from 'types';

export const calculatedTimeMock = { timeSpent: 37800000, timePause: 0, timeEarned: 37800000 };

export const staticValuesForWeekMock = {
  timeEarned: 115200000,
  timeLeft: -43200000,
  timePause: 0,
  timeComplain: 0,
  timeSpent: 115200000,
  totalHours: 158400000
};

export const statisticResponseForWeekMock = {
  statistic: staticValuesForWeekMock,
  hoursSpentPerDay: []
};

export const staticValuesForMonthMock = {
  timeEarned: 907200000,
  timeLeft: 273600000,
  timePause: 0,
  timeComplain: 0,
  timeSpent: 907200000,
  totalHours: 633600000
};

export const statisticResponseForMonthMock = {
  statistic: staticValuesForMonthMock,
  hoursSpentPerDay: []
};

export const staticValuesForOneDayMock = {
  timeEarned: 28800000,
  timeLeft: 0,
  timePause: 0,
  timeComplain: 0,
  timeSpent: 28800000,
  totalHours: 28800000
};

export const statisticResponseForOneDayMock = {
  statistic: staticValuesForOneDayMock,
  hoursSpentPerDay: []
};

export const statisticForDateResponseMock = {
  statisticForDate: {
    timeSpent: '0',
    timeLeft: '0',
    timeEarned: '0',
    timePause: '0',
    totalHours: '0',
    timeComplain: '0'
  },
  selectedDate: '2017-12-11'
};
export const statisticResponseMock = {
  statistic: {
    timeSpent: 0,
    timeLeft: 0,
    timeEarned: 0,
    timePause: 0,
    timeComplain: 0,
    totalHours: 0
  },
  hoursSpentPerDay: []
};

export const statisticDayMock: t.Statistic = {
  timeSpent: '9:00',
  timeLeft: '6:00',
  timeEarned: '0:00',
  timePause: '0:00',
  timeComplain: '0:00',
  totalHours: '8:00'
};

export const statisticWeekMock: t.Statistic = {
  timeSpent: '45:00',
  timeLeft: '30:00',
  timeEarned: '0:00',
  timePause: '0:00',
  timeComplain: '0:00',
  totalHours: '40:00'
};

export const statisticMonthMock: t.Statistic = {
  timeSpent: '180:00',
  timeLeft: '120:00',
  timeEarned: '0:00',
  timePause: '0:00',
  timeComplain: '0:00',
  totalHours: '160:00'
};
