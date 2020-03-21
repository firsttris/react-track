import * as t from 'common/types';
import * as https from 'https';
import { LicenseErrorKeys } from '../errorKeys';
import { SettingsCollection } from '../collections/SettingsCollection';
import moment = require('moment');
import { UserCollection } from '../collections/UserCollection';

export class LicenseService {
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

  static async refreshLicense(): Promise<void> {
    const license = await SettingsCollection.getLicense();
    if (license.key === '0') {
      return;
    }
    try {
      const refreshedLicense = await this.queryLicense(license.key);
      await SettingsCollection.replaceLicense(refreshedLicense);
    } catch {
      license.validUntil = '2000-01-01';
      await SettingsCollection.replaceLicense(license);
    }
  }

  static protectedOperations = [
    'LoadPublicHolidays',
    'GetStatisticForDate',
    'GetStatisticForWeek',
    'GetStatisticForMonth',
    'GetEvaluationForMonth',
    'GetEvaluationForUsers',

    'CreateUser',
    'UpdateUser',
    'UpdateWorkTimeSettings',
    'UpdateAllUserWorkTimesById',
    'UpdateTimestamps',
    'CreateLeave',
    'DeleteLeave',
    'UpdateComplains',
    'CreatePause',
    'DeletePause',
    'CreatePublicHoliday',
    'DeletePublicHoliday',
    'RewriteTimestamps'
  ];

  static isProtectedOperation(operation: string): boolean {
    return this.protectedOperations.includes(operation);
  }

  static async checkLicenseValidity(operation: string): Promise<void> {
    if (!this.isProtectedOperation(operation)) {
      return;
    }

    const license = await SettingsCollection.getLicense();
    if (license.validUntil) {
      const validUntil = moment(license.validUntil);
      const now = moment();
      if (validUntil < now) {
        throw new Error(LicenseErrorKeys.LICENSE_EXPIRED);
      }
    } else {
      // valid forever
    }

    if (license.userLimit) {
      const userLimit = parseInt(license.userLimit);
      const users = await UserCollection.getUsers();
      if (users.length > userLimit) {
        throw new Error(LicenseErrorKeys.LICENSE_USER_LIMIT_EXCEEDED);
      }
      if (operation === 'CreateUser' && users.length === userLimit) {
        throw new Error(LicenseErrorKeys.LICENSE_USER_LIMIT_EXCEEDED);
      }
    } else {
      // unlimited users
    }
  }
}
