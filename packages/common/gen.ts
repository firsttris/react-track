/* tslint:disable */
import { GraphQLResolveInfo } from 'graphql';

type Resolver<Result, Args = any> = (
  parent: any,
  args: Args,
  context: any,
  info: GraphQLResolveInfo
) => Promise<Result> | Result;

/** The `Upload` scalar type represents a file upload promise that resolves an object containing `stream`, `filename`, `mimetype` and `encoding`. */
export type Upload = any;

export interface Query {
  getUsers: User[];
  getUserById: User;
  verifyLogin: User;
  loginUser: User;
  getWorkTimeSettings: WorkTimeSettings;
  getLeaveDays: Leave[];
  getPublicHolidays: PublicHoliday[];
  loadPublicHolidays: PublicHoliday[];
  getStatisticForDate: StatisticForDate;
  getStatisticForWeek: StatisticForWeek;
  getStatisticForMonth: StatisticForMonth;
  getYearSaldo: string;
  getComplains: Complain[];
  getTimestamps: Timestamp[];
  getPauses: Pause[];
  getEvaluationForMonth: Evaluation[];
  getEvaluationForUsers: UserEvaluation[];
}

export interface User {
  id: string;
  name: string;
  holidays: Holiday[];
  code: string;
  role: UserRole;
  token?: string | null;
  workTimes: WorkTimes;
  startDate: string;
  saldos: Saldo[];
}

export interface Holiday {
  year: string;
  comment?: string | null;
  days: number;
}

export interface WorkTimes {
  monday: WorkTime;
  tuesday: WorkTime;
  wednesday: WorkTime;
  thursday: WorkTime;
  friday: WorkTime;
  saturday: WorkTime;
  sunday: WorkTime;
}

export interface WorkTime {
  startTime: string;
  endTime: string;
  mandatoryHours: string;
}

export interface Saldo {
  year: string;
  comment?: string | null;
  hours: number;
}

export interface WorkTimeSettings {
  schoolday: WorkDayPaymentType;
  publicHoliday: WorkDayPaymentType;
  holiday: WorkDayPaymentType;
  sickday: WorkDayPaymentType;
}

export interface Leave {
  id: string;
  start: LeaveDate;
  end: LeaveDate;
  type: DayType;
  requestedLeaveDays: number;
}

export interface LeaveDate {
  date: string;
  type: WorkDayType;
}

export interface PublicHoliday {
  id: string;
  title: string;
  date: string;
  locs?: (string | null)[] | null;
}

export interface StatisticForDate {
  statisticForDate: Statistic;
  selectedDate: string;
}

export interface Statistic {
  timeComplain: string;
  timeSpent: string;
  timeLeft: string;
  timeEarned: string;
  timePause: string;
  totalHours: string;
}

export interface StatisticForWeek {
  statisticForWeek: Statistic;
  selectedDate: string;
}

export interface StatisticForMonth {
  statisticForMonth: Statistic;
  hoursSpentForMonthPerDay: HoursPerDay[];
  selectedDate: string;
}

export interface HoursPerDay {
  day: number;
  hours: string;
  range: number[];
  hasError: boolean;
}

export interface Complain {
  reason: string;
  duration: string;
}

export interface Timestamp {
  id: string;
  time: string;
  actualTime: string;
  status: string;
  type: string;
}

export interface Pause {
  id: string;
  time: string;
  durationInMinutes: string;
}

export interface Evaluation {
  timeComplain: string;
  timeSpent: string;
  timeLeft: string;
  timeEarned: string;
  timePause: string;
  totalHours: string;
  date: string;
  title: string;
  icon: string;
}

export interface UserEvaluation {
  userName: string;
  listOfEvaluation: Evaluation[];
}

export interface Mutation {
  createUser: User;
  updateUser: User;
  deleteUser: User[];
  updateWorkTimeSettings: WorkTimeSettings;
  updateAllUserWorkTimesById: WorkTimes;
  createLeave: Leave[];
  deleteLeave: Leave[];
  updateTimestamps: ValidatedTimestamps;
  updateComplains: Complain[];
  createPause: Pause[];
  deletePause: Pause[];
  createPublicHoliday: PublicHoliday[];
  deletePublicHoliday: PublicHoliday[];
  addTimestampByCode: TimestampUserAndStatistic;
  rewriteTimestamps?: boolean | null;
}

export interface ValidatedTimestamps {
  timestamps: Timestamp[];
  error?: string | null;
}

export interface TimestampUserAndStatistic {
  timestamp: Timestamp;
  user: User;
  timeLeft: string;
}

export interface UserInput {
  id?: string | null;
  name: string;
  holidays: HolidayInput[];
  code: string;
  role: UserRole;
  token?: string | null;
  startDate: string;
  workTimes: WorkTimesInput;
  saldos: SaldoInput[];
}

export interface HolidayInput {
  year: string;
  comment?: string | null;
  days: number;
}

export interface WorkTimesInput {
  monday: WorkTimeInput;
  tuesday: WorkTimeInput;
  wednesday: WorkTimeInput;
  thursday: WorkTimeInput;
  friday: WorkTimeInput;
  saturday: WorkTimeInput;
  sunday: WorkTimeInput;
}

