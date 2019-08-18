jest.mock('lowdb/adapters/FileAsync');
import { DirectoryHelper } from './../helper/DirectoryHelper';
import { DbAdapterWithColAndDbKey } from './DbAdapterWithColAndDbKey';

const mockData = { id: '12345', title: 'test' };

describe('DbAdapterWithColAndDbKey Tests', () => {
  beforeAll(async () => {
    DbAdapterWithColAndDbKey.jsonFileName = 'test-file.json';
    await DbAdapterWithColAndDbKey.getDb('12345');
  });

  beforeEach(() => {
    DbAdapterWithColAndDbKey.db['12345'].setState({ '2017': [] });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('getDb()', async () => {
    const db = await DbAdapterWithColAndDbKey.getDb('12345');
    expect(DbAdapterWithColAndDbKey.db['12345']).toBe(db);
  });

  it('removeById()', async () => {
    const spy = jest.spyOn(DbAdapterWithColAndDbKey.db['12345'], 'get');
    DbAdapterWithColAndDbKey.db['12345'].setState({ '2017': [mockData] });
    await DbAdapterWithColAndDbKey.removeById('12345', '2017', mockData.id);
    expect(DbAdapterWithColAndDbKey.db['12345'].getState()).toEqual({ '2017': [] });
    expect(spy).toBeCalledWith('2017');
  });

  it('set()', async () => {
    const spy = jest.spyOn(DbAdapterWithColAndDbKey.db['12345'], 'set');
    await DbAdapterWithColAndDbKey.set('12345', '2017', [mockData]);
    expect(DbAdapterWithColAndDbKey.db['12345'].getState()).toEqual({ '2017': [mockData] });
    expect(spy).toBeCalledWith('2017', [mockData]);
  });

  it('push()', async () => {
    const spy = jest.spyOn(DbAdapterWithColAndDbKey.db['12345'], 'get');
    await DbAdapterWithColAndDbKey.push('12345', '2017', mockData);
    expect(DbAdapterWithColAndDbKey.db['12345'].getState()).toEqual({ '2017': [mockData] });
    expect(spy).toBeCalledWith('2017');
  });

  describe('getCol()', () => {
    it('getCol() with existing State', async () => {
      const spy = jest.spyOn(DbAdapterWithColAndDbKey.db['12345'], 'get');
      DbAdapterWithColAndDbKey.db['12345'].setState({ '2017': [mockData] });
      const result = await DbAdapterWithColAndDbKey.getCol('12345', '2017');
      expect(result.value()).toEqual([mockData]);
      expect(spy).toBeCalledWith('2017');
    });

    it('getCol with undefined State', async () => {
      const spy = jest.spyOn(DbAdapterWithColAndDbKey.db['12345'], 'get');
      const result = await DbAdapterWithColAndDbKey.getCol('12345', '2017');
      expect(result.value()).toEqual([]);
      expect(spy).toBeCalledWith('2017');
    });
  });

  describe('remove()', () => {
    const fs = require('fs');
    it('should not delete database if file does not exist', () => {
      jest.spyOn(fs, 'existsSync').mockImplementation(() => false);
      const unlinkSyncSpy = jest.spyOn(fs, 'unlinkSync');
      DbAdapterWithColAndDbKey.remove('12345');
      expect(unlinkSyncSpy).toHaveBeenCalledTimes(0);
    });

    it('should delete database if file does exist', () => {
      jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
      const unlinkSyncSpy = jest.spyOn(fs, 'unlinkSync').mockImplementation(() => {});
      DirectoryHelper.getDatabasePath = jest.fn(() => '123456789-timestamps.json');
      DbAdapterWithColAndDbKey.remove('12345');
      expect(unlinkSyncSpy).toHaveBeenCalledWith('123456789-timestamps.json');
    });
  });
});
