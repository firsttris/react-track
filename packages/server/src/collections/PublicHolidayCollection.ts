import * as moment from 'moment';
import * as t from 'types';
import { v4 } from 'uuid';
import { DbAdapterWithColKey } from './DbAdapterWithColKey';

export class PublicHolidayCollection extends DbAdapterWithColKey {
  static db: any;
  static jsonFileName: string = 'publicHolidays.json';

  static async create(newHoliday: t.PublicHolidayInput): Promise<t.PublicHoliday[]> {
    const holiday: t.PublicHoliday = newHoliday as t.PublicHoliday;
    holiday.id = v4();
    const year = moment(newHoliday.date).format('YYYY');
    await this.push(year, holiday);
    return this.getPublicHolidays(year);
  }

  static async removePublicHolidayById(year: string, holidayId: string): Promise<t.PublicHoliday[]> {
    await this.removeById(year, holidayId);
    return this.getPublicHolidays(year);
  }

  static async getPublicHolidays(year: string): Promise<t.PublicHoliday[]> {
    const result = await this.getCol(year);
    return result.value() as t.PublicHoliday[];
  }
}