export interface WorkTimeInput {
  startTime: string;
  endTime: string;
  mandatoryHours: string;
}

export interface SaldoInput {
  year: string;
  comment?: string | null;
  hours: number;
}

export interface WorkTimeSettingsInput {
  schoolday: WorkDayPaymentType;
  publicHoliday: WorkDayPaymentType;
  holiday: WorkDayPaymentType;
  sickday: WorkDayPaymentType;
}

export interface LeaveInput {
  id?: string | null;
  start: LeaveDateInput;
  end: LeaveDateInput;
  type: DayType;
  requestedLeaveDays?: number | null;
}

export interface LeaveDateInput {
  date: string;
  type: WorkDayType;
}

export interface TimestampInput {
  id: string;
  time: string;
  actualTime: string;
  status: string;
  type: string;
}

export interface ComplainInput {
  reason: string;
  duration: string;
}

export interface PauseInput {
  time: string;
  durationInMinutes: string;
}

export interface PublicHolidayInput {
  title: string;
  date: string;
}
export interface GetUsersQueryArgs {
  userId?: string | null;
  name?: string | null;
}
export interface GetUserByIdQueryArgs {
  userId: string;
}
export interface VerifyLoginQueryArgs {
  token: string;
}
export interface LoginUserQueryArgs {
  password: string;
}
export interface GetLeaveDaysQueryArgs {
  userId: string;
  year: string;
}
export interface GetPublicHolidaysQueryArgs {
  year: string;
}
export interface LoadPublicHolidaysQueryArgs {
  year: string;
}
export interface GetStatisticForDateQueryArgs {
  date: string;
  userId: string;
}
export interface GetStatisticForWeekQueryArgs {
  date: string;
  userId: string;
}
export interface GetStatisticForMonthQueryArgs {
  date: string;
  userId: string;
}
export interface GetYearSaldoQueryArgs {
  date: string;
  userId: string;
}
export interface GetComplainsQueryArgs {
  userId: string;
  date: string;
}
export interface GetTimestampsQueryArgs {
  userId: string;
  date: string;
}
export interface GetEvaluationForMonthQueryArgs {
  date: string;
  userId: string;
}
export interface GetEvaluationForUsersQueryArgs {
  date: string;
}
export interface CreateUserMutationArgs {
  user: UserInput;
}
export interface UpdateUserMutationArgs {
  user: UserInput;
}
export interface DeleteUserMutationArgs {
  userId: string;
}
export interface UpdateWorkTimeSettingsMutationArgs {
  settings: WorkTimeSettingsInput;
}
export interface UpdateAllUserWorkTimesByIdMutationArgs {
  userId: string;
  workTimes: WorkTimesInput;
}
export interface CreateLeaveMutationArgs {
  userId: string;
  leave: LeaveInput;
}
export interface DeleteLeaveMutationArgs {
  userId: string;
  leave: LeaveInput;
}
export interface UpdateTimestampsMutationArgs {
  userId: string;
  date: string;
  timestamps: TimestampInput[];
}
export interface UpdateComplainsMutationArgs {
  userId: string;
  date: string;
  complains: ComplainInput[];
}
export interface CreatePauseMutationArgs {
  pause: PauseInput;
}
export interface DeletePauseMutationArgs {
  pauseId: string;
}
export interface CreatePublicHolidayMutationArgs {
  holiday: PublicHolidayInput;
}
export interface DeletePublicHolidayMutationArgs {
  year: string;
  holidayId: string;
}
export interface AddTimestampByCodeMutationArgs {
  code: string;
}
export interface RewriteTimestampsMutationArgs {
  userId: string;
  date: string;
}

export enum UserRole {
  GUEST = 'GUEST',
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export enum WorkDayPaymentType {
  PAID = 'PAID',
  UNPAID = 'UNPAID'
}

export enum WorkDayType {
  FULL_DAY = 'FULL_DAY',
  HALF_DAY = 'HALF_DAY'
}

export enum DayType {
  WORKDAY = 'WORKDAY',
  WEEKEND = 'WEEKEND',
  PUBLIC_HOLIDAY = 'PUBLIC_HOLIDAY',
  HOLIDAY = 'HOLIDAY',
  SICKDAY = 'SICKDAY',
  SCHOOLDAY = 'SCHOOLDAY',
  AWAY = 'AWAY'
}

export namespace QueryResolvers {
  export interface Resolvers {
    getUsers?: GetUsersResolver;
    getUserById?: GetUserByIdResolver;
    verifyLogin?: VerifyLoginResolver;
    loginUser?: LoginUserResolver;
    getWorkTimeSettings?: GetWorkTimeSettingsResolver;
    getLeaveDays?: GetLeaveDaysResolver;
    getPublicHolidays?: GetPublicHolidaysResolver;
    loadPublicHolidays?: LoadPublicHolidaysResolver;
    getStatisticForDate?: GetStatisticForDateResolver;
    getStatisticForWeek?: GetStatisticForWeekResolver;
    getStatisticForMonth?: GetStatisticForMonthResolver;
    getYearSaldo?: GetYearSaldoResolver;
    getComplains?: GetComplainsResolver;
    getTimestamps?: GetTimestampsResolver;
    getPauses?: GetPausesResolver;
    getEvaluationForMonth?: GetEvaluationForMonthResolver;
    getEvaluationForUsers?: GetEvaluationForUsersResolver;
  }

