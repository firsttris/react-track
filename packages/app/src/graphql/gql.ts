import gql from 'graphql-tag';
import * as fragments from './fragments';

/**
 * MUTATIONS
 */

export const UPDATE_ALL_USER_WORKTIMES_BYID = gql`
  mutation UpdateAllUserWorkTimesById($userId: String!, $workTimes: WorkTimesInput!) {
    updateAllUserWorkTimesById(userId: $userId, workTimes: $workTimes) {
      ...WorkTimesFields
    }
  }
  ${fragments.WorkTimesFragment}
`;

export const CREATE_USER = gql`
  mutation CreateUser($user: UserInput!) {
    createUser(user: $user) {
      ...UserFields
    }
  }
  ${fragments.UserFragment}
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($user: UserInput!) {
    updateUser(user: $user) {
      ...UserFields
    }
  }
  ${fragments.UserFragment}
`;

export const DELETE_USER = gql`
  mutation DeleteUser($userId: String!) {
    deleteUser(userId: $userId) {
      ...UserFields
    }
  }
  ${fragments.UserFragment}
`;

export const CREATE_LEAVE = gql`
  mutation CreateLeave($userId: String!, $leave: LeaveInput!) {
    createLeave(userId: $userId, leave: $leave) {
      ...LeaveFields
    }
  }
  ${fragments.LeaveFragment}
`;

export const DELETE_LEAVE = gql`
  mutation DeleteLeave($userId: String!, $leave: LeaveInput!) {
    deleteLeave(userId: $userId, leave: $leave) {
      ...LeaveFields
    }
  }
  ${fragments.LeaveFragment}
`;

export const UPDATE_TIMESTAMPS = gql`
  mutation UpdateTimestamps($userId: String!, $date: String!, $timestamps: [TimestampInput!]!) {
    updateTimestamps(userId: $userId, date: $date, timestamps: $timestamps) {
      timestamps {
        ...TimestampFields
      }
      error
    }
  }
  ${fragments.TimestampFragment}
`;

export const REWRITE_TIMESTAMPS = gql`
  mutation RewriteTimestamps($userId: String!, $date: String!) {
    rewriteTimestamps(userId: $userId, date: $date)
  }
`;

export const ADD_TIMESTAMP_BY_CODE = gql`
  mutation AddTimestampByCode($code: String!) {
    addTimestampByCode(code: $code) {
      ...TimestampUserAndStatisticFields
    }
  }
  ${fragments.TimestampUserAndStatisticFragment}
`;

export const UPDATE_COMPLAINS = gql`
  mutation UpdateComplains($userId: String!, $date: String!, $complains: [ComplainInput!]!) {
    updateComplains(userId: $userId, date: $date, complains: $complains) {
      ...ComplainFields
    }
  }
  ${fragments.ComplainFragment}
`;

export const DELETE_PUBLIC_HOLIDAY = gql`
  mutation DeletePublicHoliday($year: String!, $holidayId: String!) {
    deletePublicHoliday(year: $year, holidayId: $holidayId) {
      ...PublicHolidayFields
    }
  }
  ${fragments.PublicHolidayFragment}
`;

export const CREATE_PUBLIC_HOLIDAY = gql`
  mutation CreatePublicHoliday($holiday: PublicHolidayInput!) {
    createPublicHoliday(holiday: $holiday) {
      ...PublicHolidayFields
    }
  }
  ${fragments.PublicHolidayFragment}
`;

export const DELETE_PAUSE = gql`
  mutation DeletePause($pauseId: String!) {
    deletePause(pauseId: $pauseId) {
      ...PauseFields
    }
  }
  ${fragments.PauseFragment}
`;

export const CREATE_PAUSE = gql`
  mutation CreatePause($pause: PauseInput!) {
    createPause(pause: $pause) {
      ...PauseFields
    }
  }
  ${fragments.PauseFragment}
`;

export const UPDATE_WORKTIME_SETTINGS = gql`
  mutation UpdateWorkTimeSettings($settings: WorkTimeSettingsInput!) {
    updateWorkTimeSettings(settings: $settings) {
      ...WorkTimeSettingsFields
    }
  }
  ${fragments.WorkTimeSettingsFragment}
`;

export const ADD_LICENSE = gql`
  mutation AddLicense($key: String!) {
    addLicense(key: $key) {
      ...LicenseFields
    }
  }
  ${fragments.LicenseFragment}
`;

/**
 * QUERIES
 */

export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      name
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($userId: String!) {
    getUserById(userId: $userId) {
      ...UserFields
    }
  }
  ${fragments.UserFragment}
`;

export const LOGIN_USER = gql`
  query LoginUser($password: String!) {
    loginUser(password: $password) {
      token
      ...UserFields
    }
  }
  ${fragments.UserFragment}
