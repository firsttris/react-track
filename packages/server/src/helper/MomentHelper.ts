import * as moment from 'moment';
import 'moment-duration-format';

export class MomentHelper {
  static formatDuration(duration: moment.Duration): string {
    return duration.format('hh:mm', {
      trim: false
    });
  }

  static formatAsDecimal(duration: moment.Duration) {
    const num = duration.asHours();
    const rounded = Math.round(num * 100) / 100;
    return rounded.toString();
  }

  static formatNumber(value: number) {
    return this.formatDuration(moment.duration().add(value, 'hours'));
  }

  static removeTime(date: moment.Moment) {
    date.hours(0);
    date.minutes(0);
    date.seconds(0);
  }
}
