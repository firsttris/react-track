import schedule = require('node-schedule');
import { DirectoryHelper } from './helper/DirectoryHelper';

schedule.scheduleJob('0 0 23 * * *', () => {
  DirectoryHelper.backup();
});