`;

export const VERIFY_LOGIN = gql`
  query VerifyLogin($token: String!) {
    verifyLogin(token: $token) {
      ...UserFields
    }
  }
  ${fragments.UserFragment}
`;

export const GET_LEAVE_DAYS = gql`
  query GetLeaveDays($userId: String!, $year: String!) {
    getLeaveDays(userId: $userId, year: $year) {
      ...LeaveFields
    }
  }
  ${fragments.LeaveFragment}
`;

export const GET_PUBLIC_HOLIDAYS = gql`
  query GetPublicHolidays($year: String!) {
    getPublicHolidays(year: $year) {
      ...PublicHolidayFields
    }
  }
  ${fragments.PublicHolidayFragment}
`;

export const GET_LEAVE_DAYS_AND_PUBLIC_HOLIDAYS = gql`
  query GetLeaveDaysAndPublicHolidays($userId: String!, $year: String!) {
    getLeaveDays(userId: $userId, year: $year) {
      ...LeaveFields
    }
    getPublicHolidays(year: $year) {
      ...PublicHolidayFields
    }
  }
  ${fragments.LeaveFragment}
  ${fragments.PublicHolidayFragment}
`;

export const LOAD_PUBLIC_HOLIDAYS = gql`
  query LoadPublicHolidays($year: String!) {
    loadPublicHolidays(year: $year) {
      ...PublicHolidayFields
    }
  }
  ${fragments.PublicHolidayFragment}
`;

export const GET_EVALUATION_FOR_MONTH = gql`
  query GetEvaluationForMonth($userId: String!, $date: String!) {
    getEvaluationForMonth(userId: $userId, date: $date) {
      ...EvaluationFields
    }
  }
  ${fragments.EvaluationFragment}
`;

export const GET_EVALUATION_FOR_USERS = gql`
  query GetEvaluationForUsers($date: String!) {
    getEvaluationForUsers(date: $date) {
      ...UserEvaluationFields
    }
  }
  ${fragments.UserEvaluationFragment}
`;

export const GET_STATISTIC_FOR_DATE = gql`
  query GetStatisticForDate($date: String!, $userId: String!) {
    getStatisticForDate(date: $date, userId: $userId) {
      statisticForDate {
        ...StatisticFields
      }
      selectedDate
    }
    getYearSaldo(date: $date, userId: $userId)
  }
  ${fragments.StatisticFragment}
`;

export const GET_STATISTIC_FOR_WEEK = gql`
  query GetStatisticForWeek($date: String!, $userId: String!) {
    getStatisticForWeek(date: $date, userId: $userId) {
      statisticForWeek {
        ...StatisticFields
      }
      selectedDate
    }
  }
  ${fragments.StatisticFragment}
`;

export const GET_STATISTIC_FOR_MONTH = gql`
  query GetStatisticForMonth($date: String!, $userId: String!) {
    getStatisticForMonth(date: $date, userId: $userId) {
      statisticForMonth {
        ...StatisticFields
      }
      hoursSpentForMonthPerDay {
        ...HoursPerDayFields
      }
      selectedDate
    }
  }
  ${fragments.StatisticFragment}
  ${fragments.HoursPerDayFragment}
`;

export const GET_YEAR_SALDO = gql`
  query GetYearSaldo($date: String!, $userId: String!) {
    getYearSaldo(date: $date, userId: $userId)
  }
`;

export const GET_COMPLAINS = gql`
  query GetComplains($userId: String!, $date: String!) {
    getComplains(userId: $userId, date: $date) {
      ...ComplainFields
    }
  }
  ${fragments.ComplainFragment}
`;

export const GET_TIMESTAMPS = gql`
  query GetTimestamps($userId: String!, $date: String!) {
    getTimestamps(userId: $userId, date: $date) {
      ...TimestampFields
    }
  }
  ${fragments.TimestampFragment}
`;

export const GET_COMPLAINS_AND_TIMESTAMPS = gql`
  query GetComplainsAndTimestamps($userId: String!, $date: String!) {
    getComplains(userId: $userId, date: $date) {
      ...ComplainFields
    }
    getTimestamps(userId: $userId, date: $date) {
      ...TimestampFields
    }
  }
  ${fragments.ComplainFragment}
  ${fragments.TimestampFragment}
`;

export const GET_PAUSES = gql`
  query GetPauses {
    getPauses {
      ...PauseFields
    }
  }
  ${fragments.PauseFragment}
`;

export const GET_WORKTIME_SETTINGS = gql`
  query GetWorkTimeSettings {
    getWorkTimeSettings {
      ...WorkTimeSettingsFields
    }
  }
  ${fragments.WorkTimeSettingsFragment}
`;

export const GET_LICENSE = gql`
  query GetLicense {
    getLicense {
      ...LicenseFields
    }
  }
  ${fragments.LicenseFragment}
`;
