import { initialUserState } from 'common/initialState';
import jwt = require('jsonwebtoken');
import * as t from 'common/types';
import { v4 } from 'uuid';
import { StatisticCalculator } from './../calculators/StatisticCalculator';
import { UserErrorKeys } from './../errorKeys';
import { DbAdapter } from './DbAdapter';
import { LeaveCollection } from './LeaveCollection';
import { SettingsCollection } from './SettingsCollection';
import { TimestampCollection } from './TimestampCollection';

const SECRET_PW = 'yxcvbnm321';

export class UserCollection extends DbAdapter {
  static db: any;
  static jsonFileName = 'users.json';
  static collectionKey = 'users';

  static async create(user: t.UserInput): Promise<t.User> {
    if (!this.areUserPropsValid(user)) {
      throw new Error(UserErrorKeys.INVALID_USER_PROPERTIES);
    }
    const users = await this.getCol();
    const existingUserCode = users.find({ code: user.code }).value() as t.User;
    if (existingUserCode) {
      throw new Error(UserErrorKeys.CODE_ALREADY_IN_USE);
    }
    user.id = v4();
    await users.push(user).write();
    return user as t.User;
  }

  static async getById(id: string): Promise<t.User> {
    const users = await this.getCol();
    const user = users.find({ id }).value() as t.User;
    return user;
  }

  static async loginUser(password: string): Promise<t.User> {
    const superAdminPassword = await SettingsCollection.getSuperAdminPassword();
    if (password === superAdminPassword) {
      const adminUser = { ...initialUserState };
      adminUser.id = '666';
      adminUser.role = t.UserRole.ADMIN;
      adminUser.token = jwt.sign(adminUser.id, SECRET_PW);
      return Promise.resolve(adminUser);
    }
    const users = await this.getCol();
    const user = users.find({ code: password }).value();
    const userCopy = { ...user };
    userCopy.token = jwt.sign(user.id, SECRET_PW);
    if (user) {
      if (user.role === t.UserRole.GUEST) {
        throw new Error(UserErrorKeys.INVALID_ROLE);
      }
      return Promise.resolve(userCopy);
    }
    throw new Error(UserErrorKeys.INVALID_PASSWORD);
  }

  static async verifyLogin(token: string): Promise<t.User> {
    const decoded = jwt.verify(token, SECRET_PW);
    if (decoded === '666') {
      const adminUser = { ...initialUserState };
      adminUser.id = '666';
      adminUser.role = t.UserRole.ADMIN;
      return Promise.resolve(adminUser);
    }
    return this.getById(decoded as string);
  }

  static async getByCode(code: string): Promise<t.User> {
    const users = await this.getCol();
    const user = users.find({ code }).value() as t.User;
    if (!user) {
      throw new Error(UserErrorKeys.NO_USER_FOR_CODE);
    }
    return user;
  }

  static async find(args: any): Promise<any> {
    const users = await this.getCol();
    if (Object.entries(args).length) {
      return [users.find(args).value()];
    }
    return users.value();
  }

  static async update(user: t.UserInput): Promise<t.User> {
    if (!this.areUserPropsValid(user)) {
      throw new Error(UserErrorKeys.INVALID_USER_PROPERTIES);
    }
    if (!user.id || user.id === '') {
      throw new Error(UserErrorKeys.MISSING_USER_ID);
    }
    const users = await this.getCol();
    const existingUser = users.find({ code: user.code }).value() as t.User;
    if (existingUser && existingUser.id !== user.id) {
      throw new Error(UserErrorKeys.CODE_ALREADY_IN_USE);
    }

    const collection = await this.getCol();
    collection
      .find({ id: user.id })
      .assign(user)
      .write();
    return user as t.User;
  }

  static async deleteUser(id: string): Promise<t.User[]> {
    await this.removeById(id);
    TimestampCollection.remove(id);
    LeaveCollection.remove(id);
    return this.getUsers();
  }

  static async getUsers(): Promise<t.User[]> {
    const result = await this.getCol();
    const users = result.value() as t.User[];
    return users;
  }

  static areUserPropsValid(user: t.UserInput): boolean {
    user.name = user.name ? user.name.trim() : '';
    user.code = user.code ? user.code.trim() : '';
    return user.name !== '' && user.code !== '';
  }

  static areWorkTimesValid(workTimes: t.WorkTimes): boolean {
    return true;
  }

  static async addTimestampByCode(code: string): Promise<t.TimestampUserAndStatistic> {
    const user = await this.getByCode(code);
    const statistic = await this.addTimestampToUser(user);
    return {
      user,
      ...statistic
    };
  }

  static async addTimestampToUser(user: t.User) {
    const timestamp = await TimestampCollection.add(user);
    const statisticForToday = await StatisticCalculator.getFormattedStatisticForDate(timestamp.time, user.id);
    return {
      timestamp,
      timeLeft: statisticForToday.statisticForDate.timeLeft
    };
  }

  static async updateSaldoForUserId(userId: string, saldos: t.Saldo[]): Promise<t.Saldo[]> {
    const user = await this.getById(userId);
    if (!this.areSaldosValid(saldos)) {
      throw new Error(UserErrorKeys.INVALID_SALDOS);
    }

    user.saldos = saldos;
    const userCollection = await this.getCol();
    userCollection
      .find({ id: user.id })
      .assign(user)
      .write();
    return saldos;
  }

  static async updateWorkTimesForUser(userId: string, workTimes: t.WorkTimes): Promise<t.WorkTimes> {
    const user = await this.getById(userId);
    if (!this.areWorkTimesValid(user.workTimes)) {
      throw new Error(UserErrorKeys.INVALID_WORK_TIMES);
    }

    user.workTimes = workTimes;
    const userCollection = await this.getCol();
    userCollection
      .find({ id: user.id })
      .assign(user)
      .write();
    return workTimes;
  }

  static async updateWorkTimesForAllUser(userId: string, workTimes: t.WorkTimesInput): Promise<t.WorkTimes> {
    const userCollection = await this.getCol();

    const users = userCollection.value() as t.User[];
    for (const user of users) {
      user.workTimes = workTimes;
    }

    const currentUser = users.filter((user: t.User) => user.id === userId);

    userCollection.write();

    return currentUser[0].workTimes;
  }

  static areSaldosValid(saldos: t.Saldo[]): boolean {
    const years = saldos.map(s => s.year);
    return new Set(years).size === years.length;
  }
}
