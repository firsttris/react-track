import * as fs from 'fs';
import * as low from 'lowdb';
import * as FileAsync from 'lowdb/adapters/FileAsync';
import { DirectoryHelper } from './../helper/DirectoryHelper';

export class DbAdapter {
  static db: any;
  static jsonFileName: string;
  static collectionKey: string;

  static async getDb(): Promise<any> {
    if (!this.db) {
      const fileName = DirectoryHelper.getDatabasePath(this.jsonFileName);
      this.db = await low(new FileAsync(fileName));
      this.defaults();
    }
    return this.db;
  }

  static async defaults(): Promise<void> {
    await this.db
      .defaults({
        [this.collectionKey]: []
      })
      .write();
  }

  static remove(): boolean {
    const fileName = DirectoryHelper.getDatabasePath(this.jsonFileName);
    if (fs.existsSync(fileName)) {
      fs.unlinkSync(fileName);
      return true;
    }
    return false;
  }

  static removeById(id: string): Promise<any> {
    return this.getDb().then(db =>
      db
        .get(this.collectionKey)
        .remove({ id })
        .write()
    );
  }

  static getCol(): Promise<any> {
    return this.getDb().then(db => db.get(this.collectionKey));
  }

  static set(value: any[]): Promise<void> {
    return this.getDb().then(db => db.set(this.collectionKey, value).write());
  }

  static push(value: any): Promise<void> {
    return this.getDb().then(db =>
      db
        .get(this.collectionKey)
        .push(value)
        .write()
    );
  }
}
