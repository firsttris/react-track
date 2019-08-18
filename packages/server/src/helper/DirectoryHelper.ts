import Debug = require('debug');
import * as fs from 'fs';
import * as fsx from 'fs-extra';
import * as moment from 'moment';
import * as os from 'os';
import * as path from 'path';

const logger = Debug('server:backup');
const appDataPath = path.join(os.homedir(), '.timetracking-db');
const backupDataPath = path.join(os.homedir(), '.timetracking-backup-db');
if (!fs.existsSync(appDataPath)) {
  fs.mkdirSync(appDataPath);
}

export class DirectoryHelper {
  static getDatabasePath(file: string): string {
    return path.join(appDataPath, file);
  }

  static backup() {
    if (fs.existsSync(appDataPath)) {
      fsx.copy(appDataPath, path.join(backupDataPath, moment().format('DDMMYYYY-hmmss')), err => {
        if (err) {
          return logger(err);
        }
        logger('Backup Successful!');
      });
    }
  }
}
