import gql from 'graphql-tag';

export const WorkTimeFragment = gql`
  fragment WorkTimeFields on WorkTime {
    startTime
    endTime
    mandatoryHours
  }
`;

export const WorkTimesFragment = gql`
  fragment WorkTimesFields on WorkTimes {
    monday {
      ...WorkTimeFields
    }
    tuesday {
      ...WorkTimeFields
    }
    wednesday {
      ...WorkTimeFields
    }
    thursday {
      ...WorkTimeFields
    }
    friday {
      ...WorkTimeFields
    }
    saturday {
      ...WorkTimeFields
    }
    sunday {
      ...WorkTimeFields
    }
  }
  ${WorkTimeFragment}
`;

export const SaldoFragment = gql`
  fragment SaldoFields on Saldo {
    year
    comment
    hours
  }
`;

export const HolidayFragment = gql`
  fragment HolidayFields on Holiday {
    year
    comment
    days
  }
`;

export const PublicHolidayFragment = gql`
  fragment PublicHolidayFields on PublicHoliday {
    id
    title
    date
  }
`;

export const PauseFragment = gql`
  fragment PauseFields on Pause {
    id
    time
    durationInMinutes
  }
`;

export const WorkTimeSettingsFragment = gql`
  fragment WorkTimeSettingsFields on WorkTimeSettings {
    schoolday
    publicHoliday
    holiday
    sickday
  }
`;

export const TimestampFragment = gql`
  fragment TimestampFields on Timestamp {
    id
    time
    actualTime
    status
    type
  }
`;

export const StatisticFragment = gql`
  fragment StatisticFields on Statistic {
    timeComplain
    timeSpent
    timeLeft
    timeEarned
    timePause
    totalHours
  }
`;

export const EvaluationFragment = gql`
  fragment EvaluationFields on Evaluation {
    date
    title
    icon
    timeComplain
    timeSpent
    timeLeft
    timeEarned
    timePause
    totalHours
  }
`;

export const UserEvaluationFragment = gql`
  fragment UserEvaluationFields on UserEvaluation {
    userName
    listOfEvaluation {
      ...EvaluationFields
    }
  }
  ${EvaluationFragment}
`;

export const HoursPerDayFragment = gql`
  fragment HoursPerDayFields on HoursPerDay {
    day
    hours
    range
    hasError
  }
`;

export const ComplainFragment = gql`
  fragment ComplainFields on Complain {
    reason
    duration
  }
`;

export const LeaveDateFragment = gql`
  fragment LeaveDateFields on LeaveDate {
    date
    type
  }
`;

export const LeaveFragment = gql`
  fragment LeaveFields on Leave {
    id
    start {
      ...LeaveDateFields
    }
    end {
      ...LeaveDateFields
    }
    type
    requestedLeaveDays
  }
  ${LeaveDateFragment}
`;

export const UserFragment = gql`
  fragment UserFields on User {
    id
    name
    holidays {
      ...HolidayFields
    }
    role
    workTimes {
      ...WorkTimesFields
    }
    code
    startDate
    saldos {
      ...SaldoFields
    }
  }
  ${HolidayFragment}
  ${WorkTimesFragment}
  ${SaldoFragment}
`;

export const TimestampUserAndStatisticFragment = gql`
  fragment TimestampUserAndStatisticFields on TimestampUserAndStatistic {
    timestamp {
      ...TimestampFields
    }
    user {
      ...UserFields
    }
    timeLeft
  }
  ${TimestampFragment}
  ${UserFragment}
`;
