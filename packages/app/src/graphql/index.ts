import { ApolloQueryResult, FetchResult, MutationOptions, QueryOptions } from 'apollo-boost';
import * as t from 'types';
import { omitTypeName } from './../graphql/utils';
import { client } from './apollo/client';
import * as gql from './gql';

export class Apollo {
  static async mutate(options: MutationOptions) {
    await client.cache.reset();
    options.errorPolicy = 'all';
    return client.mutate(options).then(result => omitTypeName(result));
  }

  static async query(options: QueryOptions) {
    await client.cache.reset();
    options.errorPolicy = 'all';
    return client.query(options).then(result => omitTypeName(result));
  }

  static UpdateWorkTimeSettings(
    settings: t.WorkTimeSettingsInput
  ): Promise<FetchResult<t.UpdateWorkTimeSettings.Mutation>> {
    return this.mutate({
      variables: {
        settings
      },
      mutation: gql.UPDATE_WORKTIME_SETTINGS
    });
  }

  static deletePause(pauseId: string): Promise<FetchResult<t.DeletePause.Mutation>> {
    return this.mutate({
      variables: {
        pauseId
      },
      mutation: gql.DELETE_PAUSE
    });
  }

  static createPause(pause: t.PauseInput): Promise<FetchResult<t.CreatePause.Mutation>> {
    return this.mutate({
      variables: {
        pause
      },
      mutation: gql.CREATE_PAUSE
    });
  }

  static deletePublicHoliday(year: string, holidayId: string): Promise<FetchResult<t.DeletePublicHoliday.Mutation>> {
    return this.mutate({
      variables: {
        year,
        holidayId
      },
      mutation: gql.DELETE_PUBLIC_HOLIDAY
    });
  }

  static createPublicHoliday(holiday: t.PublicHolidayInput): Promise<FetchResult<t.CreatePublicHoliday.Mutation>> {
    return this.mutate({
      variables: {
        holiday
      },
      mutation: gql.CREATE_PUBLIC_HOLIDAY
    });
  }

  static addTimestampByCode(code: string): Promise<FetchResult<t.AddTimestampByCode.Mutation>> {
    return this.mutate({
      variables: {
        code
      },
      mutation: gql.ADD_TIMESTAMP_BY_CODE
    });
  }

  static updateComplains(
    userId: string,
    date: string,
    complains: t.ComplainInput[]
  ): Promise<FetchResult<t.UpdateComplains.Mutation>> {
    return this.mutate({
      variables: {
        userId,
        date,
        complains
      },
      mutation: gql.UPDATE_COMPLAINS
    });
  }

  static deleteLeave(userId: string, leave: t.LeaveInput): Promise<FetchResult<t.DeleteLeave.Mutation>> {
    return this.mutate({
      variables: {
        userId,
        leave
      },
      mutation: gql.DELETE_LEAVE
    });
  }

  static updateTimestamps(
    userId: string,
    date: string,
    timestamps: t.TimestampInput[]
  ): Promise<FetchResult<t.UpdateTimestamps.Mutation>> {
    return this.mutate({
      variables: {
        userId,
        date,
        timestamps
      },
      mutation: gql.UPDATE_TIMESTAMPS
    });
  }

  static rewriteTimestamps(userId: string, date: string): Promise<FetchResult<t.RewriteTimestamps.Mutation>> {
    return this.mutate({
      variables: {
        userId,
        date
      },
      mutation: gql.REWRITE_TIMESTAMPS
    });
  }

  static updateUser(user: t.UserInput): Promise<FetchResult<t.UpdateUser.Mutation>> {
    return this.mutate({
      variables: {
        user
      },
      mutation: gql.UPDATE_USER
    });
  }

  static deleteUser(userId: string): Promise<FetchResult<t.DeleteUser.Mutation>> {
    return this.mutate({
      variables: {
        userId
      },
      mutation: gql.DELETE_USER,
      update: (cache, result: any) => {
        if (result && result.data) {
          cache.writeQuery({
            query: gql.GET_USERS,
            data: { getUsers: result.data.deleteUser }
          });
        }
      }
    });
  }

  static createLeave(userId: string, leave: t.LeaveInput): Promise<FetchResult<t.CreateLeave.Mutation>> {
    return this.mutate({
      variables: {
        userId,
        leave
      },
      mutation: gql.CREATE_LEAVE
    });
  }

  static updateAllUserWorkTimesById(
    userId: string,
    workTimes: t.WorkTimesInput
  ): Promise<FetchResult<t.UpdateAllUserWorkTimesById.Mutation>> {
    return this.mutate({
      variables: { userId, workTimes },
      mutation: gql.UPDATE_ALL_USER_WORKTIMES_BYID
    });
  }

