import { API_DATE } from 'common/constants';
import * as moment from 'moment';
import * as t from 'common/types';
import { v4 } from 'uuid';
import { TimestampsErrorKeys } from './../errorKeys';
import { DbAdapterWithColAndDbKey } from './DbAdapterWithColAndDbKey';

export class TimestampCollection extends DbAdapterWithColAndDbKey {
  static db: { [userId: string]: any } = {};
  static jsonFileName = 'timestamps.json';

  static async removeTimestamp(userId: string, timestamp: t.Timestamp): Promise<t.Timestamp[]> {
    const dateKey = this.getDateKey(timestamp);
    await this.removeById(userId, dateKey, timestamp.id);
    return this.getTimestamps(userId, dateKey);
  }

  static async getValidated(userId: string, dateKey: string): Promise<t.ValidatedTimestamps> {
    const timestamps = await this.getTimestamps(userId, dateKey);
    let exception;
    if (!this.isTimestampsValid(timestamps)) {
      exception = TimestampsErrorKeys.INVALID_TIMESTAMPS;
    }
    return { timestamps, error: exception };
  }

  static getDateKey(timestamp: t.Timestamp): string {
    return moment(timestamp.time).format(API_DATE);
  }

  static async update(userId: string, dateKey: string, timestamps: t.Timestamp[]): Promise<t.ValidatedTimestamps> {
    timestamps.sort((a, b) => {
      return moment(a.time).diff(moment(b.time));
    });
    await this.set(userId, dateKey, timestamps);

    return this.getValidated(userId, dateKey);
  }

  static isTimestampsValid(timestamps: t.Timestamp[]): boolean {
    if (timestamps.length % 2 !== 0) {
      return false;
    }
    let previous: t.Timestamp | undefined;
    for (const timestamp of timestamps) {
      if (!previous) {
        if (timestamp.status === 'G' || timestamp.status === '') {
          return false;
        }
        previous = timestamp;
        continue;
      }

      if (timestamp.status === '') {
        return false;
      }

      if (previous.status === timestamp.status) {
        return false;
      }
      previous = timestamp;
    }
    return true;
  }

  static async add(user: t.User): Promise<t.Timestamp> {
    const timestamps = await this.getTimestamps(user.id, moment().format(API_DATE));
    const time = moment()
      .seconds(0)
      .milliseconds(0);
    const newTimestamp = { id: v4(), time: '', actualTime: time.format(), type: 'card', status: 'K' };
    this.addTimeToTimestamp(newTimestamp, user);
    let lastTimestamp = null;
    if (timestamps && timestamps.length > 0) {
      lastTimestamp = timestamps[timestamps.length - 1];
      if (lastTimestamp.status === 'K') {
        newTimestamp.status = 'G';
      } else if (lastTimestamp.status === 'G') {
        newTimestamp.status = 'K';
      }
    }
    const dateKey = moment().format(API_DATE);
    await this.push(user.id, dateKey, newTimestamp);
    return newTimestamp;
  }

  static addTimeToTimestamp(timestamp: t.Timestamp, user: t.User) {
    const time = moment(timestamp.actualTime);
    const startOfDay = moment(time).startOf('day');
    const duration = time.diff(startOfDay);
    const workTimes: any = user.workTimes;
    const dayName = time.format('dddd').toLowerCase();
    const startTimeDuration = moment.duration(workTimes[dayName].startTime).asMilliseconds();
    const endTimeDuration = moment.duration(workTimes[dayName].endTime).asMilliseconds();
    if (timestamp.status === 'K') {
      if (endTimeDuration !== 0 && duration > endTimeDuration) {
        startOfDay.add(endTimeDuration, 'milliseconds');
        timestamp.time = startOfDay.format();
      } else if (duration >= startTimeDuration) {
        timestamp.time = timestamp.actualTime;
      } else {
        startOfDay.add(startTimeDuration, 'milliseconds');
        timestamp.time = startOfDay.format();
      }
    } else if (timestamp.status === 'G') {
      if (duration < startTimeDuration) {
        startOfDay.add(startTimeDuration, 'milliseconds');
        timestamp.time = startOfDay.format();
      } else if (endTimeDuration === 0 || duration <= endTimeDuration) {
        timestamp.time = timestamp.actualTime;
      } else {
        startOfDay.add(endTimeDuration, 'milliseconds');
        timestamp.time = startOfDay.format();
      }
    }
  }

  static async getTimestamps(userId: string, dateKey: string): Promise<t.Timestamp[]> {
    const result = await this.getCol(userId, dateKey);
    return result.value() as t.Timestamp[];
  }
}