  export type GetUsersResolver = Resolver<User[], GetUsersArgs>;
  export interface GetUsersArgs {
    userId?: string | null;
    name?: string | null;
  }

  export type GetUserByIdResolver = Resolver<User, GetUserByIdArgs>;
  export interface GetUserByIdArgs {
    userId: string;
  }

  export type VerifyLoginResolver = Resolver<User, VerifyLoginArgs>;
  export interface VerifyLoginArgs {
    token: string;
  }

  export type LoginUserResolver = Resolver<User, LoginUserArgs>;
  export interface LoginUserArgs {
    password: string;
  }

  export type GetWorkTimeSettingsResolver = Resolver<WorkTimeSettings>;
  export type GetLeaveDaysResolver = Resolver<Leave[], GetLeaveDaysArgs>;
  export interface GetLeaveDaysArgs {
    userId: string;
    year: string;
  }

  export type GetPublicHolidaysResolver = Resolver<PublicHoliday[], GetPublicHolidaysArgs>;
  export interface GetPublicHolidaysArgs {
    year: string;
  }

  export type LoadPublicHolidaysResolver = Resolver<PublicHoliday[], LoadPublicHolidaysArgs>;
  export interface LoadPublicHolidaysArgs {
    year: string;
  }

  export type GetStatisticForDateResolver = Resolver<StatisticForDate, GetStatisticForDateArgs>;
  export interface GetStatisticForDateArgs {
    date: string;
    userId: string;
  }

  export type GetStatisticForWeekResolver = Resolver<StatisticForWeek, GetStatisticForWeekArgs>;
  export interface GetStatisticForWeekArgs {
    date: string;
    userId: string;
  }

  export type GetStatisticForMonthResolver = Resolver<StatisticForMonth, GetStatisticForMonthArgs>;
  export interface GetStatisticForMonthArgs {
    date: string;
    userId: string;
  }

  export type GetYearSaldoResolver = Resolver<string, GetYearSaldoArgs>;
  export interface GetYearSaldoArgs {
    date: string;
    userId: string;
  }

  export type GetComplainsResolver = Resolver<Complain[], GetComplainsArgs>;
  export interface GetComplainsArgs {
    userId: string;
    date: string;
  }

  export type GetTimestampsResolver = Resolver<Timestamp[], GetTimestampsArgs>;
  export interface GetTimestampsArgs {
    userId: string;
    date: string;
  }

  export type GetPausesResolver = Resolver<Pause[]>;
  export type GetEvaluationForMonthResolver = Resolver<Evaluation[], GetEvaluationForMonthArgs>;
  export interface GetEvaluationForMonthArgs {
    date: string;
    userId: string;
  }

  export type GetEvaluationForUsersResolver = Resolver<UserEvaluation[], GetEvaluationForUsersArgs>;
  export interface GetEvaluationForUsersArgs {
    date: string;
  }
}
export namespace UserResolvers {
  export interface Resolvers {
    id?: IdResolver;
    name?: NameResolver;
    holidays?: HolidaysResolver;
    code?: CodeResolver;
    role?: RoleResolver;
    token?: TokenResolver;
    workTimes?: WorkTimesResolver;
    startDate?: StartDateResolver;
    saldos?: SaldosResolver;
  }

  export type IdResolver = Resolver<string>;
  export type NameResolver = Resolver<string>;
  export type HolidaysResolver = Resolver<Holiday[]>;
  export type CodeResolver = Resolver<string>;
  export type RoleResolver = Resolver<UserRole>;
  export type TokenResolver = Resolver<string | null>;
  export type WorkTimesResolver = Resolver<WorkTimes>;
  export type StartDateResolver = Resolver<string>;
  export type SaldosResolver = Resolver<Saldo[]>;
}
export namespace HolidayResolvers {
  export interface Resolvers {
    year?: YearResolver;
    comment?: CommentResolver;
    days?: DaysResolver;
  }

  export type YearResolver = Resolver<string>;
  export type CommentResolver = Resolver<string | null>;
  export type DaysResolver = Resolver<number>;
}
export namespace WorkTimesResolvers {
  export interface Resolvers {
    monday?: MondayResolver;
    tuesday?: TuesdayResolver;
    wednesday?: WednesdayResolver;
    thursday?: ThursdayResolver;
    friday?: FridayResolver;
    saturday?: SaturdayResolver;
    sunday?: SundayResolver;
  }

  export type MondayResolver = Resolver<WorkTime>;
  export type TuesdayResolver = Resolver<WorkTime>;
  export type WednesdayResolver = Resolver<WorkTime>;
  export type ThursdayResolver = Resolver<WorkTime>;
  export type FridayResolver = Resolver<WorkTime>;
  export type SaturdayResolver = Resolver<WorkTime>;
  export type SundayResolver = Resolver<WorkTime>;
}
export namespace WorkTimeResolvers {
  export interface Resolvers {
    startTime?: StartTimeResolver;
    endTime?: EndTimeResolver;
    mandatoryHours?: MandatoryHoursResolver;
  }