  static createUser(user: t.UserInput): Promise<FetchResult<t.CreateUser.Mutation>> {
    return this.mutate({
      variables: {
        user
      },
      mutation: gql.CREATE_USER,
      update: (cache, result: any) => {
        const currentCache = cache.readQuery({ query: gql.GET_USERS }) as t.GetUsers.Query;
        if (currentCache && result && result.data) {
          cache.writeQuery({
            query: gql.GET_USERS,
            data: { getUsers: currentCache.getUsers.concat([result.data.createUser]) }
          });
        }
      }
    });
  }

  /**
   * QUERIES
   */

  static getWorkTimeSettings(): Promise<ApolloQueryResult<t.GetWorkTimeSettings.Query>> {
    return this.query({
      query: gql.GET_WORKTIME_SETTINGS
    });
  }

  static getPauses(): Promise<ApolloQueryResult<t.GetPauses.Query>> {
    return this.query({
      query: gql.GET_PAUSES
    });
  }

  static getTimestamps(userId: string, date: string): Promise<ApolloQueryResult<t.GetTimestamps.Query>> {
    return this.query({
      variables: { userId, date },
      query: gql.GET_TIMESTAMPS
    });
  }

  static getComplains(userId: string, date: string): Promise<ApolloQueryResult<t.GetComplains.Query>> {
    return this.query({
      variables: { userId, date },
      query: gql.GET_COMPLAINS
    });
  }

  static getComplainsAndTimestamps(
    userId: string,
    date: string
  ): Promise<ApolloQueryResult<t.GetComplainsAndTimestamps.Query>> {
    return this.query({
      variables: { userId, date },
      query: gql.GET_COMPLAINS_AND_TIMESTAMPS
    });
  }

  static getYearSaldo(userId: string, date: string): Promise<ApolloQueryResult<t.GetYearSaldo.Query>> {
    return this.query({
      variables: { userId, date },
      query: gql.GET_YEAR_SALDO
    });
  }

  static getStatisticForMonth(userId: string, date: string): Promise<ApolloQueryResult<t.GetStatisticForMonth.Query>> {
    return this.query({
      variables: { userId, date },
      query: gql.GET_STATISTIC_FOR_MONTH
    });
  }

  static getStatisticForWeek(userId: string, date: string): Promise<ApolloQueryResult<t.GetStatisticForWeek.Query>> {
    return this.query({
      variables: { userId, date },
      query: gql.GET_STATISTIC_FOR_WEEK
    });
  }

  static getStatisticForDate(userId: string, date: string): Promise<ApolloQueryResult<t.GetStatisticForDate.Query>> {
    return this.query({
      variables: { userId, date },
      query: gql.GET_STATISTIC_FOR_DATE
    });
  }

  static getEvaluationForUsers(date: string): Promise<ApolloQueryResult<t.GetEvaluationForUsers.Query>> {
    return this.query({
      variables: { date },
      query: gql.GET_EVALUATION_FOR_USERS
    });
  }

  static getEvaluationForMonth(
    userId: string,
    date: string
  ): Promise<ApolloQueryResult<t.GetEvaluationForMonth.Query>> {
    return this.query({
      variables: { userId, date },
      query: gql.GET_EVALUATION_FOR_MONTH
    });
  }

  static loadPublicHolidays(year: string): Promise<ApolloQueryResult<t.LoadPublicHolidays.Query>> {
    return this.query({
      variables: { year },
      query: gql.LOAD_PUBLIC_HOLIDAYS
    });
  }

  static getPublicHolidays(year: string): Promise<ApolloQueryResult<t.GetPublicHolidays.Query>> {
    return this.query({
      variables: { year },
      query: gql.GET_PUBLIC_HOLIDAYS
    });
  }

  static loginUser(password: string): Promise<ApolloQueryResult<t.LoginUser.Query>> {
    return this.query({
      variables: { password },
      query: gql.LOGIN_USER
    });
  }

  static verifyLogin(token: string): Promise<ApolloQueryResult<t.VerifyLogin.Query>> {
    return this.query({
      variables: { token },
      query: gql.VERIFY_LOGIN
    });
  }

  static logout(): Promise<void> {
    return client.cache.reset();
  }

  static getLeaveDays(userId: string, year: string): Promise<ApolloQueryResult<t.GetLeaveDays.Query>> {
    return this.query({
      variables: { userId, year },
      query: gql.GET_LEAVE_DAYS
    });
  }

  static getLeaveDaysAndPublicHoliday(
    userId: string,
    year: string
  ): Promise<ApolloQueryResult<t.GetLeaveDaysAndPublicHolidays.Query>> {
    return this.query({
      variables: { userId, year },
      query: gql.GET_LEAVE_DAYS_AND_PUBLIC_HOLIDAYS
    });
  }

  static getUsers(): Promise<ApolloQueryResult<t.GetUsers.Query>> {
    return this.query({
      query: gql.GET_USERS
    });
  }

  static getUserById(userId: string): Promise<ApolloQueryResult<t.GetUserById.Query>> {
    return this.query({
      variables: { userId },
      query: gql.GET_USER_BY_ID
    });
  }
}
