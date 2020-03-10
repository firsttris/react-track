import * as t from 'common/types';
import { v4 } from 'uuid';
import { DbAdapterWithColKey } from './DbAdapterWithColKey';
import { LicenseService } from '../services/LicenseService';

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
      const license = await LicenseService.queryLicense(key);
      return this.set('license', license).then(() => this.getLicense());
    } catch (error) {
      return Promise.reject(error);
    }
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
