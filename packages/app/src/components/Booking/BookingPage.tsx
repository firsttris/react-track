import { BarChartWidget } from 'components/Charts/BarChartWidget';
import { ApolloProps, withApollo } from 'components/hoc/WithApollo';
import { API_DATE } from 'cons';
import { GraphQLError } from 'graphql';
import { initialUserState } from 'initialState';
import * as moment from 'moment';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import * as t from 'types';
import { ComplainWidget } from './ComplainWidget/ComplainWidget';
import { DayPickerWidgetContainer } from './DayPickerWidget';
import { StatisticWidget } from './StatisticWidget';
import { TimestampWidget } from './TimestampWidget/TimestampWidget';

const initialStatisticState = {
  timeSpent: '',
  timeLeft: '',
  timeEarned: '',
  timePause: '',
  timeComplain: '',
  totalHours: ''
};

interface Props extends RouteComponentProps<{ userId: string; date: string }>, ApolloProps {
  loggedInUser: t.User;
}

interface States {
  selectedDate: moment.Moment;
  previousSelectedDate: string;
  showData: boolean;
  selectedUser: t.User;
  statisticForDate: t.Statistic;
  statisticForWeek: t.Statistic;
  statisticForMonth: t.Statistic;
  hoursSpentForMonthPerDay: t.HoursPerDay[];
  yearSaldo: string;
  timestamps: t.Timestamp[];
  timestampError?: string | null;
  complainsErrors: GraphQLError[];
  complains: t.Complain[];
  listOfLeaves: t.Leave[];
  publicHolidays: t.PublicHoliday[];
}

