import { ApolloServer } from 'apollo-server-express';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { IResolvers } from 'graphql-tools';
import * as path from 'path';
import * as t from 'types';
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
const cors = require('cors');

declare global {
  namespace Express {
    interface Request {
      user: t.User;
    }
  }
}

/* tslint:disable:no-object-literal-type-assertion */
// The resolvers
const resolvers = {
  Query: {
    getUsers: async (source: any, args: t.GetUsersQueryArgs) => UserCollection.find(args),
    getUserById: async (source: any, args: t.GetUserByIdQueryArgs) => UserCollection.getById(args.userId),
    loginUser: async (source: any, args: t.LoginUserQueryArgs) => UserCollection.loginUser(args.password),
    verifyLogin: async (source: any, args: t.VerifyLoginQueryArgs) => UserCollection.verifyLogin(args.token),
    getWorkTimeSettings: async () => SettingsCollection.getWorkTimeSettings(),
    getLeaveDays: async (source: any, args: t.GetLeaveDaysQueryArgs) =>
      LeaveCollection.getLeaveDays(args.userId, args.year),
    getPublicHolidays: async (source: any, args: t.GetPublicHolidaysQueryArgs) =>
      PublicHolidayCollection.getPublicHolidays(args.year),
    loadPublicHolidays: async (source: any, args: t.LoadPublicHolidaysQueryArgs) =>
      PublicHolidayService.loadPublicHolidaysFromJarmedia(args.year),
    getStatisticForDate: async (source: any, args: t.GetStatisticForDateQueryArgs) =>
      StatisticCalculator.getFormattedStatisticForDate(args.date, args.userId),
    getStatisticForWeek: async (source: any, args: t.GetStatisticForWeekQueryArgs) =>
      StatisticCalculator.getStatisticForWeek(args.date, args.userId),
    getStatisticForMonth: async (source: any, args: t.GetStatisticForMonthQueryArgs) =>
      StatisticCalculator.getStatisticForMonth(args.date, args.userId),
    getYearSaldo: async (source: any, args: t.GetYearSaldoQueryArgs) =>
      StatisticCalculator.calculateYearSaldo(args.date, args.userId),
    getComplains: async (source: any, args: t.GetComplainsQueryArgs) => ComplainCollection.get(args.userId, args.date),
    getTimestamps: async (source: any, args: t.GetTimestampsQueryArgs) =>
      TimestampCollection.getTimestamps(args.userId, args.date),
    getPauses: async (source: any, args: {}) => SettingsCollection.getPauses(),
    getEvaluationForMonth: async (source: any, args: t.GetEvaluationForMonthQueryArgs) =>
      EvaluationCalculator.getEvaluationForMonth(args.date, args.userId),
    getEvaluationForUsers: async (source: any, args: t.GetEvaluationForUsersQueryArgs) =>
      EvaluationCalculator.getEvaluationForUsers(args.date)
  },
  Mutation: {
    createUser: async (source: any, args: t.CreateUserMutationArgs) => UserCollection.create(args.user),
    updateUser: async (source: any, args: t.UpdateUserMutationArgs) => UserCollection.update(args.user),
    deleteUser: async (source: any, args: t.DeleteUserMutationArgs) => UserCollection.deleteUser(args.userId),
    updateWorkTimeSettings: async (source: any, args: t.UpdateWorkTimeSettingsMutationArgs) =>
      SettingsCollection.setWorkTimeSettings(args.settings),
    updateAllUserWorkTimesById: async (source: any, args: t.UpdateAllUserWorkTimesByIdMutationArgs) =>
      UserCollection.updateWorkTimesForAllUser(args.userId, args.workTimes),
    createLeave: async (source: any, args: t.CreateLeaveMutationArgs) =>
      LeaveCollection.create(args.userId, args.leave),
    deleteLeave: async (source: any, args: t.DeleteLeaveMutationArgs) =>
      LeaveCollection.removeLeave(args.userId, args.leave),
    updateTimestamps: async (source: any, args: t.UpdateTimestampsMutationArgs) =>
      TimestampCollection.update(args.userId, args.date, args.timestamps),
    updateComplains: async (source: any, args: t.UpdateComplainsMutationArgs) =>
      ComplainCollection.update(args.userId, args.date, args.complains),
    createPause: async (source: any, args: t.CreatePauseMutationArgs) => SettingsCollection.createPause(args.pause),
    deletePause: async (source: any, args: t.DeletePauseMutationArgs) =>
      SettingsCollection.removePauseById(args.pauseId),
    createPublicHoliday: async (source: any, args: t.CreatePublicHolidayMutationArgs) =>
      PublicHolidayCollection.create(args.holiday),
    deletePublicHoliday: async (source: any, args: t.DeletePublicHolidayMutationArgs) =>
      PublicHolidayCollection.removePublicHolidayById(args.year, args.holidayId),
    addTimestampByCode: async (source: any, args: t.AddTimestampByCodeMutationArgs) =>
      UserCollection.addTimestampByCode(args.code),
    rewriteTimestamps: async (source: any, args: any) => TimestampsBatch.rewriteTimestamps(args.userId, args.date)
  }
} as IResolvers;

const app = express();

app.use(cors());
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist-web')));
}

app.post('/login', (req, res) => {
  UserCollection.loginUser(req.body.password)
    .then(result => res.status(200).json(result))
    .catch(e => res.status(403).json(e.message));
});

const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app });

// auth middleware
app.use(server.graphqlPath, (req, res, next) => {
  const token = req.headers.authorization || 'no_token';
  if (process.env.NODE_ENV === 'production') {
    return UserCollection.verifyLogin(token)
      .then(user => {
        req.user = user;
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

// Start the server
app.listen(3001, () => {
  console.log(`Go to http://localhost:3001${server.graphqlPath} to run queries!`);
});
