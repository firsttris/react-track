import * as m from 'common/mocks';
import { ComplainCollection } from './ComplainCollection';
const dbKey = m.userMock.id;

describe('ComplainCollection Test', () => {
  beforeEach(async () => {
    await ComplainCollection.getDb(dbKey);
    ComplainCollection.db[dbKey].setState({});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('getHoursByDate', async () => {
    const hours = await ComplainCollection.getHoursByDate('1234', '2017-10-01');
    expect(hours).toBe('0');
  });
});
