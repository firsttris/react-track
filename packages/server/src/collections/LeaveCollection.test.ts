jest.mock('lowdb/adapters/FileAsync');
import * as m from 'mocks';
import * as moment from 'moment';
import * as t from 'types';
import { LeaveErrorKeys } from './../errorKeys';
import { DirectoryHelper } from './../helper/DirectoryHelper';
import { LeaveCollection } from './LeaveCollection';
import { TimestampCollection } from './TimestampCollection';
import { UserCollection } from './UserCollection';
const dbKey = m.userMock.id;

describe('leaveCollection Tests', () => {
  beforeEach(async () => {
    await LeaveCollection.getDb(dbKey);
    const currentYear = moment().format('YYYY');
    LeaveCollection.db[dbKey].setState({ [currentYear]: [] });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getDb()', () => {
    it('should create database with empty array', async () => {
      const currentYear = moment().format('YYYY');
      const result = await LeaveCollection.getCol(m.userMock.id, currentYear);
      expect(result.value()).toEqual([]);
      expect(LeaveCollection.db[dbKey].getState()).toEqual({ [currentYear]: [] });
    });
  });

  describe('get()', () => {
    it('should return saved leavedays', async () => {
      const leavedays = [{ id: '1', startDate: moment().format(), endDate: moment().format() }];
      const currentYear = moment().format('YYYY');
      LeaveCollection.db[dbKey].setState({ [currentYear]: leavedays });
      const result = await LeaveCollection.getCol(m.userMock.id, currentYear);
      expect(result.value()).toEqual(leavedays);
    });
  });

  describe('insert()', () => {
    beforeEach(() => {
      jest.spyOn(LeaveCollection, 'getMaxNumberOfLeaveDays').mockImplementation(() => Promise.resolve(25));
    });

    it('should not insert leave if start date is after end date', () => {
      const newLeave = {
        start: {
          date: moment()
            .add(2, 'days')
            .format(),
          type: t.WorkDayType.FULL_DAY
        },
        end: {
          date: moment()
            .add(1, 'day')
            .format(),
          type: t.WorkDayType.FULL_DAY
        },
        type: t.DayType.HOLIDAY
      };

      return LeaveCollection.create(m.userMock.id, newLeave).catch(e => {
        expect(e.message).toEqual(LeaveErrorKeys.LEAVEDAY_START_DATE_AFTER_END_DATE);
        const currentYear = moment().format('YYYY');
        expect(LeaveCollection.db[dbKey].getState()).toEqual({ [currentYear]: [] });
      });
    });

    it('should not insert leave if start date is in other year than end date', () => {
      const newLeave = {
        start: {
          date: moment('2017-05-01').format(),
          type: t.WorkDayType.FULL_DAY
        },
        end: {
          date: moment('2017-05-01')
            .add(1, 'year')
            .format(),
          type: t.WorkDayType.FULL_DAY
        },
        type: t.DayType.HOLIDAY
      };

      return LeaveCollection.create(m.userMock.id, newLeave).catch(e => {
        expect(e.message).toEqual(LeaveErrorKeys.LEAVEDAY_DATES_IN_OTHER_YEAR);
      });
    });

    it('should not insert leave if timestamps exist in same timespan', () => {
      const spy = jest
        .spyOn(LeaveCollection, 'isTimestampAlreadyExisting')
        .mockImplementation(() => Promise.resolve(true));
      const newLeave = {
        start: {
          date: moment()
            .add(4, 'days')
            .format(),
          type: t.WorkDayType.FULL_DAY
        },
        end: {
          date: moment()
            .add(5, 'days')
            .format(),
          type: t.WorkDayType.FULL_DAY
        },
        type: t.DayType.HOLIDAY
      };

      return LeaveCollection.create(m.userMock.id, newLeave).catch(e => {
        expect(e.message).toEqual(LeaveErrorKeys.LEAVEDAY_TIMESTAMPS_ALREADY_EXIST);
        const currentYear = moment().format('YYYY');
        expect(spy).toBeCalledWith(m.userMock.id, newLeave);
        expect(LeaveCollection.db[dbKey].getState()).toEqual({ [currentYear]: [] });
      });
    });

    it('should not insert leave if other leave already exists in same timespan', () => {
      const spy: any = jest
        .spyOn(LeaveCollection, 'isLeaveDayTimestampAlreadyExisting')
        .mockImplementation(() => Promise.resolve(true));
      jest.spyOn(TimestampCollection, 'getTimestamps').mockImplementation(() => Promise.resolve([]));
      const newLeave = {
        start: {
          date: moment()
            .add(4, 'days')
            .format(),
          type: t.WorkDayType.FULL_DAY
        },
        end: {
          date: moment()
            .add(5, 'days')
            .format(),
          type: t.WorkDayType.FULL_DAY
        },
        type: t.DayType.HOLIDAY
      };

      return LeaveCollection.create(m.userMock.id, newLeave).catch(e => {
        expect(e.message).toEqual(LeaveErrorKeys.LEAVEDAY_ALREADY_EXISTS);
        expect(spy).toBeCalledWith(m.userMock.id, newLeave);
        const currentYear = moment().format('YYYY');
        expect(LeaveCollection.db[dbKey].getState()).toEqual({ [currentYear]: [] });
      });
    });

    it('should not insert leave if max number of leavedays are exceeded', async () => {
      const alreadyUsedLeaveDaysSpy: any = jest
        .spyOn(LeaveCollection, 'getAlreadyUsedLeaveDays')
        .mockImplementation(() => Promise.resolve(23));
      const leaveDaysForTimespanSpy: any = jest
        .spyOn(LeaveCollection, 'calculateLeaveDays')
        .mockImplementation(() => Promise.resolve(3));
      jest.spyOn(TimestampCollection, 'getTimestamps').mockImplementation(() => Promise.resolve([]));
      const newLeave = {
        start: {
          date: moment('2018-02-01')
            .add(2, 'days')
            .format(),
          type: t.WorkDayType.FULL_DAY
        },
        end: {
          date: moment('2018-02-01')
            .add(3, 'days')
            .format(),
          type: t.WorkDayType.FULL_DAY
        },
        type: t.DayType.HOLIDAY
      };

      let error = new Error(LeaveErrorKeys.LEAVEDAY_MISSING_DAYS);
      try {
        await LeaveCollection.create(m.userMock.id, newLeave);
      } catch (e) {
        if (e instanceof Error) {
          error = e;
        } else {
          throw e;
        }
      }
      const currentYear = moment(newLeave.start.date).format('YYYY');
      expect(error.message).toEqual(LeaveErrorKeys.LEAVEDAY_MISSING_DAYS);
      expect(alreadyUsedLeaveDaysSpy).toBeCalledWith(m.userMock.id, currentYear, expect.anything());
      expect(leaveDaysForTimespanSpy).toBeCalledWith(
        { date: newLeave.start.date, type: t.WorkDayType.FULL_DAY },
        { date: newLeave.end.date, type: t.WorkDayType.FULL_DAY },
        expect.anything(),
        m.userMock.id
      );
    });

    it(
      'should insert leave if no leave exists in same timespan and no timestamps ' +
        'are available in timespan and max number of leavedays are not exceeded',
      async () => {
        jest
          .spyOn(LeaveCollection, 'isLeaveDayTimestampAlreadyExisting')
          .mockImplementation(() => Promise.resolve(false));
        jest.spyOn(LeaveCollection, 'isTimestampAlreadyExisting').mockImplementation(() => Promise.resolve(false));
        jest.spyOn(LeaveCollection, 'getAlreadyUsedLeaveDays').mockImplementation(() => Promise.resolve(0));
        jest.spyOn(LeaveCollection, 'calculateLeaveDays').mockImplementation(() => Promise.resolve(3));
        const newLeave = {
          start: {
            date: moment()
              .add(5, 'days')
              .format(),
            type: t.WorkDayType.FULL_DAY
          },
          end: {
            date: moment()
              .add(7, 'days')
              .format(),
            type: t.WorkDayType.FULL_DAY
          },
          type: t.DayType.HOLIDAY
        };
        const currentYear = moment(newLeave.start.date).format('YYYY');
        LeaveCollection.db[dbKey].setState({ [currentYear]: [] });
        const result = await LeaveCollection.create(m.userMock.id, newLeave);
        expect(LeaveCollection.db[dbKey].getState()).toEqual({ [currentYear]: result });
      }
    );
  });

  describe('isLeaveDayTimestampAlreadyExisting()', () => {
    beforeEach(() => {
      jest.spyOn(UserCollection, 'getById').mockImplementation(() => Promise.resolve(m.userMock));
    });

    it('should return false if no leave exists in timespan', async () => {
      const leavedays = [
        {
          id: '1',
          start: {
            date: moment()
              .add(3, 'days')
              .format(),
            type: t.WorkDayType[t.WorkDayType.FULL_DAY]
          },
          end: {
            date: moment()
              .add(4, 'days')
              .format(),
            type: t.WorkDayType[t.WorkDayType.FULL_DAY]
          }
        }
      ];

      const currentYear = moment().format('YYYY');
      LeaveCollection.db[dbKey].setState({ [currentYear]: leavedays });
      const newLeave = {
        start: {
          date: moment()
            .add(5, 'days')
            .format(),
          type: t.WorkDayType.FULL_DAY
        },
        end: {
          date: moment()
            .add(6, 'days')
            .format(),
          type: t.WorkDayType.FULL_DAY
        },
        type: t.DayType.HOLIDAY
      };

      const result = await LeaveCollection.isLeaveDayTimestampAlreadyExisting(m.userMock.id, newLeave);

      expect(result).toBe(false);
    });

    it('should return true if leave exists in timespan', async () => {
      const leavedays = [
        {
          id: '1',
          start: {
            date: moment()
              .add(3, 'days')
              .format(),
            type: t.WorkDayType.FULL_DAY
          },
          end: {
            date: moment()
              .add(6, 'days')
              .format(),
            type: t.WorkDayType.FULL_DAY
          }
        }
      ];
      const currentYear = moment(leavedays[0].start.date).format('YYYY');
      LeaveCollection.db[dbKey].setState({ [currentYear]: leavedays });
      const newLeave = {
        start: {
          date: moment()
            .add(4, 'days')
            .format(),
          type: t.WorkDayType.FULL_DAY
        },
        end: {
          date: moment()
            .add(5, 'days')
            .format(),
          type: t.WorkDayType.FULL_DAY
        },
        type: t.DayType.HOLIDAY
      };

      const result = await LeaveCollection.isLeaveDayTimestampAlreadyExisting(m.userMock.id, newLeave);

      expect(result).toBe(true);
    });
  });

  describe('getMaxNumberOfLeaveDays()', () => {
    it('should return 0 if user has no holidays set', async () => {
      const user = { ...m.userMock };
      user.holidays = [];
      jest.spyOn(UserCollection, 'getById').mockImplementation(() => Promise.resolve(user));

      const maxNumberOfLeaveDays = await LeaveCollection.getMaxNumberOfLeaveDays(user.id, '2018');
      expect(maxNumberOfLeaveDays).toBe(0);
    });

    it('should return holidays of user', async () => {
      const user = { ...m.userMock };
      user.holidays = [{ days: 5, year: '2018' }];
      jest.spyOn(UserCollection, 'getById').mockImplementation(() => Promise.resolve(user));

      const maxNumberOfLeaveDays = await LeaveCollection.getMaxNumberOfLeaveDays(user.id, '2018');
      expect(maxNumberOfLeaveDays).toBe(5);
    });
  });

  describe('getAlreadyUsedLeaveDays()', () => {
    it('should count work days for leavedays in same year', async () => {
      const leaveDaysForTimespanSpy: any = jest.spyOn(LeaveCollection, 'calculateLeaveDays').mockImplementation(() => {
        return Promise.resolve(4);
      });
      const leaveDaysLastYear = [
        {
          id: '1',
          type: t.DayType.HOLIDAY,
          start: {
            date: moment()
              .subtract(1, 'year')
              .subtract(6, 'days'),
            type: t.WorkDayType.FULL_DAY
          },
          end: {
            date: moment().subtract(1, 'year'),
            type: t.WorkDayType.FULL_DAY
          }
        }
      ];
      const leavedaysThisYear = [
        {
          id: '2',
          type: t.DayType.HOLIDAY,
          start: {
            date: moment().subtract(3, 'days'),
            type: t.WorkDayType.FULL_DAY
          },
          end: {
            date: moment().subtract(1, 'day'),
            type: t.WorkDayType.FULL_DAY
          }
        }
      ];
      const state: any = {};
      state[moment().get('year')] = leavedaysThisYear;
      state[moment().get('year') - 1] = leaveDaysLastYear;
      LeaveCollection.db[dbKey].setState(state);

      const result = await LeaveCollection.getAlreadyUsedLeaveDays(
        m.userMock.id,
        moment()
          .get('year')
          .toString(),
        []
      );

      expect(result).toEqual(4);
      expect(leaveDaysForTimespanSpy).toHaveBeenCalledTimes(1);
      expect(leaveDaysForTimespanSpy).toHaveBeenCalledWith(
        { date: leavedaysThisYear[0].start.date, type: t.WorkDayType.FULL_DAY },
        { date: leavedaysThisYear[0].end.date, type: t.WorkDayType.FULL_DAY },
        expect.anything(),
        m.userMock.id
      );
    });
  });

  describe('isTimestampAlreadyExisting()', () => {
    it('should return false if no timestamps exists in timespan', async () => {
      const spy = jest.spyOn(TimestampCollection, 'getTimestamps').mockImplementation(() => Promise.resolve([]));
      const newLeave = {
        id: '',
        start: {
          date: moment()
            .add(5, 'days')
            .format(),
          type: t.WorkDayType.FULL_DAY
        },
        end: {
          date: moment()
            .add(6, 'days')
            .format(),
          type: t.WorkDayType.FULL_DAY
        },
        type: t.DayType.HOLIDAY
      };

      const result = await LeaveCollection.isTimestampAlreadyExisting(m.userMock.id, newLeave);

      expect(result).toBe(false);
      expect(spy).toHaveBeenCalledWith(m.userMock.id, moment(newLeave.start.date).format('YYYY'));
    });

    it('should return true if timestamps exist in timespan', async () => {
      const spy = jest.spyOn(TimestampCollection, 'getTimestamps').mockImplementation(() =>
        Promise.resolve([
          {
            id: '1',
            actualTime: moment()
              .add(5, 'days')
              .format(),
            time: moment()
              .add(5, 'days')
              .format(),
            type: 'card',
            status: 'K'
          }
        ])
      );
      const newLeave = {
        id: '',
        start: {
          date: moment()
            .add(5, 'days')
            .format(),
          type: t.WorkDayType.FULL_DAY
        },
        end: {
          date: moment()
            .add(6, 'days')
            .format(),
          type: t.WorkDayType.FULL_DAY
        },
        type: t.DayType.HOLIDAY
      };

      const result = await LeaveCollection.isTimestampAlreadyExisting(m.userMock.id, newLeave);

      expect(result).toBe(true);
      expect(spy).toHaveBeenCalledWith(m.userMock.id, moment(newLeave.start.date).format('YYYY'));
    });
  });

  describe('removeById()', () => {
    beforeEach(() => {
      jest.spyOn(UserCollection, 'getById').mockImplementation(() => Promise.resolve(m.userMock));
    });

    it('should remove leave from database', async () => {
      const leave: t.Leave = {
        id: '1',
        start: { date: moment('2017-06-01').format(), type: t.WorkDayType.FULL_DAY },
        end: { date: moment('2017-06-05').format(), type: t.WorkDayType.FULL_DAY },
        type: t.DayType.HOLIDAY,
        requestedLeaveDays: 5
      };
      const otherLeave = {
        id: '2',
        start: { date: moment('2017-07-02').format(), type: t.WorkDayType.FULL_DAY },
        end: { date: moment('2017-07-05').format(), type: t.WorkDayType.FULL_DAY }
      };
      LeaveCollection.db[dbKey].setState({ '2017': [leave, otherLeave] });

      await LeaveCollection.removeLeave(m.userMock.id, leave);

      expect(LeaveCollection.db[dbKey].getState()).toEqual({ '2017': [otherLeave] });
    });

    it('should return all leavedays after delete', async () => {
      const leave = {
        id: '1',
        start: { date: moment('2017-06-01').format(), type: t.WorkDayType.FULL_DAY },
        end: { date: moment('2017-06-05').format(), type: t.WorkDayType.FULL_DAY },
        type: t.DayType.HOLIDAY,
        requestedLeaveDays: 5
      };
      const otherLeave = {
        id: '2',
        start: { date: moment('2017-07-02').format(), type: t.WorkDayType.FULL_DAY },
        end: { date: moment('2017-07-05').format(), type: t.WorkDayType.FULL_DAY },
        requestedLeaveDays: 0
      };
      LeaveCollection.db[dbKey].setState({ '2017': [leave, otherLeave] });

      const result = await LeaveCollection.removeLeave(m.userMock.id, leave);

      expect(result).toEqual([otherLeave]);
    });
  });

  describe('remove()', () => {
    let fs: any;
    beforeEach(() => {
      fs = require('fs');
    });

    it('should not delete database if file does not exist', () => {
      const spy: any = jest.spyOn(fs, 'unlinkSync').mockImplementation(() => {
        return false;
      });
      LeaveCollection.remove(m.userMock.id);
      expect(spy).toHaveBeenCalledTimes(0);
    });

    it('should delete database if file does exist', () => {
      const spy: any = jest.spyOn(fs, 'unlinkSync').mockImplementation(() => {
        return true;
      });
      const existsSyncSpy: any = jest.spyOn(fs, 'existsSync').mockImplementation(() => {
        return true;
      });
      DirectoryHelper.getDatabasePath = jest.fn(() => {
        return 'leaveCollection.json';
      });
      LeaveCollection.remove(m.userMock.id);
      expect(existsSyncSpy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith('leaveCollection.json');
    });
  });
});
