jest.mock('lowdb/adapters/FileAsync');
import { DirectoryHelper } from './../helper/DirectoryHelper';
import { DbAdapterWithColKey } from './DbAdapterWithColKey';

const mockData = { id: '12345', title: 'test' };

describe('DbAdapterWithColKey test', () => {
  beforeAll(async () => {
    DbAdapterWithColKey.jsonFileName = 'test-file.json';
    await DbAdapterWithColKey.getDb();
  });

  beforeEach(() => {
    DbAdapterWithColKey.db.setState({ '2017': [] });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('getDb()', async () => {
    const db = await DbAdapterWithColKey.getDb();
    expect(DbAdapterWithColKey.db).toBe(db);
  });

  it('removeById()', async () => {
    const spy = jest.spyOn(DbAdapterWithColKey.db, 'get');
    DbAdapterWithColKey.db.setState({ '2017': [mockData] });
    await DbAdapterWithColKey.removeById('2017', mockData.id);
    expect(DbAdapterWithColKey.db.getState()).toEqual({ '2017': [] });
    expect(spy).toBeCalledWith('2017');
  });

  it('set()', async () => {
    const spy = jest.spyOn(DbAdapterWithColKey.db, 'set');
    await DbAdapterWithColKey.set('2017', [mockData]);
    expect(DbAdapterWithColKey.db.getState()).toEqual({ '2017': [mockData] });
    expect(spy).toBeCalledWith('2017', [mockData]);
  });

  it('push()', async () => {
    const spy = jest.spyOn(DbAdapterWithColKey.db, 'get');
    await DbAdapterWithColKey.push('2017', mockData);
    expect(DbAdapterWithColKey.db.getState()).toEqual({ '2017': [mockData] });
    expect(spy).toBeCalledWith('2017');
  });

  describe('getCol()', () => {
    it('getCol() with existing State', async () => {
      const spy = jest.spyOn(DbAdapterWithColKey.db, 'get');
      DbAdapterWithColKey.db.setState({ '2017': [mockData] });
      const result = await DbAdapterWithColKey.getCol('2017');
      expect(result.value()).toEqual([mockData]);
      expect(spy).toBeCalledWith('2017');
    });

    it('getCol() with empty State', async () => {
      const spy = jest.spyOn(DbAdapterWithColKey.db, 'get');
      const result = await DbAdapterWithColKey.getCol('2017');
      expect(result.value()).toEqual([]);
      expect(spy).toBeCalledWith('2017');
    });
  });

  describe('remove()', () => {
    const fs = require('fs');
    it('should not delete database if file does not exist', () => {
      jest.spyOn(fs, 'existsSync').mockImplementation(() => false);
      const unlinkSyncSpy = jest.spyOn(fs, 'unlinkSync');
      DbAdapterWithColKey.remove();
      expect(unlinkSyncSpy).toHaveBeenCalledTimes(0);
    });

    it('should delete database if file does exist', () => {
      jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
      const unlinkSyncSpy = jest.spyOn(fs, 'unlinkSync').mockImplementation(jest.fn());
      DirectoryHelper.getDatabasePath = jest.fn(() => '123456789-timestamps.json');
      DbAdapterWithColKey.remove();
      expect(unlinkSyncSpy).toHaveBeenCalledWith('123456789-timestamps.json');
    });
  });
});
