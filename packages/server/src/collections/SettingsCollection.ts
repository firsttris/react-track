import * as t from 'types';
import { v4 } from 'uuid';
import { DbAdapterWithColKey } from './DbAdapterWithColKey';

export class SettingsCollection extends DbAdapterWithColKey {
  static db: any;
  static jsonFileName: string = 'settings.json';

  static defaultObject(): object {
    return {
      ['pauses']: [],
      ['superAdminPassword']: 'qwer1234',
      ['workTimeSettings']: {
        schoolday: t.WorkDayPaymentType.PAID,
        publicHoliday: t.WorkDayPaymentType.PAID,
        holiday: t.WorkDayPaymentType.PAID,
        sickday: t.WorkDayPaymentType.PAID
      }
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
}
