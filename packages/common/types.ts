export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  Upload: any,
};

export enum CacheControlScope {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}

export type Complain = {
   __typename?: 'Complain',
  reason: Scalars['String'],
  duration: Scalars['String'],
};

export type ComplainInput = {
  reason: Scalars['String'],
  duration: Scalars['String'],
};

export enum DayType {
  WORKDAY = 'WORKDAY',
  WEEKEND = 'WEEKEND',
  PUBLIC_HOLIDAY = 'PUBLIC_HOLIDAY',
  HOLIDAY = 'HOLIDAY',
  SICKDAY = 'SICKDAY',
  SCHOOLDAY = 'SCHOOLDAY',
  AWAY = 'AWAY',
  SHORT_TIME_WORK = 'SHORT_TIME_WORK'
}

export type Evaluation = {
   __typename?: 'Evaluation',
  timeComplain: Scalars['String'],
  timeSpent: Scalars['String'],
  timeLeft: Scalars['String'],
  timeEarned: Scalars['String'],
  timePause: Scalars['String'],
  totalHours: Scalars['String'],
  date: Scalars['String'],
  title: Scalars['String'],
  icon: Scalars['String'],
};

export type GpsCoordinate = {
   __typename?: 'GpsCoordinate',
  latitude: Scalars['Float'],
  longitude: Scalars['Float'],
};

export type GpsCoordinateInput = {
  latitude: Scalars['Float'],
  longitude: Scalars['Float'],
};

export type Holiday = {
   __typename?: 'Holiday',
  year: Scalars['String'],
  comment?: Maybe<Scalars['String']>,
  days: Scalars['Float'],
};

export type HolidayInput = {
  year: Scalars['String'],
  comment?: Maybe<Scalars['String']>,
  days: Scalars['Float'],
};

export type HoursPerDay = {
   __typename?: 'HoursPerDay',
  day: Scalars['Float'],
  hours: Scalars['String'],
  range: Array<Scalars['Float']>,
  hasError: Scalars['Boolean'],
};

export type Leave = {
   __typename?: 'Leave',
  id: Scalars['String'],
  start: LeaveDate,
  end: LeaveDate,
  type: DayType,
  requestedLeaveDays: Scalars['Float'],
};

export type LeaveDate = {
   __typename?: 'LeaveDate',
  date: Scalars['String'],
  type: WorkDayType,
};

export type LeaveDateInput = {
  date: Scalars['String'],
  type: WorkDayType,
};

export type LeaveInput = {
  id?: Maybe<Scalars['String']>,
  start: LeaveDateInput,
  end: LeaveDateInput,
  type: DayType,
  requestedLeaveDays?: Maybe<Scalars['Float']>,
};

export type Mutation = {
   __typename?: 'Mutation',
  createUser: User,
  updateUser: User,
  deleteUser: Array<User>,
  updateWorkTimeSettings: WorkTimeSettings,
  updateAllUserWorkTimesById: WorkTimes,
  createLeave: Array<Leave>,
  deleteLeave: Array<Leave>,
  updateTimestamps: ValidatedTimestamps,
  updateComplains: Array<Complain>,
  createPause: Array<Pause>,
  deletePause: Array<Pause>,
  createPublicHoliday: Array<PublicHoliday>,
  deletePublicHoliday: Array<PublicHoliday>,
  addTimestampByCode: TimestampUserAndStatistic,
  rewriteTimestamps?: Maybe<Scalars['Boolean']>,
};


export type MutationCreateUserArgs = {
  user: UserInput
};


export type MutationUpdateUserArgs = {
  user: UserInput
};


export type MutationDeleteUserArgs = {
  userId: Scalars['String']
};


export type MutationUpdateWorkTimeSettingsArgs = {
  settings: WorkTimeSettingsInput
};


export type MutationUpdateAllUserWorkTimesByIdArgs = {
  userId: Scalars['String'],
  workTimes: WorkTimesInput
};


export type MutationCreateLeaveArgs = {
  userId: Scalars['String'],
  leave: LeaveInput
};


export type MutationDeleteLeaveArgs = {
  userId: Scalars['String'],
  leave: LeaveInput
};


