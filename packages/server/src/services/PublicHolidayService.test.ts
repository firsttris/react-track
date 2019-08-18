jest.mock('lowdb/adapters/FileAsync');
import { PublicHolidayCollection } from './../collections/PublicHolidayCollection';
import { PublicHolidayService } from './PublicHolidayService';
let db: any;
describe('PublicHoliday Service Test', () => {
  beforeEach(async () => {
    db = await PublicHolidayCollection.getDb();
    db.setState({ '2017': [] });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should load holidays from jarmedia into db', async () => {
    const publicHolidays = await PublicHolidayService.loadPublicHolidaysFromJarmedia('2017');
    expect(publicHolidays);
  });

  it('should load holidays from IpTy into db', async () => {
    const publicHolidays = await PublicHolidayService.loadPublicHolidaysFromIpTy('2017');
    expect(publicHolidays);
  });
});
