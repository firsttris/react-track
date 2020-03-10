import { ApolloQueryResult, FetchResult, MutationOptions, QueryOptions } from 'apollo-boost';
import * as t from 'common/types';
import { omitTypeName } from 'common/utils';
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
  ): Promise<FetchResult<t.UpdateWorkTimeSettingsMutation>> {
    return this.mutate({
      variables: {
        settings
      },
      mutation: gql.UPDATE_WORKTIME_SETTINGS
    });
  }

  static deletePause(pauseId: string): Promise<FetchResult<t.DeletePauseMutation>> {
    return this.mutate({
      variables: {
        pauseId
      },
      mutation: gql.DELETE_PAUSE
    });
  }

  static createPause(pause: t.PauseInput): Promise<FetchResult<t.CreatePauseMutation>> {
    return this.mutate({
      variables: {
        pause
      },
      mutation: gql.CREATE_PAUSE
    });
  }

  static deletePublicHoliday(year: string, holidayId: string): Promise<FetchResult<t.DeletePublicHolidayMutation>> {
    return this.mutate({
      variables: {
        year,
        holidayId
      },
      mutation: gql.DELETE_PUBLIC_HOLIDAY
    });
  }

  static createPublicHoliday(holiday: t.PublicHolidayInput): Promise<FetchResult<t.CreatePublicHolidayMutation>> {
    return this.mutate({
      variables: {
        holiday
      },
      mutation: gql.CREATE_PUBLIC_HOLIDAY
    });
  }

  static addTimestampByCode(code: string): Promise<FetchResult<t.AddTimestampByCodeMutation>> {
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
  ): Promise<FetchResult<t.UpdateComplainsMutation>> {
    return this.mutate({
      variables: {
        userId,
        date,
        complains
      },
      mutation: gql.UPDATE_COMPLAINS
    });
  }

  static deleteLeave(userId: string, leave: t.LeaveInput): Promise<FetchResult<t.DeleteLeaveMutation>> {
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
  ): Promise<FetchResult<t.UpdateTimestampsMutation>> {
    return this.mutate({
      variables: {
        userId,
        date,
        timestamps
      },
      mutation: gql.UPDATE_TIMESTAMPS
    });
  }

  static rewriteTimestamps(userId: string, date: string): Promise<FetchResult<t.RewriteTimestampsMutation>> {
    return this.mutate({
      variables: {
        userId,
        date
      },
      mutation: gql.REWRITE_TIMESTAMPS
    });
  }

  static updateUser(user: t.UserInput): Promise<FetchResult<t.UpdateUserMutation>> {
    return this.mutate({
      variables: {
        user
      },
      mutation: gql.UPDATE_USER
    });
  }

  static deleteUser(userId: string): Promise<FetchResult<t.DeleteUserMutation>> {
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

  static createLeave(userId: string, leave: t.LeaveInput): Promise<FetchResult<t.CreateLeaveMutation>> {
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
  ): Promise<FetchResult<t.UpdateAllUserWorkTimesByIdMutation>> {
    return this.mutate({
      variables: { userId, workTimes },
      mutation: gql.UPDATE_ALL_USER_WORKTIMES_BYID
    });
  }

  static createUser(user: t.UserInput): Promise<FetchResult<t.CreateUserMutation>> {
    return this.mutate({
      variables: {
        user
      },
      mutation: gql.CREATE_USER,
      update: (cache, result: any) => {
        const currentCache = cache.readQuery({ query: gql.GET_USERS }) as t.GetUsersQuery;
        if (currentCache && result && result.data) {
          cache.writeQuery({
            query: gql.GET_USERS,
            data: { getUsers: currentCache.getUsers.concat([result.data.createUser]) }
          });
        }
      }
    });
  }

  static addLicense(key: string): Promise<FetchResult<t.AddLicenseMutation>> {
    return this.mutate({
      variables: {
        key
      },
      mutation: gql.ADD_LICENSE
    });
  }

  /**
   * QUERIES
   */

  static getWorkTimeSettings(): Promise<ApolloQueryResult<t.GetWorkTimeSettingsQuery>> {
    return this.query({
      query: gql.GET_WORKTIME_SETTINGS
    });
  }

  static getPauses(): Promise<ApolloQueryResult<t.GetPausesQuery>> {
    return this.query({
      query: gql.GET_PAUSES
    });
  }

  static getTimestamps(userId: string, date: string): Promise<ApolloQueryResult<t.GetTimestampsQuery>> {
    return this.query({
      variables: { userId, date },
      query: gql.GET_TIMESTAMPS
    });
  }

  static getComplains(userId: string, date: string): Promise<ApolloQueryResult<t.GetComplainsQuery>> {
    return this.query({
      variables: { userId, date },
      query: gql.GET_COMPLAINS
    });
  }

  static getComplainsAndTimestamps(
    userId: string,
    date: string
  ): Promise<ApolloQueryResult<t.GetComplainsAndTimestampsQuery>> {
    return this.query({
      variables: { userId, date },
      query: gql.GET_COMPLAINS_AND_TIMESTAMPS
    });
  }

  static getYearSaldo(userId: string, date: string): Promise<ApolloQueryResult<t.GetYearSaldoQuery>> {
    return this.query({
      variables: { userId, date },
      query: gql.GET_YEAR_SALDO
    });
  }

  static getStatisticForMonth(userId: string, date: string): Promise<ApolloQueryResult<t.GetStatisticForMonthQuery>> {
    return this.query({
      variables: { userId, date },
      query: gql.GET_STATISTIC_FOR_MONTH
    });
  }

  static getStatisticForWeek(userId: string, date: string): Promise<ApolloQueryResult<t.GetStatisticForWeekQuery>> {
    return this.query({
      variables: { userId, date },
      query: gql.GET_STATISTIC_FOR_WEEK
    });
  }

  static getStatisticForDate(userId: string, date: string): Promise<ApolloQueryResult<t.GetStatisticForDateQuery>> {
    return this.query({
      variables: { userId, date },
      query: gql.GET_STATISTIC_FOR_DATE
    });
  }

  static getEvaluationForUsers(date: string): Promise<ApolloQueryResult<t.GetEvaluationForUsersQuery>> {
    return this.query({
      variables: { date },
      query: gql.GET_EVALUATION_FOR_USERS
    });
  }

  static getEvaluationForMonth(userId: string, date: string): Promise<ApolloQueryResult<t.GetEvaluationForMonthQuery>> {
    return this.query({
      variables: { userId, date },
      query: gql.GET_EVALUATION_FOR_MONTH
    });
  }

  static loadPublicHolidays(year: string): Promise<ApolloQueryResult<t.LoadPublicHolidaysQuery>> {
    return this.query({
      variables: { year },
      query: gql.LOAD_PUBLIC_HOLIDAYS
    });
  }

  static getPublicHolidays(year: string): Promise<ApolloQueryResult<t.GetPublicHolidaysQuery>> {
    return this.query({
      variables: { year },
      query: gql.GET_PUBLIC_HOLIDAYS
    });
  }

  static loginUser(password: string): Promise<ApolloQueryResult<t.LoginUserQuery>> {
    return this.query({
      variables: { password },
      query: gql.LOGIN_USER
    });
  }

  static verifyLogin(token: string): Promise<ApolloQueryResult<t.VerifyLoginQuery>> {
    return this.query({
      variables: { token },
      query: gql.VERIFY_LOGIN
    });
  }

  static logout(): Promise<void> {
    return client.cache.reset();
  }

  static getLeaveDays(userId: string, year: string): Promise<ApolloQueryResult<t.GetLeaveDaysQuery>> {
    return this.query({
      variables: { userId, year },
      query: gql.GET_LEAVE_DAYS
    });
  }

  static getLeaveDaysAndPublicHoliday(
    userId: string,
    year: string
  ): Promise<ApolloQueryResult<t.GetLeaveDaysAndPublicHolidaysQuery>> {
    return this.query({
      variables: { userId, year },
      query: gql.GET_LEAVE_DAYS_AND_PUBLIC_HOLIDAYS
    });
  }

  static getUsers(): Promise<ApolloQueryResult<t.GetUsersQuery>> {
    return this.query({
      query: gql.GET_USERS
    });
  }

  static getUserById(userId: string): Promise<ApolloQueryResult<t.GetUserByIdQuery>> {
    return this.query({
      variables: { userId },
      query: gql.GET_USER_BY_ID
    });
  }

  static getLicense(): Promise<ApolloQueryResult<t.GetLicenseQuery>> {
    return this.query({
      variables: {},
      query: gql.GET_LICENSE
    });
  }
}