export type MutationUpdateTimestampsArgs = {
  userId: Scalars['String'],
  date: Scalars['String'],
  timestamps: Array<TimestampInput>
};


export type MutationUpdateComplainsArgs = {
  userId: Scalars['String'],
  date: Scalars['String'],
  complains: Array<ComplainInput>
};


export type MutationCreatePauseArgs = {
  pause: PauseInput
};


export type MutationDeletePauseArgs = {
  pauseId: Scalars['String']
};


export type MutationCreatePublicHolidayArgs = {
  holiday: PublicHolidayInput
};


export type MutationDeletePublicHolidayArgs = {
  year: Scalars['String'],
  holidayId: Scalars['String']
};


export type MutationAddTimestampByCodeArgs = {
  code: Scalars['String'],
  gpsCoordinate?: Maybe<GpsCoordinateInput>
};


export type MutationRewriteTimestampsArgs = {
  userId: Scalars['String'],
  date: Scalars['String']
};

export type Pause = {
   __typename?: 'Pause',
  id: Scalars['String'],
  time: Scalars['String'],
  durationInMinutes: Scalars['String'],
};

export type PauseInput = {
  time: Scalars['String'],
  durationInMinutes: Scalars['String'],
};

export type PublicHoliday = {
   __typename?: 'PublicHoliday',
  id: Scalars['String'],
  title: Scalars['String'],
  date: Scalars['String'],
  locs?: Maybe<Array<Maybe<Scalars['String']>>>,
};

export type PublicHolidayInput = {
  title: Scalars['String'],
  date: Scalars['String'],
};

export type Query = {
   __typename?: 'Query',
  getUsers: Array<User>,
  getUserById: User,
  verifyLogin: User,
  loginUser: User,
  getWorkTimeSettings: WorkTimeSettings,
  getLeaveDays: Array<Leave>,
  getPublicHolidays: Array<PublicHoliday>,
  loadPublicHolidays: Array<PublicHoliday>,
  getStatisticForDate: StatisticForDate,
  getStatisticForWeek: StatisticForWeek,
  getStatisticForMonth: StatisticForMonth,
  getYearSaldo: Scalars['String'],
  getComplains: Array<Complain>,
  getTimestamps: Array<Timestamp>,
  getPauses: Array<Pause>,
  getEvaluationForMonth: Array<Evaluation>,
  getEvaluationForUsers: Array<UserEvaluation>,
};


export type QueryGetUsersArgs = {
  userId?: Maybe<Scalars['String']>,
  name?: Maybe<Scalars['String']>
};


export type QueryGetUserByIdArgs = {
  userId: Scalars['String']
};


export type QueryVerifyLoginArgs = {
  token: Scalars['String']
};


export type QueryLoginUserArgs = {
  password: Scalars['String']
};


export type QueryGetLeaveDaysArgs = {
  userId: Scalars['String'],
  year: Scalars['String']
};


export type QueryGetPublicHolidaysArgs = {
  year: Scalars['String']
};


export type QueryLoadPublicHolidaysArgs = {
  year: Scalars['String']
};


export type QueryGetStatisticForDateArgs = {
  date: Scalars['String'],
  userId: Scalars['String']
};


export type QueryGetStatisticForWeekArgs = {
  date: Scalars['String'],
  userId: Scalars['String']
};


export type QueryGetStatisticForMonthArgs = {
  date: Scalars['String'],
  userId: Scalars['String']
};


export type QueryGetYearSaldoArgs = {
  date: Scalars['String'],
  userId: Scalars['String']
};


export type QueryGetComplainsArgs = {
  userId: Scalars['String'],
  date: Scalars['String']
};


export type QueryGetTimestampsArgs = {
  userId: Scalars['String'],
  date: Scalars['String']
};


export type QueryGetEvaluationForMonthArgs = {
  date: Scalars['String'],
  userId: Scalars['String']
};


export type QueryGetEvaluationForUsersArgs = {
  date: Scalars['String']
};

export type Saldo = {
   __typename?: 'Saldo',
  year: Scalars['String'],
  comment?: Maybe<Scalars['String']>,
  hours: Scalars['Float'],
};

export type SaldoInput = {
  year: Scalars['String'],
  comment?: Maybe<Scalars['String']>,
  hours: Scalars['Float'],
};

