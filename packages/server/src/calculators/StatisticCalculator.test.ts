jest.mock('lowdb/adapters/FileAsync');
import { API_DATE } from 'common/constants';
import * as m from 'common/mocks';
import * as moment from 'moment';
import { SettingsCollection } from './../collections/SettingsCollection';
import { TimestampCollection } from './../collections/TimestampCollection';
import { UserCollection } from './../collections/UserCollection';
import { StatisticCalculator } from './StatisticCalculator';
import { WorkDayCalculator } from './WorkDayCalculator';

const mockTime = moment('2018-02-01').format();
const userIdMock = '1234567890';

describe('Statistics Calculator Test', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should get formatted statistic for date', async () => {
    const getStatisticForDateSpy = jest
      .spyOn(StatisticCalculator, 'getStatisticForDate')
      .mockImplementation(() => Promise.resolve(m.staticValuesForOneDayMock));
    const result = await StatisticCalculator.getFormattedStatisticForDate(mockTime, userIdMock);
    expect(result.statisticForDate).toEqual({
      timeComplain: '00:00',
      timeEarned: '08:00',
      timeLeft: '00:00',
      timePause: '00:00',
      timeSpent: '08:00',
      totalHours: '08:00'
    });
    expect(result.selectedDate).toBe(mockTime);
    expect(getStatisticForDateSpy).toHaveBeenCalledWith(mockTime, userIdMock);
  });

  it('should get statistic for date', async () => {
    const getStatisticsForTimespanSpy = jest
      .spyOn(StatisticCalculator, 'getStatisticsForTimespan')
      .mockImplementation(() => Promise.resolve(m.statisticResponseForOneDayMock));
    const result = await StatisticCalculator.getStatisticForDate(mockTime, userIdMock);
    expect(result).toEqual({
      timeComplain: 0,
      timeEarned: 28800000,
      timeLeft: 0,
      timePause: 0,
      timeSpent: 28800000,
      totalHours: 28800000
    });
    expect(getStatisticsForTimespanSpy).toHaveBeenCalledWith(moment(mockTime), moment(mockTime), userIdMock);
  });

  it('should get statistic for week', async () => {
    const getStatisticsForTimespanSpy = jest
      .spyOn(StatisticCalculator, 'getStatisticsForTimespan')
      .mockImplementation(() => Promise.resolve(m.statisticResponseForWeekMock));
    const firstDateOfWeek = moment(mockTime).startOf('week');
    const lastDateOfWeek = moment(mockTime).endOf('week');
    const result = await StatisticCalculator.getStatisticForWeek(mockTime, userIdMock);
    expect(result.statisticForWeek).toEqual({
      timeComplain: '00:00',
      timeEarned: '32:00',
      timeLeft: '-12:00',
      timePause: '00:00',
      timeSpent: '32:00',
      totalHours: '44:00'
    });
    expect(result.selectedDate).toBe(mockTime);
    expect(getStatisticsForTimespanSpy).toHaveBeenCalledWith(firstDateOfWeek, lastDateOfWeek, userIdMock);
  });

  it('should get statistic for month', async () => {
    const getStatisticsForTimespanSpy = jest
      .spyOn(StatisticCalculator, 'getStatisticsForTimespan')
      .mockImplementation(() => Promise.resolve(m.statisticResponseForMonthMock));
    const firstDateInMonth = moment(mockTime).startOf('month');
    const lastDateInMonth = moment(mockTime).endOf('month');
    const result = await StatisticCalculator.getStatisticForMonth(mockTime, '1234567890');
    expect(result.statisticForMonth).toEqual({
      timeComplain: '00:00',
      timeEarned: '252:00',
      timeLeft: '76:00',
      timePause: '00:00',
      timeSpent: '252:00',
      totalHours: '176:00'
    });
    expect(result.selectedDate).toBe(mockTime);
    expect(result.hoursSpentForMonthPerDay.length).toBe(0);
    expect(getStatisticsForTimespanSpy).toHaveBeenCalledWith(firstDateInMonth, lastDateInMonth, userIdMock);
  });

  it('should get statistic for timespan', async () => {
    const calculateWorkDatesSpy = jest
      .spyOn(WorkDayCalculator, 'calculateWorkDates')
      .mockImplementation(() => Promise.resolve([m.workDayMock]));
    const getStatisticForWorkDaySpy = jest
      .spyOn(StatisticCalculator, 'getStatisticForWorkDay')
      .mockImplementation(() => Promise.resolve(m.statisticResponseForOneDayMock));
    const startOfWeek = moment('2017-06-15').startOf('isoWeek');
    const endOfWeek = moment('2017-06-15').endOf('isoWeek');
    const result = await StatisticCalculator.getStatisticsForTimespan(startOfWeek, endOfWeek, userIdMock);
    expect(calculateWorkDatesSpy).toHaveBeenCalledWith(startOfWeek, endOfWeek, userIdMock);
    expect(getStatisticForWorkDaySpy).toHaveBeenCalledTimes(1);
    expect(result.statistic).toEqual({
      timeComplain: 0,
      timeEarned: 28800000,
      timeLeft: 0,
      timePause: 0,
      timeSpent: 28800000,
      totalHours: 28800000
    });
  });

  it('should get statistic for workDay', async () => {
    const calculateWorkDayHoursSpy = jest
      .spyOn(StatisticCalculator, 'getTotalHours')
      .mockImplementation(() => Promise.resolve(5));
    const getTimestampsSpy = jest
      .spyOn(TimestampCollection, 'getTimestamps')
      .mockImplementation(() => Promise.resolve(m.timestampMock2));
    const calculateSpentTimeSpy = jest
      .spyOn(StatisticCalculator, 'calculateSpentTime')
      .mockImplementation(() => Promise.resolve(m.calculatedTimeMock));
    jest.spyOn(StatisticCalculator, 'getComplainsForWorkDay').mockImplementation(() => Promise.resolve(0));
    const result = await StatisticCalculator.getStatisticForWorkDay(m.workDayMock, userIdMock);
    expect(calculateWorkDayHoursSpy).toHaveBeenCalledTimes(1);
    expect(getTimestampsSpy).toHaveBeenCalled();
    expect(calculateSpentTimeSpy).toHaveBeenCalled();
    expect(result.statistic).toEqual({
      timeComplain: -0,
      timeEarned: 37800000,
      timeLeft: 37799995,
      timePause: -0,
      timeSpent: 37800000,
      totalHours: 5
    });
  });

  describe('should calculate SpentTime', () => {
    let getPauseSpy: any;
    beforeEach(() => {
      m.newTimestampMock.status = 'G';
      getPauseSpy = jest
        .spyOn(SettingsCollection, 'getPauses')
        .mockImplementation(() => Promise.resolve([m.pauseMock]));
    });

    it('should return 0 when timestamps are undefined', async () => {
      const result = await StatisticCalculator.calculateSpentTime(undefined);
      expect(result).toEqual({ timeEarned: 0, timePause: 0, timeSpent: 0 });
    });

    it('should return 0 when timestamps are empty', async () => {
      const result = await StatisticCalculator.calculateSpentTime([]);
      expect(getPauseSpy).toHaveBeenCalled();
      expect(result).toEqual({ timeEarned: 0, timePause: 0, timeSpent: 0 });
    });

    it('should return 4 minutes', async () => {
      m.newTimestampMock.status = 'K';
      const result = await StatisticCalculator.calculateSpentTime(m.timestampMock4);
      expect(getPauseSpy).toHaveBeenCalled();
      expect(moment(result.timeSpent).minutes()).toBe(4);
    });

    it('should return 6 minutes', async () => {
      const result = await StatisticCalculator.calculateSpentTime(m.timestampMock4);
      expect(getPauseSpy).toHaveBeenCalled();
      expect(moment(result.timeSpent).minutes()).toBe(6);
    });
  });

  describe('calculateYearSaldo()', () => {
    let getByIdSpy: any;
    let statisticSpy: any;
    beforeEach(() => {
      getByIdSpy = jest.spyOn(UserCollection, 'getById').mockImplementation(() => Promise.resolve(m.userMock));

      statisticSpy = jest.spyOn(StatisticCalculator, 'getStatisticsForTimespan').mockImplementation(() => {
        const mock = { ...m.statisticResponseMock };
        mock.statistic.timeLeft = 50 * 60 * 60 * 1000;
        return Promise.resolve(mock);
      });

      jest.spyOn(StatisticCalculator, 'getUserSaldoForYear').mockImplementation(() => {
        return 10 * 60 * 60 * 1000;
      });
    });

    it('should call statistic calculator with current year if user has no start date', async () => {
      const startDate = '2017-01-01';
      const yearSaldo = await StatisticCalculator.calculateYearSaldo(startDate, m.userMock.id);

      expect(yearSaldo).toEqual('60:00');
      expect(getByIdSpy).toHaveBeenCalledWith(m.userMock.id);
      const invocation = statisticSpy.mock.calls[0];
      expect(invocation[0]).toEqual(moment(startDate).startOf('year'));
      expect(invocation[1]).toEqual(moment(startDate));
      expect(invocation[2]).toEqual(m.userMock.id);
    });

    it('should call statistic calculator with current year if users start date is in last year', async () => {
      jest.spyOn(UserCollection, 'getById').mockImplementation(() => {
        const userMock = { ...m.userMock };
        userMock.startDate = '2016-01-02';
        return Promise.resolve(userMock);
      });

      const startDate = '2017-01-01';
      await StatisticCalculator.calculateYearSaldo(startDate, m.userMock.id);

      const invocation = statisticSpy.mock.calls[0];
      expect(invocation[0]).toEqual(moment(startDate));
    });

    it('should call statistic calculator with users start Date if users start date is this last year', async () => {
      const startDate = '2017-03-01';
      jest.spyOn(UserCollection, 'getById').mockImplementation(() => {
        const userMock = { ...m.userMock };
        userMock.startDate = startDate;
        return Promise.resolve(userMock);
      });

      await StatisticCalculator.calculateYearSaldo('2017-01-01', m.userMock.id);

      const invocation = statisticSpy.mock.calls[0];
      expect(invocation[0].format(API_DATE)).toEqual(moment(startDate).format(API_DATE));
    });
  });

  describe('getUserSaldoForYear()', () => {
    it('should return 0 if user has no saldos', () => {
      const user = { ...m.userMock };
      user.saldos = [];

      expect(StatisticCalculator.getUserSaldoForYear(user, '2016')).toEqual(0);
    });

    it('should return saldo in milliseconds if user has saldo', () => {
      const user = { ...m.userMock };
      user.saldos = [{ year: '2016', hours: 10 }];

      expect(StatisticCalculator.getUserSaldoForYear(user, '2016')).toEqual(10 * 60 * 60 * 1000);
    });
  });
});
