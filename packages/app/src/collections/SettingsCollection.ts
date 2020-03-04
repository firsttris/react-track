import * as low from 'lowdb';
import * as LocalStorage from 'lowdb/adapters/LocalStorage';

export interface Settings {
  url: string;
}

export class SettingsCollection {
  static db: any;

  static getDb(): any {
    if (!this.db) {
      this.db = low(new LocalStorage('connection'));
    }
    this.db.defaults({ settings: { url: window.location.host } }).write();
    return this.db;
  }

  static get(): Settings {
    return this.getDb()
      .get('settings')
      .value() as Settings;
  }

  static setUrl(url: string): void {
    this.getDb()
      .set('settings.url', url)
      .write();
  }
}
