import * as m from 'common/mocks';
import * as moment from 'moment';
import * as t from 'common/types';
import { LeaveCollection } from './../collections/LeaveCollection';
import { PublicHolidayCollection } from './../collections/PublicHolidayCollection';
import { WorkDayCalculator } from './WorkDayCalculator';

describe('WorkDay Calculator Test', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should calculate work dates', async () => {
    const getPublicHolidaysSpy = jest
      .spyOn(PublicHolidayCollection, 'getPublicHolidays')
      .mockImplementation(() => Promise.resolve(m.publicHolidaysMock));
    const getLeaveDaysSpy = jest
      .spyOn(LeaveCollection, 'getUncalculatedLeaveDays')
      .mockImplementation(() => Promise.resolve(m.leaveDaysMockOnlyHoliday));
    const calculateLeaveDaySpy = jest.spyOn(WorkDayCalculator, 'findLeaveDay').mockImplementation(() => []);
    const startDate = moment('2017-05-01');
    const endDate = moment('2017-05-30');
    const userIdMock = '123456';
    const currentYear = startDate.format('YYYY');
    const workDates = await WorkDayCalculator.calculateWorkDates(startDate, endDate, userIdMock);
    expect(workDates.length).toBe(30);
    expect(getPublicHolidaysSpy).toHaveBeenCalledWith(currentYear);
    expect(getLeaveDaysSpy).toHaveBeenCalledWith(userIdMock, currentYear);
    expect(calculateLeaveDaySpy).toHaveBeenCalled();
  });

  it('should calculate work days', () => {
    const workDays = WorkDayCalculator.calculateWorkDays(m.workDatesMock);
    expect(workDays).toBe(19);
  });

  it('should calculate LeaveDay with empty array', async () => {
    const leaveDay = await WorkDayCalculator.findLeaveDay([], moment('2017-12-03'));
    expect(leaveDay).toEqual([]);
  });

  it('should calculate LeaveDay for date', async () => {
    const leaveDay = await WorkDayCalculator.findLeaveDay(m.leaveDaysMockOnlyHoliday, moment('2017-12-03'));
    expect(leaveDay).toEqual([{ date: '2017-12-03', workDayType: t.WorkDayType.HALF_DAY, dayType: t.DayType.HOLIDAY }]);
  });
});