  export type StartTimeResolver = Resolver<string>;
  export type EndTimeResolver = Resolver<string>;
  export type MandatoryHoursResolver = Resolver<string>;
}
export namespace SaldoResolvers {
  export interface Resolvers {
    year?: YearResolver;
    comment?: CommentResolver;
    hours?: HoursResolver;
  }

  export type YearResolver = Resolver<string>;
  export type CommentResolver = Resolver<string | null>;
  export type HoursResolver = Resolver<number>;
}
export namespace WorkTimeSettingsResolvers {
  export interface Resolvers {
    schoolday?: SchooldayResolver;
    publicHoliday?: PublicHolidayResolver;
    holiday?: HolidayResolver;
    sickday?: SickdayResolver;
  }

  export type SchooldayResolver = Resolver<WorkDayPaymentType>;
  export type PublicHolidayResolver = Resolver<WorkDayPaymentType>;
  export type HolidayResolver = Resolver<WorkDayPaymentType>;
  export type SickdayResolver = Resolver<WorkDayPaymentType>;
}
export namespace LeaveResolvers {
  export interface Resolvers {
    id?: IdResolver;
    start?: StartResolver;
    end?: EndResolver;
    type?: TypeResolver;
    requestedLeaveDays?: RequestedLeaveDaysResolver;
  }

  export type IdResolver = Resolver<string>;
  export type StartResolver = Resolver<LeaveDate>;
  export type EndResolver = Resolver<LeaveDate>;
  export type TypeResolver = Resolver<DayType>;
  export type RequestedLeaveDaysResolver = Resolver<number>;
}
export namespace LeaveDateResolvers {
  export interface Resolvers {
    date?: DateResolver;
    type?: TypeResolver;
  }

  export type DateResolver = Resolver<string>;
  export type TypeResolver = Resolver<WorkDayType>;
}
export namespace PublicHolidayResolvers {
  export interface Resolvers {
    id?: IdResolver;
    title?: TitleResolver;
    date?: DateResolver;
    locs?: LocsResolver;
  }

  export type IdResolver = Resolver<string>;
  export type TitleResolver = Resolver<string>;
  export type DateResolver = Resolver<string>;
  export type LocsResolver = Resolver<(string | null)[] | null>;
}
export namespace StatisticForDateResolvers {
  export interface Resolvers {
    statisticForDate?: StatisticForDateResolver;
    selectedDate?: SelectedDateResolver;
  }

  export type StatisticForDateResolver = Resolver<Statistic>;
  export type SelectedDateResolver = Resolver<string>;
}
export namespace StatisticResolvers {
  export interface Resolvers {
    timeComplain?: TimeComplainResolver;
    timeSpent?: TimeSpentResolver;
    timeLeft?: TimeLeftResolver;
    timeEarned?: TimeEarnedResolver;
    timePause?: TimePauseResolver;
    totalHours?: TotalHoursResolver;
  }

  export type TimeComplainResolver = Resolver<string>;
  export type TimeSpentResolver = Resolver<string>;
  export type TimeLeftResolver = Resolver<string>;
  export type TimeEarnedResolver = Resolver<string>;
  export type TimePauseResolver = Resolver<string>;
  export type TotalHoursResolver = Resolver<string>;
}
export namespace StatisticForWeekResolvers {
  export interface Resolvers {
    statisticForWeek?: StatisticForWeekResolver;
    selectedDate?: SelectedDateResolver;
  }

  export type StatisticForWeekResolver = Resolver<Statistic>;
  export type SelectedDateResolver = Resolver<string>;
}
export namespace StatisticForMonthResolvers {
  export interface Resolvers {
    statisticForMonth?: StatisticForMonthResolver;
    hoursSpentForMonthPerDay?: HoursSpentForMonthPerDayResolver;
    selectedDate?: SelectedDateResolver;
  }

  export type StatisticForMonthResolver = Resolver<Statistic>;
  export type HoursSpentForMonthPerDayResolver = Resolver<HoursPerDay[]>;
  export type SelectedDateResolver = Resolver<string>;
}
export namespace HoursPerDayResolvers {
  export interface Resolvers {
    day?: DayResolver;
    hours?: HoursResolver;
    range?: RangeResolver;
    hasError?: HasErrorResolver;
  }

  export type DayResolver = Resolver<number>;
  export type HoursResolver = Resolver<string>;
  export type RangeResolver = Resolver<number[]>;
  export type HasErrorResolver = Resolver<boolean>;
}
export namespace ComplainResolvers {
  export interface Resolvers {
    reason?: ReasonResolver;
    duration?: DurationResolver;
  }

  export type ReasonResolver = Resolver<string>;
  export type DurationResolver = Resolver<string>;
}
export namespace TimestampResolvers {
  export interface Resolvers {
    id?: IdResolver;
    time?: TimeResolver;
    actualTime?: ActualTimeResolver;
    status?: StatusResolver;
    type?: TypeResolver;
  }

  export type IdResolver = Resolver<string>;
  export type TimeResolver = Resolver<string>;
  export type ActualTimeResolver = Resolver<string>;
  export type StatusResolver = Resolver<string>;
  export type TypeResolver = Resolver<string>;
}
export namespace PauseResolvers {
  export interface Resolvers {
    id?: IdResolver;
    time?: TimeResolver;
    durationInMinutes?: DurationInMinutesResolver;
  }

