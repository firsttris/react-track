import { API_DATE } from 'cons';
import * as moment from 'moment';
import * as t from 'types';
import uuid = require('uuid/v4');
import { PublicHolidayCollection } from './../collections/PublicHolidayCollection';

export class PublicHolidayService {
  static getContent(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const lib = url.startsWith('https') ? require('https') : require('http');
      const request = lib.get(url, (response: any) => {
        if (response.statusCode < 200 || response.statusCode > 299) {
          reject('Failed to load page, status code: ' + response.statusCode);
        }
        // response.setEncoding('utf8');
        const body: string[] = [];
        response.on('data', (chunk: string) => body.push(chunk));
        response.on('end', () => resolve(body.join('')));
      });
      request.on('error', (err: Error) => reject(err));
    });
  }

  static decodeHtml(html: string) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }

  static async loadPublicHolidaysFromIpTy(year: string): Promise<t.PublicHoliday[]> {
    const result = await this.getContent('https://ipty.de/feiertag/api.php?do=getFeiertage&loc=BW&outformat=Y-m-d');
    const response = result.replace('&ouml;', 'ö');
    const holidays = JSON.parse(response);
    for (const holiday of holidays) {
      holiday.id = uuid();
      await PublicHolidayCollection.push(year, holiday);
    }
    return PublicHolidayCollection.getPublicHolidays(year);
  }

  static async loadPublicHolidaysFromJarmedia(year: string): Promise<t.PublicHoliday[]> {
    const result = await this.getContent('https://feiertage-api.de/api/?jahr=' + year);
    const holidaysInBw = JSON.parse(result).BW;
    for (const index in holidaysInBw) {
      if (holidaysInBw.hasOwnProperty(index)) {
        const date = moment(holidaysInBw[index].datum).format(API_DATE);
        const newHoliday: t.PublicHoliday = { id: uuid(), title: index, date };
        const collection = await PublicHolidayCollection.getCol(year);
        const holiday = collection.find({ title: index }).value();
        if (!holiday) {
          await PublicHolidayCollection.push(year, newHoliday);
        }
      }
    }
    return PublicHolidayCollection.getPublicHolidays(year);
  }
}
