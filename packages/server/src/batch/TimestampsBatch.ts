import * as moment from 'moment';
import { TimestampCollection } from './../collections/TimestampCollection';
import { UserCollection } from './../collections/UserCollection';

export class TimestampsBatch {
  static async rewriteTimestamps(userId: string, date: string) {
    const user = await UserCollection.getById(userId);
    const worktimes: any = user.workTimes;
    const firstDateInYear = moment(date).startOf('year');
    const lastDateInMonth = moment(date).endOf('month');

    while (firstDateInYear <= lastDateInMonth) {
      const timestamps = await TimestampCollection.getTimestamps(userId, firstDateInYear.format('YYYY-MM-DD'));
      for (const timestamp of timestamps) {
        if (timestamp.type !== 'card') {
          continue;
        }
        if (timestamp.status === 'K') {
          const timestampTime = moment(timestamp.actualTime);
          const definedTime = moment(timestampTime);
          const startTime = worktimes[firstDateInYear.format('dddd').toLowerCase()].startTime;
          definedTime.set({ hour: startTime.split(':')[0], minute: startTime.split(':')[1] });
          if (timestampTime < definedTime) {
            timestamp.time = definedTime.format();
            continue;
          } else if (timestampTime > definedTime) {
            timestamp.time = timestamp.actualTime;
            continue;
          }
        }
        if (timestamp.status === 'G') {
          const timestampTime = moment(timestamp.actualTime);
          const definedTime = moment(timestampTime);
          const endTime = worktimes[firstDateInYear.format('dddd').toLowerCase()].endTime;
          definedTime.set({ hour: endTime.split(':')[0], minute: endTime.split(':')[1] });
          if (timestampTime > definedTime) {
            timestamp.time = definedTime.format();
          } else if (timestampTime < definedTime) {
            timestamp.time = timestamp.actualTime;
            continue;
          }
        }
      }
      firstDateInYear.add(1, 'day');
    }
    //
  }
}