  export type IdResolver = Resolver<string>;
  export type TimeResolver = Resolver<string>;
  export type DurationInMinutesResolver = Resolver<string>;
}
export namespace EvaluationResolvers {
  export interface Resolvers {
    timeComplain?: TimeComplainResolver;
    timeSpent?: TimeSpentResolver;
    timeLeft?: TimeLeftResolver;
    timeEarned?: TimeEarnedResolver;
    timePause?: TimePauseResolver;
    totalHours?: TotalHoursResolver;
    date?: DateResolver;
    title?: TitleResolver;
    icon?: IconResolver;
  }

  export type TimeComplainResolver = Resolver<string>;
  export type TimeSpentResolver = Resolver<string>;
  export type TimeLeftResolver = Resolver<string>;
  export type TimeEarnedResolver = Resolver<string>;
  export type TimePauseResolver = Resolver<string>;
  export type TotalHoursResolver = Resolver<string>;
  export type DateResolver = Resolver<string>;
  export type TitleResolver = Resolver<string>;
  export type IconResolver = Resolver<string>;
}
export namespace UserEvaluationResolvers {
  export interface Resolvers {
    userName?: UserNameResolver;
    listOfEvaluation?: ListOfEvaluationResolver;
  }

  export type UserNameResolver = Resolver<string>;
  export type ListOfEvaluationResolver = Resolver<Evaluation[]>;
}
export namespace MutationResolvers {
  export interface Resolvers {
    createUser?: CreateUserResolver;
    updateUser?: UpdateUserResolver;
    deleteUser?: DeleteUserResolver;
    updateWorkTimeSettings?: UpdateWorkTimeSettingsResolver;
    updateAllUserWorkTimesById?: UpdateAllUserWorkTimesByIdResolver;
    createLeave?: CreateLeaveResolver;
    deleteLeave?: DeleteLeaveResolver;
    updateTimestamps?: UpdateTimestampsResolver;
    updateComplains?: UpdateComplainsResolver;
    createPause?: CreatePauseResolver;
    deletePause?: DeletePauseResolver;
    createPublicHoliday?: CreatePublicHolidayResolver;
    deletePublicHoliday?: DeletePublicHolidayResolver;
    addTimestampByCode?: AddTimestampByCodeResolver;
    rewriteTimestamps?: RewriteTimestampsResolver;
  }

  export type CreateUserResolver = Resolver<User, CreateUserArgs>;
  export interface CreateUserArgs {
    user: UserInput;
  }

  export type UpdateUserResolver = Resolver<User, UpdateUserArgs>;
  export interface UpdateUserArgs {
    user: UserInput;
  }

  export type DeleteUserResolver = Resolver<User[], DeleteUserArgs>;
  export interface DeleteUserArgs {
    userId: string;
  }

  export type UpdateWorkTimeSettingsResolver = Resolver<WorkTimeSettings, UpdateWorkTimeSettingsArgs>;
  export interface UpdateWorkTimeSettingsArgs {
    settings: WorkTimeSettingsInput;
  }

  export type UpdateAllUserWorkTimesByIdResolver = Resolver<WorkTimes, UpdateAllUserWorkTimesByIdArgs>;
  export interface UpdateAllUserWorkTimesByIdArgs {
    userId: string;
    workTimes: WorkTimesInput;
  }

  export type CreateLeaveResolver = Resolver<Leave[], CreateLeaveArgs>;
  export interface CreateLeaveArgs {
    userId: string;
    leave: LeaveInput;
  }

  export type DeleteLeaveResolver = Resolver<Leave[], DeleteLeaveArgs>;
  export interface DeleteLeaveArgs {
    userId: string;
    leave: LeaveInput;
  }

  export type UpdateTimestampsResolver = Resolver<ValidatedTimestamps, UpdateTimestampsArgs>;
  export interface UpdateTimestampsArgs {
    userId: string;
    date: string;
    timestamps: TimestampInput[];
  }

  export type UpdateComplainsResolver = Resolver<Complain[], UpdateComplainsArgs>;
  export interface UpdateComplainsArgs {
    userId: string;
    date: string;
    complains: ComplainInput[];
  }

  export type CreatePauseResolver = Resolver<Pause[], CreatePauseArgs>;
  export interface CreatePauseArgs {
    pause: PauseInput;
  }

  export type DeletePauseResolver = Resolver<Pause[], DeletePauseArgs>;
  export interface DeletePauseArgs {
    pauseId: string;
  }

  export type CreatePublicHolidayResolver = Resolver<PublicHoliday[], CreatePublicHolidayArgs>;
  export interface CreatePublicHolidayArgs {
    holiday: PublicHolidayInput;
  }

  export type DeletePublicHolidayResolver = Resolver<PublicHoliday[], DeletePublicHolidayArgs>;
  export interface DeletePublicHolidayArgs {
    year: string;
    holidayId: string;
  }

  export type AddTimestampByCodeResolver = Resolver<TimestampUserAndStatistic, AddTimestampByCodeArgs>;
  export interface AddTimestampByCodeArgs {
    code: string;
  }

