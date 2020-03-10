import * as t from 'common/types';
import { v4 } from 'uuid';
import * as https from 'https';
import { DbAdapterWithColKey } from './DbAdapterWithColKey';
import { LicenseErrorKeys } from '../errorKeys';

export class SettingsCollection extends DbAdapterWithColKey {
  static db: any;
  static jsonFileName = 'settings.json';

  static defaultLicense = {
    key: '0',
    validUntil: '',
    userLimit: '1'
  };

  static defaultObject(): object {
    return {
      ['pauses']: [],
      ['superAdminPassword']: 'qwer1234',
      ['workTimeSettings']: {
        schoolday: t.WorkDayPaymentType.PAID,
        publicHoliday: t.WorkDayPaymentType.PAID,
        holiday: t.WorkDayPaymentType.PAID,
        sickday: t.WorkDayPaymentType.PAID
      },
      ['license']: this.defaultLicense
    };
  }

  static async createPause(pause: t.PauseInput): Promise<t.Pause[]> {
    const newPause = pause as t.Pause;
    newPause.id = v4();
    await this.push('pauses', newPause);
    return this.getPauses();
  }

  static async removePauseById(id: string): Promise<t.Pause[]> {
    await this.removeById('pauses', id);
    return this.getPauses();
  }

  static async getPauses(): Promise<t.Pause[]> {
    const result = await this.getCol('pauses');
    return result.value() as t.Pause[];
  }

  static async getSuperAdminPassword(): Promise<string> {
    const result = await this.getCol('superAdminPassword');
    return result.value() as string;
  }

  static async getWorkTimeSettings(): Promise<t.WorkTimeSettings> {
    const result = await this.getCol('workTimeSettings');
    return result.value() as t.WorkTimeSettings;
  }

  static async setWorkTimeSettings(settings: t.WorkTimeSettingsInput): Promise<t.WorkTimeSettings> {
    return this.set('workTimeSettings', settings).then(() => this.getWorkTimeSettings());
  }

  static async addLicense(key: string): Promise<t.License> {
    try {
      const license = await this.queryLicense(key);
      return this.set('license', license).then(() => this.getLicense());
    } catch (error) {
      return Promise.reject(error);
    }
  }

  static async queryLicense(key: string): Promise<t.License> {
    return new Promise((resolve, reject) => {
      let output = '';

      const req = https.request(`https://teufel-it.de/license.php?license_key=${key}`, res => {
        res.setEncoding('utf8');

        if (res.statusCode !== 200) {
          req.end();
          reject(new Error(LicenseErrorKeys.LICENSE_NOT_FOUND));
          return;
        }

        res.on('data', chunk => {
          output += chunk;
        });

        res.on('end', () => {
          const license = JSON.parse(output);
          resolve({ key: key, validUntil: license.valid_until, userLimit: license.user_limit });
        });
      });

      req.on('error', error => {
        reject(error);
      });

      req.end();
    });
  }

  static async removeLicense(): Promise<t.License> {
    return this.set('license', this.defaultLicense).then(() => this.getLicense());
  }

  static async getLicense(): Promise<t.License> {
    const result = await this.getCol('license');
    if (result.value().length === 0) {
      return this.defaultLicense;
    }
    return result.value() as t.License;
  }
}