export type Statistic = {
   __typename?: 'Statistic',
  timeComplain: Scalars['String'],
  timeSpent: Scalars['String'],
  timeLeft: Scalars['String'],
  timeEarned: Scalars['String'],
  timePause: Scalars['String'],
  totalHours: Scalars['String'],
};

export type StatisticForDate = {
   __typename?: 'StatisticForDate',
  statisticForDate: Statistic,
  selectedDate: Scalars['String'],
};

export type StatisticForMonth = {
   __typename?: 'StatisticForMonth',
  statisticForMonth: Statistic,
  hoursSpentForMonthPerDay: Array<HoursPerDay>,
  selectedDate: Scalars['String'],
};

export type StatisticForWeek = {
   __typename?: 'StatisticForWeek',
  statisticForWeek: Statistic,
  selectedDate: Scalars['String'],
};

export type Timestamp = {
   __typename?: 'Timestamp',
  id: Scalars['String'],
  time: Scalars['String'],
  actualTime: Scalars['String'],
  status: Scalars['String'],
  type: Scalars['String'],
  gpsCoordinate?: Maybe<GpsCoordinate>,
};

export type TimestampInput = {
  id: Scalars['String'],
  time: Scalars['String'],
  actualTime: Scalars['String'],
  status: Scalars['String'],
  type: Scalars['String'],
};

export type TimestampUserAndStatistic = {
   __typename?: 'TimestampUserAndStatistic',
  timestamp: Timestamp,
  user: User,
  timeLeft: Scalars['String'],
};


export type User = {
   __typename?: 'User',
  id: Scalars['String'],
  name: Scalars['String'],
  holidays: Array<Holiday>,
  code: Scalars['String'],
  role: UserRole,
  token?: Maybe<Scalars['String']>,
  workTimes: WorkTimes,
  startDate: Scalars['String'],
  saldos: Array<Saldo>,
  isGpsRequired?: Maybe<Scalars['Boolean']>,
};

export type UserEvaluation = {
   __typename?: 'UserEvaluation',
  userName: Scalars['String'],
  listOfEvaluation: Array<Evaluation>,
};

export type UserInput = {
  id?: Maybe<Scalars['String']>,
  name: Scalars['String'],
  holidays: Array<HolidayInput>,
  code: Scalars['String'],
  role: UserRole,
  token?: Maybe<Scalars['String']>,
  startDate: Scalars['String'],
  workTimes: WorkTimesInput,
  saldos: Array<SaldoInput>,
  isGpsRequired?: Maybe<Scalars['Boolean']>,
};