  export type RewriteTimestampsResolver = Resolver<boolean | null, RewriteTimestampsArgs>;
  export interface RewriteTimestampsArgs {
    userId: string;
    date: string;
  }
}
export namespace ValidatedTimestampsResolvers {
  export interface Resolvers {
    timestamps?: TimestampsResolver;
    error?: ErrorResolver;
  }

  export type TimestampsResolver = Resolver<Timestamp[]>;
  export type ErrorResolver = Resolver<string | null>;
}
export namespace TimestampUserAndStatisticResolvers {
  export interface Resolvers {
    timestamp?: TimestampResolver;
    user?: UserResolver;
    timeLeft?: TimeLeftResolver;
  }

  export type TimestampResolver = Resolver<Timestamp>;
  export type UserResolver = Resolver<User>;
  export type TimeLeftResolver = Resolver<string>;
}
export namespace UpdateAllUserWorkTimesById {
  export type Variables = {
    userId: string;
    workTimes: WorkTimesInput;
  };

  export type Mutation = {
    __typename?: 'Mutation';
    updateAllUserWorkTimesById: UpdateAllUserWorkTimesById;
  };

  export type UpdateAllUserWorkTimesById = WorkTimesFields.Fragment;
}
export namespace CreateUser {
  export type Variables = {
    user: UserInput;
  };

  export type Mutation = {
    __typename?: 'Mutation';
    createUser: CreateUser;
  };

  export type CreateUser = UserFields.Fragment;
}
export namespace UpdateUser {
  export type Variables = {
    user: UserInput;
  };

  export type Mutation = {
    __typename?: 'Mutation';
    updateUser: UpdateUser;
  };

  export type UpdateUser = UserFields.Fragment;
}
export namespace DeleteUser {
  export type Variables = {
    userId: string;
  };

  export type Mutation = {
    __typename?: 'Mutation';
    deleteUser: DeleteUser[];
  };

  export type DeleteUser = UserFields.Fragment;
}
export namespace CreateLeave {
  export type Variables = {
    userId: string;
    leave: LeaveInput;
  };

  export type Mutation = {
    __typename?: 'Mutation';
    createLeave: CreateLeave[];
  };

  export type CreateLeave = LeaveFields.Fragment;
}
export namespace DeleteLeave {
  export type Variables = {
    userId: string;
    leave: LeaveInput;
  };

  export type Mutation = {
    __typename?: 'Mutation';
    deleteLeave: DeleteLeave[];
  };

  export type DeleteLeave = LeaveFields.Fragment;
}
export namespace UpdateTimestamps {
  export type Variables = {
    userId: string;
    date: string;
    timestamps: TimestampInput[];
  };

  export type Mutation = {
    __typename?: 'Mutation';
    updateTimestamps: UpdateTimestamps;
  };

  export type UpdateTimestamps = {
    __typename?: 'ValidatedTimestamps';
    timestamps: Timestamps[];
    error?: string | null;
  };

  export type Timestamps = TimestampFields.Fragment;
}
export namespace RewriteTimestamps {
  export type Variables = {
    userId: string;
    date: string;
  };

  export type Mutation = {
    __typename?: 'Mutation';
    rewriteTimestamps?: boolean | null;
  };
}
export namespace AddTimestampByCode {
  export type Variables = {
    code: string;
  };

  export type Mutation = {
    __typename?: 'Mutation';
    addTimestampByCode: AddTimestampByCode;
  };

  export type AddTimestampByCode = TimestampUserAndStatisticFields.Fragment;
}
export namespace UpdateComplains {
  export type Variables = {
    userId: string;
    date: string;
    complains: ComplainInput[];
  };

  export type Mutation = {
    __typename?: 'Mutation';
    updateComplains: UpdateComplains[];
  };

  export type UpdateComplains = ComplainFields.Fragment;
}
export namespace DeletePublicHoliday {
  export type Variables = {
    year: string;
    holidayId: string;
  };

  export type Mutation = {
    __typename?: 'Mutation';
    deletePublicHoliday: DeletePublicHoliday[];
  };

  export type DeletePublicHoliday = PublicHolidayFields.Fragment;
}
export namespace CreatePublicHoliday {
  export type Variables = {
    holiday: PublicHolidayInput;
  };

  export type Mutation = {
    __typename?: 'Mutation';
    createPublicHoliday: CreatePublicHoliday[];
  };

  export type CreatePublicHoliday = PublicHolidayFields.Fragment;
}
export namespace DeletePause {
  export type Variables = {
    pauseId: string;
  };

  export type Mutation = {
    __typename?: 'Mutation';
    deletePause: DeletePause[];
  };

  export type DeletePause = PauseFields.Fragment;
}
export namespace CreatePause {
  export type Variables = {
    pause: PauseInput;
  };

  export type Mutation = {
    __typename?: 'Mutation';
    createPause: CreatePause[];
  };

  export type CreatePause = PauseFields.Fragment;
}
export namespace UpdateWorkTimeSettings {
  export type Variables = {
    settings: WorkTimeSettingsInput;
  };

  export type Mutation = {
    __typename?: 'Mutation';
    updateWorkTimeSettings: UpdateWorkTimeSettings;
  };

