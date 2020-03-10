import * as t from 'common/types';
import * as https from 'https';
import { LicenseErrorKeys } from '../errorKeys';

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
}
