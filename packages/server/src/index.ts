import { ApolloServer } from 'apollo-server-express';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { IResolvers } from 'graphql-tools';
import * as t from 'common/types';
import './backup';
import { TimestampsBatch } from './batch/TimestampsBatch';
import { EvaluationCalculator } from './calculators/EvaluationCalculator';
import { StatisticCalculator } from './calculators/StatisticCalculator';
import { ComplainCollection } from './collections/ComplainCollection';
import { LeaveCollection } from './collections/LeaveCollection';
import { PublicHolidayCollection } from './collections/PublicHolidayCollection';
import { SettingsCollection } from './collections/SettingsCollection';
import { TimestampCollection } from './collections/TimestampCollection';
import { UserCollection } from './collections/UserCollection';
import { typeDefs } from './schema';
import { PublicHolidayService } from './services/PublicHolidayService';
import cors = require('cors');
import { LicenseService } from './services/LicenseService';

declare global {
  namespace Express {
    interface Request {
      user: t.User;
      license: t.License;
    }
  }
}

const resolvers = {
  Query: {
    getUsers: async (source: any, args: t.GetUsersQueryVariables) => UserCollection.find(args),
    getUserById: async (source: any, args: t.GetUserByIdQueryVariables) => UserCollection.getById(args.userId),
    loginUser: async (source: any, args: t.LoginUserQueryVariables) => UserCollection.loginUser(args.password),
    verifyLogin: async (source: any, args: t.VerifyLoginQueryVariables) => UserCollection.verifyLogin(args.token),
    getWorkTimeSettings: async () => SettingsCollection.getWorkTimeSettings(),
    getLeaveDays: async (source: any, args: t.GetLeaveDaysQueryVariables) =>
      LeaveCollection.getLeaveDays(args.userId, args.year),
    getPublicHolidays: async (source: any, args: t.GetPublicHolidaysQueryVariables) =>
      PublicHolidayCollection.getPublicHolidays(args.year),
    loadPublicHolidays: async (source: any, args: t.LoadPublicHolidaysQueryVariables) =>
      PublicHolidayService.loadPublicHolidaysFromJarmedia(args.year),
    getStatisticForDate: async (source: any, args: t.GetStatisticForDateQueryVariables) =>
      StatisticCalculator.getFormattedStatisticForDate(args.date, args.userId),
    getStatisticForWeek: async (source: any, args: t.GetStatisticForWeekQueryVariables) =>
      StatisticCalculator.getStatisticForWeek(args.date, args.userId),
    getStatisticForMonth: async (source: any, args: t.GetStatisticForMonthQueryVariables) =>
      StatisticCalculator.getStatisticForMonth(args.date, args.userId),
    getYearSaldo: async (source: any, args: t.GetYearSaldoQueryVariables) =>
      StatisticCalculator.calculateYearSaldo(args.date, args.userId),
    getComplains: async (source: any, args: t.GetComplainsQueryVariables) =>
      ComplainCollection.get(args.userId, args.date),
    getTimestamps: async (source: any, args: t.GetTimestampsQueryVariables) =>
      TimestampCollection.getTimestamps(args.userId, args.date),
    getPauses: async (source: any, args: {}) => SettingsCollection.getPauses(),
    getEvaluationForMonth: async (source: any, args: t.GetEvaluationForMonthQueryVariables) =>
      EvaluationCalculator.getEvaluationForMonth(args.date, args.userId),
    getEvaluationForUsers: async (source: any, args: t.GetEvaluationForUsersQueryVariables) =>
      EvaluationCalculator.getEvaluationForUsers(args.date),
    getLicense: async (source: any, args: t.GetLicenseQueryVariables) => SettingsCollection.getLicense()
  },
  Mutation: {
    createUser: async (source: any, args: t.CreateUserMutationVariables) => UserCollection.create(args.user),
    updateUser: async (source: any, args: t.UpdateUserMutationVariables) => UserCollection.update(args.user),
    deleteUser: async (source: any, args: t.DeleteUserMutationVariables) => UserCollection.deleteUser(args.userId),
    updateWorkTimeSettings: async (source: any, args: t.UpdateWorkTimeSettingsMutationVariables) =>
      SettingsCollection.setWorkTimeSettings(args.settings),
    updateAllUserWorkTimesById: async (source: any, args: t.UpdateAllUserWorkTimesByIdMutationVariables) =>
      UserCollection.updateWorkTimesForAllUser(args.userId, args.workTimes),
    createLeave: async (source: any, args: t.CreateLeaveMutationVariables) =>
      LeaveCollection.create(args.userId, args.leave),
    deleteLeave: async (source: any, args: t.DeleteLeaveMutationVariables) =>
      LeaveCollection.removeLeave(args.userId, args.leave),
    updateTimestamps: async (source: any, args: t.UpdateTimestampsMutationVariables) =>
      TimestampCollection.update(args.userId, args.date, args.timestamps),
    updateComplains: async (source: any, args: t.UpdateComplainsMutationVariables) =>
      ComplainCollection.update(args.userId, args.date, args.complains),
    createPause: async (source: any, args: t.CreatePauseMutationVariables) =>
      SettingsCollection.createPause(args.pause),
    deletePause: async (source: any, args: t.DeletePauseMutationVariables) =>
      SettingsCollection.removePauseById(args.pauseId),
    createPublicHoliday: async (source: any, args: t.CreatePublicHolidayMutationVariables) =>
      PublicHolidayCollection.create(args.holiday),
    deletePublicHoliday: async (source: any, args: t.DeletePublicHolidayMutationVariables) =>
      PublicHolidayCollection.removePublicHolidayById(args.year, args.holidayId),
    addTimestampByCode: async (source: any, args: t.AddTimestampByCodeMutationVariables) =>
      UserCollection.addTimestampByCode(args.code),
    rewriteTimestamps: async (source: any, args: any) => TimestampsBatch.rewriteTimestamps(args.userId, args.date),
    addLicense: async (source: any, args: t.AddLicenseMutationVariables) => SettingsCollection.addLicense(args.key)
  }
} as IResolvers;

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post('/api/login', async (req, res) => {
  await LicenseService.refreshLicense();

  UserCollection.loginUser(req.body.password)
    .then(result => res.status(200).json(result))
    .catch(e => res.status(403).json(e.message));
});

const server = new ApolloServer({ typeDefs, resolvers });

// auth middleware
app.use(server.graphqlPath, async (req, res, next) => {
  const operation = req.body.operationName;
  if (operation) {
    try {
      await LicenseService.checkLicenseValidity(operation);
    } catch (error) {
      res.json({
        errors: [{ message: error.message }]
      });
      return;
    }
  }

  const token = req.headers.authorization || 'no_token';
  if (process.env.NODE_ENV === 'production') {
    return UserCollection.verifyLogin(token)
      .then(async user => {
        req.user = user;
        req.license = await SettingsCollection.getLicense();
        next();
      })
      .catch(e =>
        res.status(401).json({
          message: e.message
        })
      );
  } else {
    next();
  }
});

server.applyMiddleware({ app });

// Start the server
app.listen(3001, () => {
  console.log(`Go to http://localhost:3001${server.graphqlPath} to run queries!`);
});