export enum UserRole {
  GUEST = 'GUEST',
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export type ValidatedTimestamps = {
   __typename?: 'ValidatedTimestamps',
  timestamps: Array<Timestamp>,
  error?: Maybe<Scalars['String']>,
};

export enum WorkDayPaymentType {
  PAID = 'PAID',
  UNPAID = 'UNPAID'
}

export enum WorkDayType {
  FULL_DAY = 'FULL_DAY',
  HALF_DAY = 'HALF_DAY'
}

export type WorkTime = {
   __typename?: 'WorkTime',
  startTime: Scalars['String'],
  endTime: Scalars['String'],
  mandatoryHours: Scalars['String'],
};

export type WorkTimeInput = {
  startTime: Scalars['String'],
  endTime: Scalars['String'],
  mandatoryHours: Scalars['String'],
};

export type WorkTimes = {
   __typename?: 'WorkTimes',
  monday: WorkTime,
  tuesday: WorkTime,
  wednesday: WorkTime,
  thursday: WorkTime,
  friday: WorkTime,
  saturday: WorkTime,
  sunday: WorkTime,
};

export type WorkTimeSettings = {
   __typename?: 'WorkTimeSettings',
  schoolday: WorkDayPaymentType,
  publicHoliday: WorkDayPaymentType,
  holiday: WorkDayPaymentType,
  sickday: WorkDayPaymentType,
  shortTimeWork: WorkDayPaymentType,
};

export type WorkTimeSettingsInput = {
  schoolday: WorkDayPaymentType,
  publicHoliday: WorkDayPaymentType,
  holiday: WorkDayPaymentType,
  sickday: WorkDayPaymentType,
  shortTimeWork: WorkDayPaymentType,
};

export type WorkTimesInput = {
  monday: WorkTimeInput,
  tuesday: WorkTimeInput,
  wednesday: WorkTimeInput,
  thursday: WorkTimeInput,
  friday: WorkTimeInput,
  saturday: WorkTimeInput,
  sunday: WorkTimeInput,
};

export type WorkTimeFieldsFragment = (
  { __typename?: 'WorkTime' }
  & Pick<WorkTime, 'startTime' | 'endTime' | 'mandatoryHours'>
);

export type WorkTimesFieldsFragment = (
  { __typename?: 'WorkTimes' }
  & { monday: (
    { __typename?: 'WorkTime' }
    & WorkTimeFieldsFragment
  ), tuesday: (
    { __typename?: 'WorkTime' }
    & WorkTimeFieldsFragment
  ), wednesday: (
    { __typename?: 'WorkTime' }
    & WorkTimeFieldsFragment
  ), thursday: (
    { __typename?: 'WorkTime' }
    & WorkTimeFieldsFragment
  ), friday: (
    { __typename?: 'WorkTime' }
    & WorkTimeFieldsFragment
  ), saturday: (
    { __typename?: 'WorkTime' }
    & WorkTimeFieldsFragment
  ), sunday: (
    { __typename?: 'WorkTime' }
    & WorkTimeFieldsFragment
  ) }
);

export type SaldoFieldsFragment = (
  { __typename?: 'Saldo' }
  & Pick<Saldo, 'year' | 'comment' | 'hours'>
);

export type HolidayFieldsFragment = (
  { __typename?: 'Holiday' }
  & Pick<Holiday, 'year' | 'comment' | 'days'>
);

export type PublicHolidayFieldsFragment = (
  { __typename?: 'PublicHoliday' }
  & Pick<PublicHoliday, 'id' | 'title' | 'date'>
);

export type PauseFieldsFragment = (
  { __typename?: 'Pause' }
  & Pick<Pause, 'id' | 'time' | 'durationInMinutes'>
);

export type WorkTimeSettingsFieldsFragment = (
  { __typename?: 'WorkTimeSettings' }
  & Pick<WorkTimeSettings, 'schoolday' | 'publicHoliday' | 'holiday' | 'sickday' | 'shortTimeWork'>
);

export type TimestampFieldsFragment = (
  { __typename?: 'Timestamp' }
  & Pick<Timestamp, 'id' | 'time' | 'actualTime' | 'status' | 'type'>
  & { gpsCoordinate: Maybe<(
    { __typename?: 'GpsCoordinate' }
    & Pick<GpsCoordinate, 'latitude' | 'longitude'>
  )> }
);

export type StatisticFieldsFragment = (
  { __typename?: 'Statistic' }
  & Pick<Statistic, 'timeComplain' | 'timeSpent' | 'timeLeft' | 'timeEarned' | 'timePause' | 'totalHours'>
);

export type EvaluationFieldsFragment = (
  { __typename?: 'Evaluation' }
  & Pick<Evaluation, 'date' | 'title' | 'icon' | 'timeComplain' | 'timeSpent' | 'timeLeft' | 'timeEarned' | 'timePause' | 'totalHours'>
);

export type UserEvaluationFieldsFragment = (
  { __typename?: 'UserEvaluation' }
  & Pick<UserEvaluation, 'userName'>
  & { listOfEvaluation: Array<(
    { __typename?: 'Evaluation' }
    & EvaluationFieldsFragment
  )> }
);

export type HoursPerDayFieldsFragment = (
  { __typename?: 'HoursPerDay' }
  & Pick<HoursPerDay, 'day' | 'hours' | 'range' | 'hasError'>
);

export type ComplainFieldsFragment = (
  { __typename?: 'Complain' }
  & Pick<Complain, 'reason' | 'duration'>
);

export type LeaveDateFieldsFragment = (
  { __typename?: 'LeaveDate' }
  & Pick<LeaveDate, 'date' | 'type'>
);

export type LeaveFieldsFragment = (
  { __typename?: 'Leave' }
  & Pick<Leave, 'id' | 'type' | 'requestedLeaveDays'>
  & { start: (
    { __typename?: 'LeaveDate' }
    & LeaveDateFieldsFragment
  ), end: (
    { __typename?: 'LeaveDate' }
    & LeaveDateFieldsFragment
  ) }
);

export type UserFieldsFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'name' | 'role' | 'code' | 'startDate' | 'isGpsRequired'>
  & { holidays: Array<(
    { __typename?: 'Holiday' }
    & HolidayFieldsFragment
  )>, workTimes: (
    { __typename?: 'WorkTimes' }
    & WorkTimesFieldsFragment
  ), saldos: Array<(
    { __typename?: 'Saldo' }
    & SaldoFieldsFragment
  )> }
);

