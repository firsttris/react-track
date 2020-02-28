import { Complain } from 'common/types';
import { DbAdapterWithColAndDbKey } from './DbAdapterWithColAndDbKey';

export class ComplainCollection extends DbAdapterWithColAndDbKey {
  static db: { [userId: string]: any } = {};
  static jsonFileName = 'complains.json';

  static async removeComplain(userId: string, dateKey: string, complainId: string): Promise<Complain[]> {
    await this.removeById(userId, dateKey, complainId);
    return this.get(userId, dateKey);
  }

  static async get(userId: string, dateKey: string): Promise<Complain[]> {
    const result = await this.getCol(userId, dateKey);
    return result.value() as Complain[];
  }

  static async create(userId: string, dateKey: string, complain: Complain): Promise<Complain[]> {
    await this.push(userId, dateKey, complain);
    return this.get(userId, dateKey);
  }

  static async update(userId: string, dateKey: string, complains: Complain[]): Promise<Complain[]> {
    await this.set(userId, dateKey, complains);
    return this.get(userId, dateKey);
  }

  static async getHoursByDate(userId: string, dateKey: string): Promise<string> {
    return this.get(userId, dateKey).then(complains => {
      const values = complains.map(complain => Number(complain.duration));

      if (values.length) {
        return values.reduce((previous, current) => previous + current).toString();
      }

      return '0';
    });
  }
}