  export type UpdateWorkTimeSettings = WorkTimeSettingsFields.Fragment;
}
export namespace GetUsers {
  export type Variables = {};

  export type Query = {
    __typename?: 'Query';
    getUsers: GetUsers[];
  };

  export type GetUsers = {
    __typename?: 'User';
    id: string;
    name: string;
  };
}
export namespace GetUserById {
  export type Variables = {
    userId: string;
  };

  export type Query = {
    __typename?: 'Query';
    getUserById: GetUserById;
  };

  export type GetUserById = UserFields.Fragment;
}
export namespace LoginUser {
  export type Variables = {
    password: string;
  };

  export type Query = {
    __typename?: 'Query';
    loginUser: LoginUser;
  };

  export type LoginUser = {
    __typename?: 'User';
    token?: string | null;
  } & UserFields.Fragment;
}
export namespace VerifyLogin {
  export type Variables = {
    token: string;
  };

  export type Query = {
    __typename?: 'Query';
    verifyLogin: VerifyLogin;
  };

  export type VerifyLogin = UserFields.Fragment;
}
export namespace GetLeaveDays {
  export type Variables = {
    userId: string;
    year: string;
  };

  export type Query = {
    __typename?: 'Query';
    getLeaveDays: GetLeaveDays[];
  };

  export type GetLeaveDays = LeaveFields.Fragment;
}
export namespace GetPublicHolidays {
  export type Variables = {
    year: string;
  };

  export type Query = {
    __typename?: 'Query';
    getPublicHolidays: GetPublicHolidays[];
  };

  export type GetPublicHolidays = PublicHolidayFields.Fragment;
}
export namespace GetLeaveDaysAndPublicHolidays {
  export type Variables = {
    userId: string;
    year: string;
  };

  export type Query = {
    __typename?: 'Query';
    getLeaveDays: GetLeaveDays[];
    getPublicHolidays: GetPublicHolidays[];
  };

  export type GetLeaveDays = LeaveFields.Fragment;

  export type GetPublicHolidays = PublicHolidayFields.Fragment;
}
export namespace LoadPublicHolidays {
  export type Variables = {
    year: string;
  };

  export type Query = {
    __typename?: 'Query';
    loadPublicHolidays: LoadPublicHolidays[];
  };

  export type LoadPublicHolidays = PublicHolidayFields.Fragment;
}
export namespace GetEvaluationForMonth {
  export type Variables = {
    userId: string;
    date: string;
  };

  export type Query = {
    __typename?: 'Query';
    getEvaluationForMonth: GetEvaluationForMonth[];
  };

  export type GetEvaluationForMonth = EvaluationFields.Fragment;
}
export namespace GetEvaluationForUsers {
  export type Variables = {
    date: string;
  };

  export type Query = {
    __typename?: 'Query';
    getEvaluationForUsers: GetEvaluationForUsers[];
  };

  export type GetEvaluationForUsers = UserEvaluationFields.Fragment;
}
export namespace GetStatisticForDate {
  export type Variables = {
    date: string;
    userId: string;
  };

  export type Query = {
    __typename?: 'Query';
    getStatisticForDate: GetStatisticForDate;
    getYearSaldo: string;
  };

  export type GetStatisticForDate = {
    __typename?: 'StatisticForDate';
    statisticForDate: StatisticForDate;
    selectedDate: string;
  };

  export type StatisticForDate = StatisticFields.Fragment;
}
export namespace GetStatisticForWeek {
  export type Variables = {
    date: string;
    userId: string;
  };

  export type Query = {
    __typename?: 'Query';
    getStatisticForWeek: GetStatisticForWeek;
  };

  export type GetStatisticForWeek = {
    __typename?: 'StatisticForWeek';
    statisticForWeek: StatisticForWeek;
    selectedDate: string;
  };

  export type StatisticForWeek = StatisticFields.Fragment;
}
export namespace GetStatisticForMonth {
  export type Variables = {
    date: string;
    userId: string;
  };

  export type Query = {
    __typename?: 'Query';
    getStatisticForMonth: GetStatisticForMonth;
  };

  export type GetStatisticForMonth = {
    __typename?: 'StatisticForMonth';
    statisticForMonth: StatisticForMonth;
    hoursSpentForMonthPerDay: HoursSpentForMonthPerDay[];
    selectedDate: string;
  };

  export type StatisticForMonth = StatisticFields.Fragment;

  export type HoursSpentForMonthPerDay = HoursPerDayFields.Fragment;
}
export namespace GetYearSaldo {
  export type Variables = {
    date: string;
    userId: string;
  };

  export type Query = {
    __typename?: 'Query';
    getYearSaldo: string;
  };
}
export namespace GetComplains {
  export type Variables = {
    userId: string;
    date: string;
  };

  export type Query = {
    __typename?: 'Query';
    getComplains: GetComplains[];
  };

  export type GetComplains = ComplainFields.Fragment;
}
export namespace GetTimestamps {
  export type Variables = {
    userId: string;
    date: string;
  };

  export type Query = {
    __typename?: 'Query';
    getTimestamps: GetTimestamps[];
  };

  export type GetTimestamps = TimestampFields.Fragment;
}
export namespace GetComplainsAndTimestamps {
  export type Variables = {
    userId: string;
    date: string;
  };

