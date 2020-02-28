jest.mock('lowdb/adapters/FileAsync');
import * as moment from 'moment';
import * as t from 'common/types';
import { PauseErrorKeys } from './../errorKeys';
import { SettingsCollection } from './SettingsCollection';

describe('SettingsCollection Tests', () => {
  let db: any;

  beforeEach(async () => {
    db = await SettingsCollection.getDb();
    db.setState({ pauses: [] });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('get()', () => {
    it('should return saved pauses', async () => {
      const pauses: t.Pause[] = [
        { time: moment(7 * 60 * 60 * 1000).format(), durationInMinutes: '30', id: '123456789' }
      ];
      db.setState({ pauses });

      const result = await SettingsCollection.getPauses();

      expect(result).toEqual(pauses);
    });
  });

  describe('insert()', () => {
    it('should not insert pause if other pause already exists in same timespan', () => {
      const pauses: t.Pause[] = [
        { time: moment(7 * 60 * 60 * 1000).format(), durationInMinutes: '30', id: '123456789' }
      ];
      db.setState({ pauses });
      const newPause: t.Pause = {
        time: moment(7 * 60 * 60 * 1000 + 5 * 60 * 1000).format(),
        durationInMinutes: '30',
        id: ''
      };

      return SettingsCollection.createPause(newPause).catch(e => {
        expect(e.message).toEqual(PauseErrorKeys.PAUSE_ALREADY_EXISTS);
        expect(db.getState()).toEqual({ pauses });
      });
    });

    it('should insert pause if no pause exists in same timespan', async () => {
      const pause: t.Pause = { time: '2:00', durationInMinutes: '30', id: '123456789' };
      db.setState({ pauses: [pause] });
      const newPause: t.Pause = {
        time: '2:00',
        durationInMinutes: '30',
        id: ''
      };

      await SettingsCollection.createPause(newPause);

      expect(newPause.id.length).toBeGreaterThan(0);
      expect(db.getState()).toEqual({ pauses: [pause, newPause] });
    });
  });

  describe('removeById()', () => {
    it('should remove pause from database', async () => {
      const pause: t.Pause = { time: '2:00', durationInMinutes: '30', id: '123456789' };
      const otherPause: t.Pause = {
        time: '2:00',
        durationInMinutes: '30',
        id: '1234567890'
      };
      db.setState({ pauses: [pause, otherPause] });

      await SettingsCollection.removePauseById(pause.id);

      expect(db.getState()).toEqual({ pauses: [otherPause] });
    });

    it('should return all pauses after delete', async () => {
      const pause = { time: moment(7 * 60 * 60 * 1000).format(), durationInMinutes: '30', id: '123456789' };
      const otherPause = { time: moment(7 * 60 * 60 * 1000).format(), durationInMinutes: '30', id: '1234567890' };
      db.setState({ pauses: [pause, otherPause] });

      const result = await SettingsCollection.removePauseById(pause.id);

      expect(result).toEqual([otherPause]);
    });
  });
});
