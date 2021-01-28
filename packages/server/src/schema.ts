import { gql } from 'apollo-server-express';
// The GraphQL schema in string form
export const typeDefs = gql`
  type Query {
    getUsers(userId: String, name: String): [User!]!
    getUserById(userId: String!): User!
    verifyLogin(token: String!): User!
    loginUser(password: String!): User!
    getWorkTimeSettings: WorkTimeSettings!
    getLeaveDays(userId: String!, year: String!): [Leave!]!
    getPublicHolidays(year: String!): [PublicHoliday!]!
    loadPublicHolidays(year: String!): [PublicHoliday!]!
    getStatisticForDate(date: String!, userId: String!): StatisticForDate!
    getStatisticForWeek(date: String!, userId: String!): StatisticForWeek!
    getStatisticForMonth(date: String!, userId: String!): StatisticForMonth!
    getYearSaldo(date: String!, userId: String!): String!
    getComplains(userId: String!, date: String!): [Complain!]!
    getTimestamps(userId: String!, date: String!): [Timestamp!]!
    getPauses: [Pause!]!
    getEvaluationForMonth(date: String!, userId: String!): [Evaluation!]!
    getEvaluationForUsers(date: String!): [UserEvaluation!]!
  }

  type Mutation {
    createUser(user: UserInput!): User!
    updateUser(user: UserInput!): User!
    deleteUser(userId: String!): [User!]!
    updateWorkTimeSettings(settings: WorkTimeSettingsInput!): WorkTimeSettings!
    updateAllUserWorkTimesById(userId: String!, workTimes: WorkTimesInput!): WorkTimes!
    createLeave(userId: String!, leave: LeaveInput!): [Leave!]!
    deleteLeave(userId: String!, leave: LeaveInput!): [Leave!]!
    updateTimestamps(userId: String!, date: String!, timestamps: [TimestampInput!]!): ValidatedTimestamps!
    updateComplains(userId: String!, date: String!, complains: [ComplainInput!]!): [Complain!]!
    createPause(pause: PauseInput!): [Pause!]!
    deletePause(pauseId: String!): [Pause!]!
    createPublicHoliday(holiday: PublicHolidayInput!): [PublicHoliday!]!
    deletePublicHoliday(year: String!, holidayId: String!): [PublicHoliday!]!
    addTimestampByCode(code: String!, gpsCoordinate: GpsCoordinateInput): TimestampUserAndStatistic!
    rewriteTimestamps(userId: String!, date: String!): Boolean
  }

  input PublicHolidayInput {
    title: String!
    date: String!
  }

  input ComplainInput {
    reason: String!
    duration: String!
  }

  input TimestampInput {
    id: String!
    time: String!
    actualTime: String!
    status: String!
    type: String!
  }

  input LeaveDateInput {
    date: String!
    type: WorkDayType!
  }

  input LeaveInput {
    id: String
    start: LeaveDateInput!
    end: LeaveDateInput!
    type: DayType!
    requestedLeaveDays: Float
  }

  input SaldoInput {
    year: String!
    comment: String
    hours: Float!
  }

  input HolidayInput {
    year: String!
    comment: String
    days: Float!
  }

  input UserInput {
    id: String
    name: String!
    holidays: [HolidayInput!]!
    code: String!
    role: UserRole!
    token: String
    startDate: String!
    workTimes: WorkTimesInput!
    saldos: [SaldoInput!]!
    isGpsRequired: Boolean
  }

  input WorkTimesInput {
    monday: WorkTimeInput!
    tuesday: WorkTimeInput!
    wednesday: WorkTimeInput!
    thursday: WorkTimeInput!
    friday: WorkTimeInput!
    saturday: WorkTimeInput!
    sunday: WorkTimeInput!
  }

  input WorkTimeInput {
    startTime: String!
    endTime: String!
    mandatoryHours: String!
  }

  input WorkTimeSettingsInput {
    schoolday: WorkDayPaymentType!
    publicHoliday: WorkDayPaymentType!
    holiday: WorkDayPaymentType!
    sickday: WorkDayPaymentType!
    shortTimeWork: WorkDayPaymentType!
  }

  input PauseInput {
    time: String!
    durationInMinutes: String!
  }

  input GpsCoordinateInput {
    latitude: Float!
    longitude: Float!
  }

  type Pause {
    id: String!
    time: String!
    durationInMinutes: String!
  }

  type User {
    id: String!
    name: String!
    holidays: [Holiday!]!
    code: String!
    role: UserRole!
    token: String
    workTimes: WorkTimes!
    startDate: String!
    saldos: [Saldo!]!
    isGpsRequired: Boolean
  }

  type Saldo {
    year: String!
    comment: String
    hours: Float!
  }

  type Holiday {
    year: String!
    comment: String
    days: Float!
  }

  type LeaveDate {
    date: String!
    type: WorkDayType!
  }

  type Leave {
    id: String!
    start: LeaveDate!
    end: LeaveDate!
    type: DayType!
    requestedLeaveDays: Float!
  }

  type PublicHoliday {
    id: String!
    title: String!
    date: String!
    locs: [String]
  }

  type HoursPerDay {
    day: Float!
    hours: String!
    range: [Float!]!
    hasError: Boolean!
  }

  type StatisticForDate {
    statisticForDate: Statistic!
    selectedDate: String!
  }

  type StatisticForMonth {
    statisticForMonth: Statistic!
    hoursSpentForMonthPerDay: [HoursPerDay!]!
    selectedDate: String!
  }

  type StatisticForWeek {
    statisticForWeek: Statistic!
    selectedDate: String!
  }

  type Statistic {
    timeComplain: String!
    timeSpent: String!
    timeLeft: String!
    timeEarned: String!
    timePause: String!
    totalHours: String!
  }

  type UserEvaluation {
    userName: String!
    listOfEvaluation: [Evaluation!]!
  }

  type Evaluation {
    timeComplain: String!
    timeSpent: String!
    timeLeft: String!
    timeEarned: String!
    timePause: String!
    totalHours: String!
    date: String!
    title: String!
    icon: String!
  }

  type WorkTime {
    startTime: String!
    endTime: String!
    mandatoryHours: String!
  }

  type WorkTimes {
    monday: WorkTime!
    tuesday: WorkTime!
    wednesday: WorkTime!
    thursday: WorkTime!
    friday: WorkTime!
    saturday: WorkTime!
    sunday: WorkTime!
  }

  type WorkTimeSettings {
    schoolday: WorkDayPaymentType!
    publicHoliday: WorkDayPaymentType!
    holiday: WorkDayPaymentType!
    sickday: WorkDayPaymentType!
    shortTimeWork: WorkDayPaymentType!
  }

  type Complain {
    reason: String!
    duration: String!
  }

  type GpsCoordinate {
    latitude: Float!
    longitude: Float!
  }

  type Timestamp {
    id: String!
    time: String!
    actualTime: String!
    status: String!
    type: String!
    gpsCoordinate: GpsCoordinate
  }

  type TimestampUserAndStatistic {
    timestamp: Timestamp!
    user: User!
    timeLeft: String!
  }

  type ValidatedTimestamps {
    timestamps: [Timestamp!]!
    error: String
  }

  enum WorkDayPaymentType {
    PAID
    UNPAID
  }

  enum UserRole {
    GUEST
    ADMIN
    USER
  }

  enum WorkDayType {
    FULL_DAY
    HALF_DAY
  }

  enum DayType {
    WORKDAY
    WEEKEND
    PUBLIC_HOLIDAY
    HOLIDAY
    SICKDAY
    SCHOOLDAY
    AWAY
    SHORT_TIME_WORK
  }
`;