export type TimestampUserAndStatisticFieldsFragment = (
  { __typename?: 'TimestampUserAndStatistic' }
  & Pick<TimestampUserAndStatistic, 'timeLeft'>
  & { timestamp: (
    { __typename?: 'Timestamp' }
    & TimestampFieldsFragment
  ), user: (
    { __typename?: 'User' }
    & UserFieldsFragment
  ) }
);

export type UpdateAllUserWorkTimesByIdMutationVariables = {
  userId: Scalars['String'],
  workTimes: WorkTimesInput
};


export type UpdateAllUserWorkTimesByIdMutation = (
  { __typename?: 'Mutation' }
  & { updateAllUserWorkTimesById: (
    { __typename?: 'WorkTimes' }
    & WorkTimesFieldsFragment
  ) }
);

export type CreateUserMutationVariables = {
  user: UserInput
};


export type CreateUserMutation = (
  { __typename?: 'Mutation' }
  & { createUser: (
    { __typename?: 'User' }
    & UserFieldsFragment
  ) }
);

export type UpdateUserMutationVariables = {
  user: UserInput
};


export type UpdateUserMutation = (
  { __typename?: 'Mutation' }
  & { updateUser: (
    { __typename?: 'User' }
    & UserFieldsFragment
  ) }
);

export type DeleteUserMutationVariables = {
  userId: Scalars['String']
};


export type DeleteUserMutation = (
  { __typename?: 'Mutation' }
  & { deleteUser: Array<(
    { __typename?: 'User' }
    & UserFieldsFragment
  )> }
);

export type CreateLeaveMutationVariables = {
  userId: Scalars['String'],
  leave: LeaveInput
};


export type CreateLeaveMutation = (
  { __typename?: 'Mutation' }
  & { createLeave: Array<(
    { __typename?: 'Leave' }
    & LeaveFieldsFragment
  )> }
);

export type DeleteLeaveMutationVariables = {
  userId: Scalars['String'],
  leave: LeaveInput
};


export type DeleteLeaveMutation = (
  { __typename?: 'Mutation' }
  & { deleteLeave: Array<(
    { __typename?: 'Leave' }
    & LeaveFieldsFragment
  )> }
);

export type UpdateTimestampsMutationVariables = {
  userId: Scalars['String'],
  date: Scalars['String'],
  timestamps: Array<TimestampInput>
};


export type UpdateTimestampsMutation = (
  { __typename?: 'Mutation' }
  & { updateTimestamps: (
    { __typename?: 'ValidatedTimestamps' }
    & Pick<ValidatedTimestamps, 'error'>
    & { timestamps: Array<(
      { __typename?: 'Timestamp' }
      & TimestampFieldsFragment
    )> }
  ) }
);

export type RewriteTimestampsMutationVariables = {
  userId: Scalars['String'],
  date: Scalars['String']
};


export type RewriteTimestampsMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'rewriteTimestamps'>
);

export type AddTimestampByCodeMutationVariables = {
  code: Scalars['String'],
  gpsCoordinate?: Maybe<GpsCoordinateInput>
};


export type AddTimestampByCodeMutation = (
  { __typename?: 'Mutation' }
  & { addTimestampByCode: (
    { __typename?: 'TimestampUserAndStatistic' }
    & TimestampUserAndStatisticFieldsFragment
  ) }
);

export type UpdateComplainsMutationVariables = {
  userId: Scalars['String'],
  date: Scalars['String'],
  complains: Array<ComplainInput>
};


