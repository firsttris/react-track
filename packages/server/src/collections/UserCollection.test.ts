jest.mock('lowdb/adapters/FileAsync');
import * as mocks from 'mocks';
import { StatisticCalculator } from './../calculators/StatisticCalculator';
import { UserErrorKeys } from './../errorKeys';
import { TimestampCollection } from './TimestampCollection';
import { UserCollection } from './UserCollection';

describe('User Collection Test', () => {
  beforeEach(async () => {
    await UserCollection.getDb();
    UserCollection.db.setState({ users: [] });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('insert()', () => {
    it('should insert the user one time', async () => {
      const user = await UserCollection.create(mocks.userMock);
      expect(user).toBeDefined();
      return UserCollection.create(mocks.userMock).catch(e =>
        expect(e.message).toBe(UserErrorKeys.CODE_ALREADY_IN_USE)
      );
    });

    it('should not insert user if props are invalid', async () => {
      jest.spyOn(UserCollection, 'areUserPropsValid').mockImplementation(() => false);

      return UserCollection.create(mocks.userMock).catch(e =>
        expect(e.message).toBe(UserErrorKeys.INVALID_USER_PROPERTIES)
      );
    });

    it('should not insert user if worktimes are invalid', async () => {
      jest.spyOn(UserCollection, 'areWorkTimesValid').mockImplementation(() => false);

      return UserCollection.create(mocks.userMock).catch(e => expect(e.message).toBe(UserErrorKeys.INVALID_WORK_TIMES));
    });
  });

  describe('areUserPropsValid()', () => {
    it('should return true if name and code are provided', () => {
      expect(UserCollection.areUserPropsValid(mocks.userMock)).toBe(true);
    });

    it('should return false if name is not provided', () => {
      const user = { ...mocks.userMock };
      user.name = '';
      expect(UserCollection.areUserPropsValid(user)).toBe(false);
    });

    it('should return false if code is not provided', () => {
      const user = { ...mocks.userMock };
      user.code = '';
      expect(UserCollection.areUserPropsValid(user)).toBe(false);
    });
  });

  describe('areWorkTimesValid()', () => {
    // todo
  });

  describe('get()', () => {
    it('should get user by id', async () => {
      UserCollection.db.setState({ users: [mocks.userMock] });

      const user = await UserCollection.getById(mocks.userMock.id);
      expect(user).toEqual(mocks.userMock);
    });
  });

  describe('update()', () => {
    it('should update the user', async () => {
      UserCollection.db.setState({ users: [mocks.userMock] });

      const userMockCopy = { ...mocks.userMock };
      userMockCopy.name = 'Rolf';

      const user = await UserCollection.update(userMockCopy);
      expect(user.name).toBe(userMockCopy.name);
    });

    it('should not update the user - no name', async () => {
      UserCollection.db.setState({ users: [mocks.userMock] });

      const userMockCopy = { ...mocks.userMock };
      userMockCopy.name = '';

      return UserCollection.update(userMockCopy).catch(e =>
        expect(e.message).toBe(UserErrorKeys.INVALID_USER_PROPERTIES)
      );
    });

    it('should not update the user - no id', async () => {
      UserCollection.db.setState({ users: [mocks.userMock] });

      const userMockCopy = { ...mocks.userMock };
      userMockCopy.id = '';

      return UserCollection.update(userMockCopy).catch(e => expect(e.message).toBe(UserErrorKeys.MISSING_USER_ID));
    });

    it('should not update user if worktimes are invalid', async () => {
      jest.spyOn(UserCollection, 'areWorkTimesValid').mockImplementation(() => false);

      return UserCollection.update(mocks.userMock).catch(e => expect(e.message).toBe(UserErrorKeys.INVALID_WORK_TIMES));
    });
  });

  describe('addTimestampToUser()', () => {
    let addSpy: any;
    let getFormattedStatisticForDateSpy: any;
    beforeEach(() => {
      addSpy = jest.spyOn(TimestampCollection, 'add').mockImplementation(() => Promise.resolve(mocks.timestampMock5));
      getFormattedStatisticForDateSpy = jest
        .spyOn(StatisticCalculator, 'getFormattedStatisticForDate')
        .mockImplementation((date: string, userId: string) => Promise.resolve(mocks.statisticForDateResponseMock));
      UserCollection.db.setState({ users: [mocks.userMock] });
    });

    it('should addTimestampToUser', async () => {
      const result = await UserCollection.addTimestampByCode(mocks.userMock.code);
      expect(result.user.id).toEqual(mocks.userMock.id);
      expect(result.timestamp);
      expect(addSpy).toHaveBeenCalledTimes(1);
      expect(getFormattedStatisticForDateSpy).toHaveBeenCalledTimes(1);
    });

    it('should not addTimestampToUser - chipCard does not exist', async () => {
      return UserCollection.addTimestampByCode('9999999').catch(e => {
        expect(e.message).toBe(UserErrorKeys.NO_USER_FOR_CODE);
        expect(addSpy).toHaveBeenCalledTimes(0);
        expect(getFormattedStatisticForDateSpy).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('remove()', () => {
    it('should remove user by id', async () => {
      const timestampCollectionSpy = jest.spyOn(TimestampCollection, 'remove');
      UserCollection.db.setState({ users: [mocks.userMock] });

      await UserCollection.deleteUser(mocks.userMock.id);

      expect(timestampCollectionSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateSaldoForUserId()', () => {
    const saldos = [{ year: '2016', hours: 1 }, { year: '2017', hours: -1 }];
    const userMock = { ...mocks.userMock };

    beforeEach(() => {
      userMock.saldos = [];
      jest.spyOn(UserCollection, 'getById').mockImplementation(() => {
        return Promise.resolve(userMock);
      });
    });

    it('should return error if saldos are invalid', async () => {
      userMock.saldos = [{ year: '2016', hours: 1 }];
      jest.spyOn(UserCollection, 'areSaldosValid').mockImplementation(() => false);

      UserCollection.updateSaldoForUserId(mocks.userMock.id, saldos).catch(error => {
        expect(error).toEqual(new Error(UserErrorKeys.INVALID_SALDOS));
      });
    });

    it('should return saldos if saldos are valid', async () => {
      userMock.saldos = [{ year: '2016', hours: 1 }];
      jest.spyOn(UserCollection, 'areSaldosValid').mockImplementation(() => true);

      const newSaldos = await UserCollection.updateSaldoForUserId(mocks.userMock.id, saldos);

      expect(newSaldos).toEqual(saldos);
    });
  });

  describe('areSaldosValid()', () => {
    it('should return true if saldos are empty', () => {
      expect(UserCollection.areSaldosValid([])).toBe(true);
    });

    it('should return true if years are not duplicated', () => {
      const saldos = [{ year: '2016', hours: 1 }, { year: '2017', hours: -1 }];
      expect(UserCollection.areSaldosValid(saldos)).toBe(true);
    });

    it('should return false if years are duplicated', () => {
      const saldos = [{ year: '2016', hours: 1 }, { year: '2016', hours: -1 }];
      expect(UserCollection.areSaldosValid(saldos)).toBe(false);
    });
  });
});