  export type Query = {
    __typename?: 'Query';
    getComplains: GetComplains[];
    getTimestamps: GetTimestamps[];
  };

  export type GetComplains = ComplainFields.Fragment;

  export type GetTimestamps = TimestampFields.Fragment;
}
export namespace GetPauses {
  export type Variables = {};

  export type Query = {
    __typename?: 'Query';
    getPauses: GetPauses[];
  };

  export type GetPauses = PauseFields.Fragment;
}
export namespace GetWorkTimeSettings {
  export type Variables = {};

  export type Query = {
    __typename?: 'Query';
    getWorkTimeSettings: GetWorkTimeSettings;
  };

  export type GetWorkTimeSettings = WorkTimeSettingsFields.Fragment;
}

export namespace WorkTimeFields {
  export type Fragment = {
    __typename?: 'WorkTime';
    startTime: string;
    endTime: string;
    mandatoryHours: string;
  };
}

export namespace WorkTimesFields {
  export type Fragment = {
    __typename?: 'WorkTimes';
    monday: Monday;
    tuesday: Tuesday;
    wednesday: Wednesday;
    thursday: Thursday;
    friday: Friday;
    saturday: Saturday;
    sunday: Sunday;
  };

  export type Monday = WorkTimeFields.Fragment;

  export type Tuesday = WorkTimeFields.Fragment;

  export type Wednesday = WorkTimeFields.Fragment;

  export type Thursday = WorkTimeFields.Fragment;

  export type Friday = WorkTimeFields.Fragment;

  export type Saturday = WorkTimeFields.Fragment;

  export type Sunday = WorkTimeFields.Fragment;
}

export namespace SaldoFields {
  export type Fragment = {
    __typename?: 'Saldo';
    year: string;
    comment?: string | null;
    hours: number;
  };
}

export namespace HolidayFields {
  export type Fragment = {
    __typename?: 'Holiday';
    year: string;
    comment?: string | null;
    days: number;
  };
}

export namespace PublicHolidayFields {
  export type Fragment = {
    __typename?: 'PublicHoliday';
    id: string;
    title: string;
    date: string;
  };
}

export namespace PauseFields {
  export type Fragment = {
    __typename?: 'Pause';
    id: string;
    time: string;
    durationInMinutes: string;
  };
}

export namespace WorkTimeSettingsFields {
  export type Fragment = {
    __typename?: 'WorkTimeSettings';
    schoolday: WorkDayPaymentType;
    publicHoliday: WorkDayPaymentType;
    holiday: WorkDayPaymentType;
    sickday: WorkDayPaymentType;
  };
}

export namespace TimestampFields {
  export type Fragment = {
    __typename?: 'Timestamp';
    id: string;
    time: string;
    actualTime: string;
    status: string;
    type: string;
  };
}

export namespace StatisticFields {
  export type Fragment = {
    __typename?: 'Statistic';
    timeComplain: string;
    timeSpent: string;
    timeLeft: string;
    timeEarned: string;
    timePause: string;
    totalHours: string;
  };
}

export namespace EvaluationFields {
  export type Fragment = {
    __typename?: 'Evaluation';
    date: string;
    title: string;
    icon: string;
    timeComplain: string;
    timeSpent: string;
    timeLeft: string;
    timeEarned: string;
    timePause: string;
    totalHours: string;
  };
}

export namespace UserEvaluationFields {
  export type Fragment = {
    __typename?: 'UserEvaluation';
    userName: string;
    listOfEvaluation: ListOfEvaluation[];
  };

  export type ListOfEvaluation = EvaluationFields.Fragment;
}

export namespace HoursPerDayFields {
  export type Fragment = {
    __typename?: 'HoursPerDay';
    day: number;
    hours: string;
    range: number[];
    hasError: boolean;
  };
}

export namespace ComplainFields {
  export type Fragment = {
    __typename?: 'Complain';
    reason: string;
    duration: string;
  };
}

export namespace LeaveDateFields {
  export type Fragment = {
    __typename?: 'LeaveDate';
    date: string;
    type: WorkDayType;
  };
}

export namespace LeaveFields {
  export type Fragment = {
    __typename?: 'Leave';
    id: string;
    start: Start;
    end: End;
    type: DayType;
    requestedLeaveDays: number;
  };

  export type Start = LeaveDateFields.Fragment;

  export type End = LeaveDateFields.Fragment;
}

export namespace UserFields {
  export type Fragment = {
    __typename?: 'User';
    id: string;
    name: string;
    holidays: Holidays[];
    role: UserRole;
    workTimes: WorkTimes;
    code: string;
    startDate: string;
    saldos: Saldos[];
  };

  export type Holidays = HolidayFields.Fragment;

  export type WorkTimes = WorkTimesFields.Fragment;

  export type Saldos = SaldoFields.Fragment;
}

export namespace TimestampUserAndStatisticFields {
  export type Fragment = {
    __typename?: 'TimestampUserAndStatistic';
    timestamp: Timestamp;
    user: User;
    timeLeft: string;
  };

  export type Timestamp = TimestampFields.Fragment;

  export type User = UserFields.Fragment;
}