export type UpdateComplainsMutation = (
  { __typename?: 'Mutation' }
  & { updateComplains: Array<(
    { __typename?: 'Complain' }
    & ComplainFieldsFragment
  )> }
);

export type DeletePublicHolidayMutationVariables = {
  year: Scalars['String'],
  holidayId: Scalars['String']
};


export type DeletePublicHolidayMutation = (
  { __typename?: 'Mutation' }
  & { deletePublicHoliday: Array<(
    { __typename?: 'PublicHoliday' }
    & PublicHolidayFieldsFragment
  )> }
);

export type CreatePublicHolidayMutationVariables = {
  holiday: PublicHolidayInput
};


export type CreatePublicHolidayMutation = (
  { __typename?: 'Mutation' }
  & { createPublicHoliday: Array<(
    { __typename?: 'PublicHoliday' }
    & PublicHolidayFieldsFragment
  )> }
);

export type DeletePauseMutationVariables = {
  pauseId: Scalars['String']
};


export type DeletePauseMutation = (
  { __typename?: 'Mutation' }
  & { deletePause: Array<(
    { __typename?: 'Pause' }
    & PauseFieldsFragment
  )> }
);

export type CreatePauseMutationVariables = {
  pause: PauseInput
};


export type CreatePauseMutation = (
  { __typename?: 'Mutation' }
  & { createPause: Array<(
    { __typename?: 'Pause' }
    & PauseFieldsFragment
  )> }
);

export type UpdateWorkTimeSettingsMutationVariables = {
  settings: WorkTimeSettingsInput
};


export type UpdateWorkTimeSettingsMutation = (
  { __typename?: 'Mutation' }
  & { updateWorkTimeSettings: (
    { __typename?: 'WorkTimeSettings' }
    & WorkTimeSettingsFieldsFragment
  ) }
);

export type GetUsersQueryVariables = {};


export type GetUsersQuery = (
  { __typename?: 'Query' }
  & { getUsers: Array<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'name'>
  )> }
);

export type GetUserByIdQueryVariables = {
  userId: Scalars['String']
};


export type GetUserByIdQuery = (
  { __typename?: 'Query' }
  & { getUserById: (
    { __typename?: 'User' }
    & UserFieldsFragment
  ) }
);

export type LoginUserQueryVariables = {
  password: Scalars['String']
};


export type LoginUserQuery = (
  { __typename?: 'Query' }
  & { loginUser: (
    { __typename?: 'User' }
    & Pick<User, 'token'>
    & UserFieldsFragment
  ) }
);

export type VerifyLoginQueryVariables = {
  token: Scalars['String']
};


export type VerifyLoginQuery = (
  { __typename?: 'Query' }
  & { verifyLogin: (
    { __typename?: 'User' }
    & UserFieldsFragment
  ) }
);

export type GetLeaveDaysQueryVariables = {
  userId: Scalars['String'],
  year: Scalars['String']
};


export type GetLeaveDaysQuery = (
  { __typename?: 'Query' }
  & { getLeaveDays: Array<(
    { __typename?: 'Leave' }
    & LeaveFieldsFragment
  )> }
);

export type GetPublicHolidaysQueryVariables = {
  year: Scalars['String']
};


export type GetPublicHolidaysQuery = (
  { __typename?: 'Query' }
  & { getPublicHolidays: Array<(
    { __typename?: 'PublicHoliday' }
    & PublicHolidayFieldsFragment
  )> }
);

export type GetLeaveDaysAndPublicHolidaysQueryVariables = {
  userId: Scalars['String'],
  year: Scalars['String']
};


export type GetLeaveDaysAndPublicHolidaysQuery = (
  { __typename?: 'Query' }
  & { getLeaveDays: Array<(
    { __typename?: 'Leave' }
    & LeaveFieldsFragment
  )>, getPublicHolidays: Array<(
    { __typename?: 'PublicHoliday' }
    & PublicHolidayFieldsFragment
  )> }
);

export type LoadPublicHolidaysQueryVariables = {
  year: Scalars['String']
};


