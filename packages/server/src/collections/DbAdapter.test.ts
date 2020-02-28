jest.mock('lowdb/adapters/FileAsync');
import { DirectoryHelper } from './../helper/DirectoryHelper';
import { DbAdapter } from './DbAdapter';

const mockData = { id: '12345', title: 'test' };

describe('DbAdapter Test', () => {
  beforeAll(async () => {
    DbAdapter.jsonFileName = 'test-file.json';
    DbAdapter.collectionKey = '2017';
    await DbAdapter.getDb();
  });

  beforeEach(() => {
    DbAdapter.db.setState({ '2017': [] });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('getDb()', async () => {
    const db = await DbAdapter.getDb();
    expect(DbAdapter.db).toBe(db);
  });

  it('removeById()', async () => {
    const spy = jest.spyOn(DbAdapter.db, 'get');
    DbAdapter.db.setState({ '2017': [mockData] });
    await DbAdapter.removeById(mockData.id);
    expect(DbAdapter.db.getState()).toEqual({ '2017': [] });
    expect(spy).toBeCalledWith('2017');
  });

  it('set()', async () => {
    const spy = jest.spyOn(DbAdapter.db, 'set');
    await DbAdapter.set([mockData]);
    expect(DbAdapter.db.getState()).toEqual({ '2017': [mockData] });
    expect(spy).toBeCalledWith('2017', [mockData]);
  });

  it('push()', async () => {
    const spy = jest.spyOn(DbAdapter.db, 'get');
    await DbAdapter.push(mockData);
    expect(DbAdapter.db.getState()).toEqual({ '2017': [mockData] });
    expect(spy).toBeCalledWith('2017');
  });

  describe('getCol()', () => {
    it('getCol() with existing State', async () => {
      const spy = jest.spyOn(DbAdapter.db, 'get');
      DbAdapter.db.setState({ '2017': [mockData] });
      const result = await DbAdapter.getCol();
      expect(result.value()).toEqual([mockData]);
      expect(spy).toBeCalledWith('2017');
    });

    it('getCol() with empty State', async () => {
      const spy = jest.spyOn(DbAdapter.db, 'get');
      const result = await DbAdapter.getCol();
      expect(result.value()).toEqual([]);
      expect(spy).toBeCalledWith('2017');
    });
  });

  describe('remove()', () => {
    const fs = require('fs');
    it('should not delete database if file does not exist', () => {
      jest.spyOn(fs, 'existsSync').mockImplementation(() => false);
      const unlinkSyncSpy = jest.spyOn(fs, 'unlinkSync');
      DbAdapter.remove();
      expect(unlinkSyncSpy).toHaveBeenCalledTimes(0);
    });

    it('should delete database if file does exist', () => {
      jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
      const unlinkSyncSpy = jest.spyOn(fs, 'unlinkSync').mockImplementation(jest.fn());
      DirectoryHelper.getDatabasePath = jest.fn(() => '123456789-timestamps.json');
      DbAdapter.remove();
      expect(unlinkSyncSpy).toHaveBeenCalledWith('123456789-timestamps.json');
    });
  });
});
