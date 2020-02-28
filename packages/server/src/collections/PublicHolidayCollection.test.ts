jest.mock('lowdb/adapters/FileAsync');
import * as m from 'common/mocks';
import { PublicHolidayCollection } from './PublicHolidayCollection';

describe('PublicHolidayCollection Tests', () => {
  beforeAll(async () => {
    await PublicHolidayCollection.getDb();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getPublicHolidays()', () => {
    beforeEach(() => {
      PublicHolidayCollection.db.setState({ '2017': [m.publicHolidayMock] });
    });

    it('should return holidays from database', async () => {
      const holidays = await PublicHolidayCollection.getPublicHolidays('2017');
      expect(holidays).toEqual([m.publicHolidayMock]);
    });
  });

  describe('create()', () => {
    beforeEach(() => {
      PublicHolidayCollection.db.setState({ '2017': [] });
    });

    it('should push holidays to database', async () => {
      const data = await PublicHolidayCollection.create(m.publicHolidayMock);
      expect(data).toEqual([m.publicHolidayMock]);
    });
  });
});
