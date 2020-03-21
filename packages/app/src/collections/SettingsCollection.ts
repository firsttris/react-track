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
    const url = process.env.NODE_ENV === 'production' ? window.location.host : `${window.location.hostname}:3001`;
    this.db.defaults({ settings: { url } }).write();
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
