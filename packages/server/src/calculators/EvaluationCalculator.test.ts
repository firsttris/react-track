import * as m from 'mocks';
import * as moment from 'moment';
import { StatisticCalculator } from './../calculators/StatisticCalculator';
import { EvaluationCalculator } from './EvaluationCalculator';
import { WorkDayCalculator } from './WorkDayCalculator';

describe('Evaluation Calculator Test', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('get Evaluation for month', async () => {
    const calculateWorkDatesSpy = jest
      .spyOn(WorkDayCalculator, 'calculateWorkDates')
      .mockImplementation(() => Promise.resolve(m.workDatesMock));
    const createPublicHolidaySpy = jest
      .spyOn(EvaluationCalculator, 'createPublicHoliday')
      .mockImplementation(() => Promise.resolve(m.evaluationPublicHolidayMock));
    const createWorkDaySpy = jest
      .spyOn(EvaluationCalculator, 'createWorkDay')
      .mockImplementation(() => Promise.resolve(m.evaluationWorkDayMock));
    const createLeaveDaySpy = jest
      .spyOn(EvaluationCalculator, 'createLeaveDay')
      .mockImplementation(() => Promise.resolve(m.evaluationLeaveDayMock));
    const calculateTotalSpy = jest
      .spyOn(EvaluationCalculator, 'calculateTotal')
      .mockImplementation(() => [m.evaluationTotalMock]);
    const calculateTotalHolidaySpy = jest
      .spyOn(EvaluationCalculator, 'calculateTotalHoliday')
      .mockImplementation(() => m.evaluationTotalHolidayMock);
    const calculateTotalSicknessSpy = jest
      .spyOn(EvaluationCalculator, 'calculateTotalSickness')
      .mockImplementation(() => m.evaluationTotalSicknessMock);
    const dateMock = '2017-10-04';
    const userIdMock = '552db259-48bc-41ab-9a9c-ad0b06d993e6';
    const result = await EvaluationCalculator.getEvaluationForMonth(dateMock, userIdMock);
    expect(result).toEqual(m.evaluationResultMock);
    const firstDateInMonth = moment(dateMock).startOf('month');
    const lastDateInMonth = moment(dateMock).endOf('month');
    expect(calculateWorkDatesSpy).toHaveBeenCalledWith(firstDateInMonth, lastDateInMonth, userIdMock);
    expect(createPublicHolidaySpy).toHaveBeenCalled();
    expect(createWorkDaySpy).toHaveBeenCalled();
    expect(createLeaveDaySpy).toHaveBeenCalled();
    expect(calculateTotalSpy).toHaveBeenCalled();
    expect(calculateTotalHolidaySpy).toHaveBeenCalled();
    expect(calculateTotalSicknessSpy).toHaveBeenCalled();
  });

  it('should create WorkdDay', async () => {
    const ggetStatisticForWorkDaySpy = jest
      .spyOn(StatisticCalculator, 'getStatisticForWorkDay')
      .mockImplementation(() => Promise.resolve(m.statisticResponseForOneDayMock));
    const userId = '1234567890';
    const workDay = await EvaluationCalculator.createWorkDay(m.workDayMock, userId);
    expect(ggetStatisticForWorkDaySpy).toHaveBeenCalledWith(m.workDayMock, userId);
    expect(workDay).toEqual(m.evaluationWorkDayMock);
  });

  it('should create PublicHoliday', async () => {
    const getStatisticForWorkDaySpy = jest
      .spyOn(StatisticCalculator, 'getStatisticForWorkDay')
      .mockImplementation(() => Promise.resolve(m.statisticResponseForOneDayMock));
    const userId = '1234567890';
    const publicHoliday = await EvaluationCalculator.createPublicHoliday(m.workDayPulicHolidayMock, userId);
    expect(getStatisticForWorkDaySpy).toHaveBeenCalledWith(m.workDayPulicHolidayMock, userId);
    expect(publicHoliday).toEqual(m.evaluationPublicHolidayMock);
  });

  it('should create LeaveDay', async () => {
    const getStatisticForWorkDaySpy = jest
      .spyOn(StatisticCalculator, 'getStatisticForWorkDay')
      .mockImplementation(() => Promise.resolve(m.statisticResponseForMonthMock));
    const userId = '1234567890';
    const leaveDay = await EvaluationCalculator.createLeaveDay(m.workDayHolidayMock, userId);
    expect(getStatisticForWorkDaySpy).toHaveBeenCalledWith(m.workDayHolidayMock, userId);
    expect(leaveDay).toEqual(m.evaluationLeaveMonthMock);
  });

  it('should calculate total', () => {
    const result = EvaluationCalculator.calculateTotal(m.evaluationMock);
    expect(result).toEqual(m.evaluationTotalMock);
  });

  it('should calculate total sickness', () => {
    const result = EvaluationCalculator.calculateTotalSickness(m.evaluationMock);
    expect(result).toEqual(m.evaluationTotalSicknessMock);
  });

  it('should calculate total holiday', () => {
    const result = EvaluationCalculator.calculateTotalHoliday(m.evaluationMock);
    expect(result).toEqual(m.evaluationTotalHolidayMock);
  });
});