export class BookingPage extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedDate: moment(this.props.match.params.date),
      previousSelectedDate: '',
      showData: true,
      selectedUser: initialUserState,
      statisticForDate: initialStatisticState,
      statisticForMonth: initialStatisticState,
      statisticForWeek: initialStatisticState,
      hoursSpentForMonthPerDay: [],
      yearSaldo: '',
      timestamps: [],
      timestampError: '',
      complains: [],
      complainsErrors: [],
      listOfLeaves: [],
      publicHolidays: []
    };
  }

  disableDetailsOnLeaveDay(listOfLeave: t.Leave[], selectedDate: moment.Moment) {
    this.setState({ showData: true });
    for (const leave of listOfLeave) {
      const firstDate = moment(leave.start.date);
      const lastDate = moment(leave.end.date);
      const startDate = moment(leave.start.date);
      const endDate = moment(leave.end.date);
      while (startDate <= endDate) {
        if (startDate.format(API_DATE) === selectedDate.format(API_DATE)) {
          if (
            (firstDate.format(API_DATE) === selectedDate.format(API_DATE) &&
              leave.start.type === t.WorkDayType.HALF_DAY) ||
            (lastDate.format(API_DATE) === selectedDate.format(API_DATE) && leave.end.type === t.WorkDayType.HALF_DAY)
          ) {
            startDate.add(1, 'day');
            continue;
          }
          this.setState({ showData: false });
          break;
        }
        startDate.add(1, 'day');
      }
    }
  }

  componentDidMount(): void {
    const dateKey = this.state.selectedDate.format(API_DATE);
    const yearKey = this.state.selectedDate.format('YYYY');
    const userId = this.props.match.params.userId;
    this.getUserById(userId);
    this.getStatisticForDate(userId, dateKey);
    this.getStatisticForWeek(userId, dateKey);
    this.getStatisticForMonth(userId, dateKey);
    this.getComplainsAndTimestamps(userId, dateKey);
    this.getLeaveDaysAndPublicHoliday(userId, yearKey);
    this.disableDetailsOnLeaveDay(this.state.listOfLeaves, this.state.selectedDate);
  }

  getUserById(userId: string) {
    this.props.apollo.getUserById(userId).then(result => {
      if (result.data) {
        this.setState({ selectedUser: result.data.getUserById });
      }
    });
  }

  getStatisticForDate(userId: string, dateKey: string) {
    this.props.apollo.getStatisticForDate(userId, dateKey).then(result => {
      if (result.data) {
        this.setState({
          statisticForDate: result.data.getStatisticForDate.statisticForDate,
          previousSelectedDate: result.data.getStatisticForDate.selectedDate,
          yearSaldo: result.data.getYearSaldo
        });
      }
    });
  }

  getStatisticForWeek(userId: string, dateKey: string) {
    this.props.apollo.getStatisticForWeek(userId, dateKey).then(result => {
      if (result.data) {
        this.setState({
          statisticForWeek: result.data.getStatisticForWeek.statisticForWeek,
          previousSelectedDate: result.data.getStatisticForWeek.selectedDate
        });
      }
    });
  }

  getStatisticForMonth(userId: string, dateKey: string) {
    this.props.apollo.getStatisticForMonth(userId, dateKey).then(result => {
      if (result.data) {
        this.setState({
          statisticForMonth: result.data.getStatisticForMonth.statisticForMonth,
          hoursSpentForMonthPerDay: result.data.getStatisticForMonth.hoursSpentForMonthPerDay,
          previousSelectedDate: result.data.getStatisticForMonth.selectedDate
        });
      }
    });
  }

  getLeaveDaysAndPublicHoliday(userId: string, yearKey: string) {
    this.props.apollo.getLeaveDaysAndPublicHoliday(userId, yearKey).then(result => {
      if (result.data) {
        this.setState({ listOfLeaves: result.data.getLeaveDays, publicHolidays: result.data.getPublicHolidays });
      }
    });
  }

  getComplainsAndTimestamps(userId: string, dateKey: string) {
    this.props.apollo.getComplainsAndTimestamps(userId, dateKey).then(result => {
      if (result.data) {
        this.setState({ complains: result.data.getComplains, timestamps: result.data.getTimestamps });
      }
    });
  }

  updateTimestamps(userId: string, dateKey: string, timestamps: t.TimestampInput[]) {
    return this.props.apollo.updateTimestamps(userId, dateKey, timestamps).then(result => {
      if (result.data) {
        this.setState({
          timestamps: result.data.updateTimestamps.timestamps,
          timestampError: result.data.updateTimestamps.error
        });
      }
    });
  }

  updateComplains(userId: string, dateKey: string, complains: t.ComplainInput[]) {
    return this.props.apollo.updateComplains(userId, dateKey, complains).then(result => {
      if (result.data) {
        this.setState({ complains: result.data.updateComplains });
      }
    });
  }

  handleBarClick = (date: any): void => {
    this.resetTimestampsAndComplains();
    const selectedDate = moment(this.state.selectedDate);
    selectedDate.date(date.day);
    this.onCalendarSelect(selectedDate.toDate());
  };

  resetTimestampsAndComplains() {
    this.setState({
      timestamps: [],
      timestampError: '',
      complains: [],
      complainsErrors: []
    });
  }

  resetUser() {
    this.setState({
      selectedUser: initialUserState
    });
  }

  resetStatistic() {
    this.setState({
      statisticForDate: initialStatisticState,
      statisticForMonth: initialStatisticState,
      statisticForWeek: initialStatisticState,
      hoursSpentForMonthPerDay: []
    });
  }

  onCalendarSelect = (selectedDate: Date): void => {
    this.resetTimestampsAndComplains();
    this.disableDetailsOnLeaveDay(this.state.listOfLeaves, moment(selectedDate));
    const userId = this.props.match.params.userId;
    const date = moment(selectedDate);
    const dateString = date.format(API_DATE);
    this.setState({ selectedDate: date });
    if (userId) {
      this.getComplainsAndTimestamps(userId, dateString);
      this.refreshStatistics(userId, date, false);
    }
    this.props.history.push(`/bookings/${userId}/${dateString}`);
  };

  refreshStatistics = (userId: string, currentDate: moment.Moment, forceRefresh: boolean): void => {
    this.getStatisticForDate(userId, currentDate.format(API_DATE));
    this.monthChange(currentDate, userId, forceRefresh);
    this.weekChange(currentDate, userId, forceRefresh);
  };

  weekChange = (currentDate: moment.Moment, userId: string, forceRefresh: boolean): void => {
    const previousSelectedDate = moment(this.state.previousSelectedDate, API_DATE);
    if (previousSelectedDate.isoWeek() !== currentDate.isoWeek() || forceRefresh) {
      this.getStatisticForWeek(userId, currentDate.format(API_DATE));
    }
  };

  monthChange = (currentDate: moment.Moment, userId: string, forceRefresh: boolean): void => {
    const previousSelectedDate = moment(this.state.previousSelectedDate, API_DATE);
    if (previousSelectedDate.get('month') !== currentDate.get('month') || forceRefresh) {
      this.getStatisticForMonth(userId, currentDate.format(API_DATE));
      this.getLeaveDaysAndPublicHoliday(userId, currentDate.format('YYYY'));
    }
  };

  updateComplainsAndRefreshStatistics = (complains: t.Complain[]): void => {
    const userId = this.props.match.params.userId;
    const dateKey = this.state.selectedDate.format(API_DATE);
    this.updateComplains(userId, dateKey, complains).then(() => this.refreshStatistics(userId, moment(dateKey), true));
  };

  updateTimestampsAndRefreshStatistics = (timestamps: t.Timestamp[]): void => {
    const userId = this.props.match.params.userId;
    const dateKey = this.state.selectedDate.format(API_DATE);
    this.updateTimestamps(userId, dateKey, timestamps).then(() =>
      this.refreshStatistics(userId, moment(dateKey), true)
    );
  };

  handleBookingModalClose = () => {
    //
  };

  render(): JSX.Element {
    return (
      <Container fluid={true}>
        <Row>
          <Col lg={7} xs={12} className="pt-3">
            <StatisticWidget
              selectedUser={this.state.selectedUser}
              yearSaldo={this.state.yearSaldo}
              statisticForDate={this.state.statisticForDate}
              statisticForWeek={this.state.statisticForWeek}
              statisticForMonth={this.state.statisticForMonth}
            />
          </Col>
          <Col lg={5} xs={12} className="pt-3">
            <DayPickerWidgetContainer
              onDayClick={this.onCalendarSelect}
              selectedDate={this.state.selectedDate.toDate()}
              publicHolidays={this.state.publicHolidays}
              listOfLeaves={this.state.listOfLeaves}
              hoursSpentForMonthPerDay={this.state.hoursSpentForMonthPerDay}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={7} xs={12} className="pt-3 d-none d-sm-block">
            <BarChartWidget
              data={this.state.hoursSpentForMonthPerDay}
              xDataKey="day"
              yDataKey="range"
              labelKey="hours"
              name="Stunden"
              handleBarClick={this.handleBarClick}
            />
          </Col>
          <Col lg={5} xs={12} className="pt-3">
            <TimestampWidget
              selectedDate={this.state.selectedDate}
              timestamps={this.state.timestamps}
              timestampError={this.state.timestampError}
              onClose={this.handleBookingModalClose}
              onUpdateTimestamps={this.updateTimestampsAndRefreshStatistics}
              showData={this.state.showData}
              userRole={this.props.loggedInUser.role}
            />
            <ComplainWidget
              selectedDate={this.state.selectedDate}
              complains={this.state.complains}
              complainsErrors={this.state.complainsErrors}
              onUpdateComplains={this.updateComplainsAndRefreshStatistics}
              showData={this.state.showData}
              userRole={this.props.loggedInUser.role}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

export const BookingPageContainer = withApollo(BookingPage);
