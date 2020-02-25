import * as fs from 'fs';
import * as low from 'lowdb';
import * as FileAsync from 'lowdb/adapters/FileAsync';
import { DirectoryHelper } from './../helper/DirectoryHelper';

export class DbAdapterWithColKey {
  static db: any;
  static jsonFileName: string;

  static async getDb(): Promise<any> {
    if (!this.db) {
      const fileName = DirectoryHelper.getDatabasePath(this.jsonFileName);
      this.db = await low(new FileAsync(fileName));
      await this.db.defaults(this.defaultObject()).write();
    }
    return this.db;
  }

  static defaultObject(): object {
    return {};
  }

  static async defaults(collectionKey: string): Promise<void> {
    await this.db
      .defaults({
        [collectionKey]: []
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

  static removeById(collectionKey: string, id: string): Promise<any> {
    return this.getDb().then(db =>
      db
        .get(collectionKey)
        .remove({ id })
        .write()
    );
  }

  static getCol(collectionKey: string): Promise<any> {
    return this.getDb().then(async db => {
      await this.defaults(collectionKey);
      return db.get(collectionKey);
    });
  }

  static set(collectionKey: string, value: any): Promise<void> {
    return this.getDb().then(db => db.set(collectionKey, value).write());
  }

  static push(collectionKey: string, value: any): Promise<void> {
    return this.getDb().then(async db => {
      await this.defaults(collectionKey);
      return db
        .get(collectionKey)
        .push(value)
        .write();
    });
  }
}
