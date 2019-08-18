import * as fs from 'fs';
import * as low from 'lowdb';
import * as FileAsync from 'lowdb/adapters/FileAsync';
import { DirectoryHelper } from './../helper/DirectoryHelper';

export class DbAdapterWithColAndDbKey {
  static db: { [dbKey: string]: any } = {};
  static jsonFileName: string;

  static async getDb(dbKey: string): Promise<any> {
    if (!this.db[dbKey]) {
      const fileName = DirectoryHelper.getDatabasePath(dbKey + '-' + this.jsonFileName);
      const db = await low(new FileAsync(fileName));
      this.db[dbKey] = db;
    }
    return this.db[dbKey];
  }

  static async defaults(dbKey: string, collectionKey: string): Promise<any> {
    await this.db[dbKey]
      .defaults({
        [collectionKey]: []
      })
      .write();
  }

  static remove(dbKey: string): boolean {
    const fileName = DirectoryHelper.getDatabasePath(dbKey + '-' + this.jsonFileName);
    if (fs.existsSync(fileName)) {
      fs.unlinkSync(fileName);
      return true;
    }
    return false;
  }

  static removeById(dbKey: string, collectionKey: string, id: string): Promise<any> {
    return this.getDb(dbKey).then(db =>
      db
        .get(collectionKey)
        .remove({ id })
        .write()
    );
  }

  static set(dbKey: string, collectionKey: string, value: any[]): Promise<void> {
    return this.getDb(dbKey).then(db => db.set(collectionKey, value).write());
  }

  static push(dbKey: string, collectionKey: string, value: any): Promise<void> {
    return this.getDb(dbKey).then(async db => {
      await this.defaults(dbKey, collectionKey);
      return db
        .get(collectionKey)
        .push(value)
        .write();
    });
  }

  static getCol(dbKey: string, collectionKey: string): Promise<any> {
    return this.getDb(dbKey).then(async db => {
      await this.defaults(dbKey, collectionKey);
      return db.get(collectionKey);
    });
  }
}