export type LoadPublicHolidaysQuery = (
  { __typename?: 'Query' }
  & { loadPublicHolidays: Array<(
    { __typename?: 'PublicHoliday' }
    & PublicHolidayFieldsFragment
  )> }
);

export type GetEvaluationForMonthQueryVariables = {
  userId: Scalars['String'],
  date: Scalars['String']
};


export type GetEvaluationForMonthQuery = (
  { __typename?: 'Query' }
  & { getEvaluationForMonth: Array<(
    { __typename?: 'Evaluation' }
    & EvaluationFieldsFragment
  )> }
);

export type GetEvaluationForUsersQueryVariables = {
  date: Scalars['String']
};


export type GetEvaluationForUsersQuery = (
  { __typename?: 'Query' }
  & { getEvaluationForUsers: Array<(
    { __typename?: 'UserEvaluation' }
    & UserEvaluationFieldsFragment
  )> }
);

export type GetStatisticForDateQueryVariables = {
  date: Scalars['String'],
  userId: Scalars['String']
};


export type GetStatisticForDateQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'getYearSaldo'>
  & { getStatisticForDate: (
    { __typename?: 'StatisticForDate' }
    & Pick<StatisticForDate, 'selectedDate'>
    & { statisticForDate: (
      { __typename?: 'Statistic' }
      & StatisticFieldsFragment
    ) }
  ) }
);

export type GetStatisticForWeekQueryVariables = {
  date: Scalars['String'],
  userId: Scalars['String']
};


export type GetStatisticForWeekQuery = (
  { __typename?: 'Query' }
  & { getStatisticForWeek: (
    { __typename?: 'StatisticForWeek' }
    & Pick<StatisticForWeek, 'selectedDate'>
    & { statisticForWeek: (
      { __typename?: 'Statistic' }
      & StatisticFieldsFragment
    ) }
  ) }
);

export type GetStatisticForMonthQueryVariables = {
  date: Scalars['String'],
  userId: Scalars['String']
};


export type GetStatisticForMonthQuery = (
  { __typename?: 'Query' }
  & { getStatisticForMonth: (
    { __typename?: 'StatisticForMonth' }
    & Pick<StatisticForMonth, 'selectedDate'>
    & { statisticForMonth: (
      { __typename?: 'Statistic' }
      & StatisticFieldsFragment
    ), hoursSpentForMonthPerDay: Array<(
      { __typename?: 'HoursPerDay' }
      & HoursPerDayFieldsFragment
    )> }
  ) }
);

export type GetYearSaldoQueryVariables = {
  date: Scalars['String'],
  userId: Scalars['String']
};


export type GetYearSaldoQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'getYearSaldo'>
);

export type GetComplainsQueryVariables = {
  userId: Scalars['String'],
  date: Scalars['String']
};


export type GetComplainsQuery = (
  { __typename?: 'Query' }
  & { getComplains: Array<(
    { __typename?: 'Complain' }
    & ComplainFieldsFragment
  )> }
);

export type GetTimestampsQueryVariables = {
  userId: Scalars['String'],
  date: Scalars['String']
};


export type GetTimestampsQuery = (
  { __typename?: 'Query' }
  & { getTimestamps: Array<(
    { __typename?: 'Timestamp' }
    & TimestampFieldsFragment
  )> }
);

export type GetComplainsAndTimestampsQueryVariables = {
  userId: Scalars['String'],
  date: Scalars['String']
};


export type GetComplainsAndTimestampsQuery = (
  { __typename?: 'Query' }
  & { getComplains: Array<(
    { __typename?: 'Complain' }
    & ComplainFieldsFragment
  )>, getTimestamps: Array<(
    { __typename?: 'Timestamp' }
    & TimestampFieldsFragment
  )> }
);

export type GetPausesQueryVariables = {};


export type GetPausesQuery = (
  { __typename?: 'Query' }
  & { getPauses: Array<(
    { __typename?: 'Pause' }
    & PauseFieldsFragment
  )> }
);

export type GetWorkTimeSettingsQueryVariables = {};


export type GetWorkTimeSettingsQuery = (
  { __typename?: 'Query' }
  & { getWorkTimeSettings: (
    { __typename?: 'WorkTimeSettings' }
    & WorkTimeSettingsFieldsFragment
  ) }
);
