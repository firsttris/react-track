jest.mock('lowdb/adapters/FileAsync');
import { API_DATE } from 'common/constants';
import * as mocks from 'common/mocks';
import * as moment from 'moment';
import * as t from 'common/types';
import { TimestampsErrorKeys } from './../errorKeys';
import { TimestampCollection } from './TimestampCollection';

const dbKey = '12345';

describe('TimestampCollection Tests', () => {
  beforeEach(async () => {
    await TimestampCollection.getDb(dbKey);
    TimestampCollection.db[dbKey].setState({});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getDateKey()', () => {
    it('should generate a date key', () => {
      const timestamp = {
        id: '123456789',
        time: moment({
          years: 2017,
          months: 6 - 1,
          date: 8,
          hours: 9,
          minutes: 30,
          seconds: 40,
          milliseconds: 0
        }).format(),
        actualTime: '',
        status: 'K',
        type: 'card'
      };

      const key = TimestampCollection.getDateKey(timestamp);

      expect(key).toBe('2017-06-08');
    });
  });

  describe('getTimestamps()', () => {
    it('should call db to get timestamps for date and user', async () => {
      const spy = jest.spyOn(TimestampCollection, 'getCol');

      await TimestampCollection.getTimestamps('12345', '2017-06-08');

      expect(spy).toHaveBeenCalledWith('12345', '2017-06-08');
    });

    it('should return timestamps for date and user', async () => {
      const timestamps = [{ id: '123456789', time: moment(), status: 'auto', type: 'G' }];
      TimestampCollection.db[dbKey].setState({ '2017-06-08': timestamps });
      const result = await TimestampCollection.getTimestamps('12345', '2017-06-08');

      expect(result).toEqual(timestamps);
    });
  });

  describe('update()', () => {
    const timestamp1 = {
      id: '123456789',
      time: moment({
        years: 2017,
        months: 6 - 1,
        date: 8,
        hours: 9,
        minutes: 30
      }).format(),
      actualTime: '',
      status: 'auto',
      type: 'K'
    };
    const timestamp2 = {
      id: '123456789',
      time: moment({
        years: 2017,
        months: 6 - 1,
        date: 8,
        hours: 7,
        minutes: 30
      }).format(),
      actualTime: '',
      status: 'auto',
      type: 'G'
    };
    const timestamps = [timestamp1, timestamp2];

    it('should return error if timestamps are not valid', async () => {
      jest.spyOn(TimestampCollection, 'isTimestampsValid').mockImplementationOnce(() => false);

      const result = await TimestampCollection.update('12345', '2017-06-08', timestamps);

      expect(result.timestamps).toEqual(timestamps);
      expect(result.error).toEqual(TimestampsErrorKeys.INVALID_TIMESTAMPS);
    });

    it('should set sorted timestamps', async () => {
      const spy = jest.spyOn(TimestampCollection, 'set');
      jest.spyOn(TimestampCollection, 'isTimestampsValid').mockImplementationOnce(() => true);

      await TimestampCollection.update('12345', '2017-06-08', timestamps);

      expect(spy).toBeCalledWith('12345', '2017-06-08', [timestamp2, timestamp1]);
    });

    it('should return timestamps from collection', async () => {
      const timestampsToReturn = [timestamp1, timestamp2];
      jest.spyOn(TimestampCollection, 'getTimestamps').mockImplementation(() => Promise.resolve(timestampsToReturn));
      jest.spyOn(TimestampCollection, 'isTimestampsValid').mockImplementationOnce(() => true);

      const result = await TimestampCollection.update('12345', '2017-06-08', timestamps);

      expect(result).toEqual({ timestamps: timestampsToReturn });
    });
  });

  describe('add()', () => {
    const user: t.User = {
      id: '12345',
      code: '1234',
      name: 'Max Mustermann',
      startDate: '',
      role: t.UserRole.USER,
      workTimes: {
        monday: { startTime: '00:00', endTime: '00:00', mandatoryHours: '00:00' },
        tuesday: { startTime: '00:00', endTime: '00:00', mandatoryHours: '00:00' },
        wednesday: { startTime: '00:00', endTime: '00:00', mandatoryHours: '00:00' },
        thursday: { startTime: '00:00', endTime: '00:00', mandatoryHours: '00:00' },
        friday: { startTime: '00:00', endTime: '00:00', mandatoryHours: '00:00' },
        saturday: { startTime: '00:00', endTime: '00:00', mandatoryHours: '00:00' },
        sunday: { startTime: '00:00', endTime: '00:00', mandatoryHours: '00:00' }
      },
      holidays: [],
      saldos: []
    };

    it('should get timestamps for user', async () => {
      const spy = jest.spyOn(TimestampCollection, 'getTimestamps');

      await TimestampCollection.add(user);

      const args = spy.mock.calls[0];
      expect(args[0]).toEqual(user.id);
      expect(args[1]).toEqual(moment().format(API_DATE));
    });

    it('should add time to timestamp from actual time', async () => {
      const spy = jest.spyOn(TimestampCollection, 'addTimeToTimestamp');

      await TimestampCollection.add(user);

      const args = spy.mock.calls[0];
      const ts: t.Timestamp = args[0];
      expect(ts.actualTime).not.toEqual('');
      expect(args[1]).toEqual(user);
    });

    it('should add timestamp with status K if no timestamps exist', async () => {
      const spy = jest.spyOn(TimestampCollection, 'push');

      await TimestampCollection.add(user);

      const args = spy.mock.calls[0];
      const userId = args[0];
      expect(userId).toEqual(user.id);
      const collectionKey = args[1];
      expect(collectionKey).toBe(moment().format(API_DATE));
      const ts = args[2];
      expect(ts.id).not.toBeUndefined();
      expect(ts.type).toEqual('card');
      expect(ts.status).toEqual('K');
    });

    it('should add timestamp with status G if last timestamp is K', async () => {
      jest
        .spyOn(TimestampCollection, 'getTimestamps')
        .mockImplementation(() =>
          Promise.resolve([
            { id: '1', actualTime: moment().format(), time: moment().format(), type: 'card', status: 'K' }
          ])
        );
      const spy = jest.spyOn(TimestampCollection, 'push');

      await TimestampCollection.add(user);

      const args = spy.mock.calls[0];
      const userId = args[0];
      expect(userId).toEqual(user.id);
      const collectionKey = args[1];
      expect(collectionKey).toBe(moment().format(API_DATE));
      const ts = args[2];
      expect(ts.id).not.toBeUndefined();
      expect(ts.type).toEqual('card');
      expect(ts.status).toEqual('G');
    });

    it('should add timestamp with status K if last timestamp is G', async () => {
      jest
        .spyOn(TimestampCollection, 'getTimestamps')
        .mockImplementation(() =>
          Promise.resolve([
            { id: '1', actualTime: moment().format(), time: moment().format(), type: 'card', status: 'G' }
          ])
        );
      const spy = jest.spyOn(TimestampCollection, 'push');

      await TimestampCollection.add(user);

      const args = spy.mock.calls[0];
      const userId = args[0];
      expect(userId).toEqual(user.id);
      const collectionKey = args[1];
      expect(collectionKey).toBe(moment().format(API_DATE));
      const ts = args[2];
      expect(ts.id).not.toBeUndefined();
      expect(ts.type).toEqual('card');
      expect(ts.status).toEqual('K');
    });
  });

  describe('are timestamps valid', () => {
    it('should return true if timestamps are empty', () => {
      expect(TimestampCollection.isTimestampsValid([])).toBe(true);
    });

    it('should return false if the first timestamp has the status G', () => {
      const timestamps = [
        {
          id: '123456789',
          time: moment({
            years: 2017,
            months: 6 - 1,
            date: 8,
            hours: 9,
            minutes: 30
          }).format(),
          actualTime: '',
          type: 'auto',
          status: 'G'
        }
      ];

      expect(TimestampCollection.isTimestampsValid(timestamps)).toBe(false);
    });

    it('should return false if timestamps have the same status', () => {
      const timestamps = [
        {
          id: '123456789',
          time: moment({
            years: 2017,
            months: 6 - 1,
            date: 8,
            hours: 9,
            minutes: 30
          }).format(),
          actualTime: '',
          type: 'auto',
          status: 'K'
        },
        {
          id: '123456789',
          time: moment({
            years: 2017,
            months: 6 - 1,
            date: 8,
            hours: 9,
            minutes: 30
          }).format(),
          actualTime: '',
          type: 'auto',
          status: 'K'
        }
      ];

      expect(TimestampCollection.isTimestampsValid(timestamps)).toBe(false);
    });

    it('should return false if timestamp has empty status', () => {
      const timestamps = [
        {
          id: '123456789',
          time: moment({
            years: 2017,
            months: 6 - 1,
            date: 8,
            hours: 9,
            minutes: 32
          }).format(),
          actualTime: '',
          type: 'auto',
          status: 'K'
        },
        {
          id: '123456789',
          time: moment({
            years: 2017,
            months: 6 - 1,
            date: 8,
            hours: 9,
            minutes: 30
          }).format(),
          actualTime: '',
          type: 'auto',
          status: ''
        }
      ];

      expect(TimestampCollection.isTimestampsValid(timestamps)).toBe(false);
    });

    it('should return false if last timestamp has status K', () => {
      const timestamps = [
        {
          id: '1',
          time: moment({
            years: 2017,
            months: 6 - 1,
            date: 8,
            hours: 9,
            minutes: 3
          }).format(),
          actualTime: '',
          type: 'auto',
          status: 'K'
        },
        {
          id: '2',
          time: moment({
            years: 2017,
            months: 6 - 1,
            date: 8,
            hours: 9,
            minutes: 32
          }).format(),
          actualTime: '',
          type: 'auto',
          status: 'G'
        },
        {
          id: '3',
          time: moment({
            years: 2017,
            months: 6 - 1,
            date: 8,
            hours: 9,
            minutes: 34
          }).format(),
          actualTime: '',
          type: 'auto',
          status: 'K'
        }
      ];

      expect(TimestampCollection.isTimestampsValid(timestamps)).toBe(false);
    });

    it('else it should return true', () => {
      const timestamps = [
        {
          id: '123456789',
          time: moment({
            years: 2017,
            months: 6 - 1,
            date: 8,
            hours: 9,
            minutes: 30
          }).format(),
          actualTime: '',
          type: 'auto',
          status: 'K'
        },
        {
          id: '123456789',
          time: moment({
            years: 2017,
            months: 6 - 1,
            date: 8,
            hours: 9,
            minutes: 32
          }).format(),
          type: 'auto',
          actualTime: '',
          status: 'G'
        }
      ];

      expect(TimestampCollection.isTimestampsValid(timestamps)).toBe(true);
    });
  });

  describe('addTimeToTimestamp()', () => {
    describe('come timestamp', () => {
      it('should set time to actual time if actual time >= users start time', () => {
        const user = { ...mocks.userMock };

        const comeTime = moment({
          years: 2017,
          months: 5,
          date: 8,
          hours: 8,
          minutes: 31
        });
        const comeTimestamp = {
          id: '1',
          time: '',
          actualTime: comeTime.format(),
          type: 'card',
          status: 'K'
        };

        const weekDayName = comeTime.format('dddd').toLowerCase();
        const workTimes: any = user.workTimes;
        workTimes[weekDayName].startTime = '8:30';

        TimestampCollection.addTimeToTimestamp(comeTimestamp, user);

        expect(comeTimestamp.time).toEqual(comeTime.format());
      });

      it('should set time to actual time if user has no start time', () => {
        const user = { ...mocks.userMock };

        const comeTime = moment({
          years: 2017,
          months: 5,
          date: 8,
          hours: 8,
          minutes: 31
        });
        const comeTimestamp = {
          id: '1',
          time: '',
          actualTime: comeTime.format(),
          type: 'card',
          status: 'K'
        };

        const weekDayName = comeTime.format('dddd').toLowerCase();
        const workTimes: any = user.workTimes;
        workTimes[weekDayName].startTime = '0';
        workTimes[weekDayName].endTime = '0';

        TimestampCollection.addTimeToTimestamp(comeTimestamp, user);

        expect(comeTimestamp.time).toEqual(comeTime.format());
      });

      it('should set time to users start time if actual time < users start time', () => {
        const user = { ...mocks.userMock };

        const comeTime = moment({
          years: 2017,
          months: 5,
          date: 8,
          hours: 8,
          minutes: 29
        });
        const comeTimestamp = {
          id: '1',
          time: '',
          actualTime: comeTime.format(),
          type: 'card',
          status: 'K'
        };

        const weekDayName = comeTime.format('dddd').toLowerCase();
        const workTimes: any = user.workTimes;
        workTimes[weekDayName].startTime = '8:30';

        TimestampCollection.addTimeToTimestamp(comeTimestamp, user);

        expect(comeTimestamp.time).toEqual(
          moment({
            years: 2017,
            months: 5,
            date: 8,
            hours: 8,
            minutes: 30
          }).format()
        );
      });

      it('should set time to users end time if actual time > users end time', () => {
        const user = { ...mocks.userMock };

        const comeTime = moment({
          years: 2017,
          months: 5,
          date: 8,
          hours: 18,
          minutes: 31
        });
        const comeTimestamp = {
          id: '1',
          time: '',
          actualTime: comeTime.format(),
          type: 'card',
          status: 'K'
        };

        const weekDayName = comeTime.format('dddd').toLowerCase();
        const workTimes: any = user.workTimes;
        workTimes[weekDayName].startTime = '8:30';
        workTimes[weekDayName].endTime = '18:30';

        TimestampCollection.addTimeToTimestamp(comeTimestamp, user);

        expect(comeTimestamp.time).toEqual(
          moment({
            years: 2017,
            months: 5,
            date: 8,
            hours: 18,
            minutes: 30
          }).format()
        );
      });
    });

    describe('go timestamp', () => {
      it('should set time to actual time if actual time < users end time', () => {
        const user = { ...mocks.userMock };

        const goTime = moment({
          years: 2017,
          months: 5,
          date: 8,
          hours: 17,
          minutes: 59
        });
        const goTimestamp = {
          id: '1',
          time: '',
          actualTime: goTime.format(),
          type: 'card',
          status: 'G'
        };
        const weekDayName = goTime.format('dddd').toLowerCase();
        const workTimes: any = user.workTimes;
        workTimes[weekDayName].endTime = '18:00';

        TimestampCollection.addTimeToTimestamp(goTimestamp, user);

        expect(goTimestamp.time).toEqual(goTime.format());
      });

      it('should set time to actual time if user has no end time', () => {
        const user = { ...mocks.userMock };
        const goTime = moment({
          years: 2017,
          months: 5,
          date: 8,
          hours: 18,
          minutes: 1
        });
        const goTimestamp = {
          id: '1',
          time: '',
          actualTime: goTime.format(),
          type: 'card',
          status: 'G'
        };
        const weekDayName = goTime.format('dddd').toLowerCase();
        const workTimes: any = user.workTimes;
        workTimes[weekDayName].endTime = '';

        TimestampCollection.addTimeToTimestamp(goTimestamp, user);

        expect(goTimestamp.time).toEqual(goTime.format());
      });

      it('should set time to users end time if actual time >= users end time', () => {
        const user = { ...mocks.userMock };

        const goTime = moment({
          years: 2017,
          months: 5,
          date: 8,
          hours: 18,
          minutes: 31
        });
        const goTimestamp = {
          id: '1',
          time: '',
          actualTime: goTime.format(),
          type: 'card',
          status: 'G'
        };
        const weekDayName = goTime.format('dddd').toLowerCase();
        const workTimes: any = user.workTimes;
        workTimes[weekDayName].endTime = '18:30';

        TimestampCollection.addTimeToTimestamp(goTimestamp, user);

        expect(goTimestamp.time).toEqual(
          moment({
            years: 2017,
            months: 5,
            date: 8,
            hours: 18,
            minutes: 30
          }).format()
        );
      });

      it('should set time to users start time if actual time <= users start time', () => {
        const user = { ...mocks.userMock };

        const goTime = moment({
          years: 2017,
          months: 5,
          date: 8,
          hours: 7,
          minutes: 29
        });
        const weekDayName = goTime.format('dddd').toLowerCase();
        const workTimes: any = user.workTimes;
        workTimes[weekDayName].startTime = '7:30';
        workTimes[weekDayName].endTime = '18:30';
        const goTimestamp = {
          id: '1',
          time: '',
          actualTime: goTime.format(),
          type: 'card',
          status: 'G'
        };

        TimestampCollection.addTimeToTimestamp(goTimestamp, user);

        expect(goTimestamp.time).toEqual(
          moment({
            years: 2017,
            months: 5,
            date: 8,
            hours: 7,
            minutes: 30
          }).format()
        );
      });
    });
  });
});
