import { BarChartWidget } from 'components/Charts/BarChartWidget';
import { ApolloProps, withApollo } from 'components/hoc/WithApollo';
import { API_DATE } from 'common/constants';
import { GraphQLError } from 'graphql';
import { initialUserState } from 'common/initialState';
import * as moment from 'moment';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import * as t from 'common/types';
import { ComplainWidget } from './ComplainWidget/ComplainWidget';
import { DayPickerWidgetContainer } from './DayPickerWidget';
import { TimestampWidget } from './TimestampWidget/TimestampWidget';

interface Props extends RouteComponentProps<{ userId: string; date: string }>, ApolloProps {
  loggedInUser: t.User;
}

interface States {
  selectedDate: moment.Moment;
  previousSelectedDate: string;
  showData: boolean;
  selectedUser: t.User;
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
      hoursSpentForMonthPerDay: [],
      yearSaldo: '00:00',
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
    this.getStatisticForDate(userId);
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

  getStatisticForDate(userId: string) {
    const now = moment();
    let dateKey = now.format(API_DATE);
    if (this.state.selectedDate.get('year') !== now.get('year')) {
      dateKey = moment(this.state.selectedDate)
        .endOf('year')
        .format(API_DATE);
    }
    this.props.apollo.getStatisticForDate(userId, dateKey).then(result => {
      if (result.data) {
        this.setState({ yearSaldo: result.data.getYearSaldo });
      }
    });
  }

  resetStaticForDate(callback: () => void) {
    this.setState({ yearSaldo: '00:00' }, callback);
  }

  getStatisticForMonth(userId: string, dateKey: string) {
    this.props.apollo.getStatisticForMonth(userId, dateKey).then(result => {
      if (result.data) {
        this.setState({
          hoursSpentForMonthPerDay: result.data.getStatisticForMonth.hoursSpentForMonthPerDay,
          previousSelectedDate: result.data.getStatisticForMonth.selectedDate
        });
      }
    });
  }

  resetStaticsForMonth(callback: () => void) {
    this.setState(
      {
        hoursSpentForMonthPerDay: []
      },
      callback
    );
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
    this.resetTimestampsAndComplains(() => {
      const selectedDate = moment(this.state.selectedDate);
      selectedDate.date(date.day);
      this.onCalendarSelect(selectedDate.toDate());
    });
  };

  resetTimestampsAndComplains(callback: () => void) {
    this.setState(
      {
        timestamps: [],
        timestampError: '',
        complains: [],
        complainsErrors: []
      },
      callback
    );
  }

  resetUser(callback: () => void) {
    this.setState(
      {
        selectedUser: initialUserState
      },
      callback
    );
  }

  resetStatistic(callback: () => void) {
    this.setState({ hoursSpentForMonthPerDay: [] }, callback);
  }

  onCalendarSelect = (selectedDate: Date): void => {
    this.disableDetailsOnLeaveDay(this.state.listOfLeaves, moment(selectedDate));
    const userId = this.props.match.params.userId;
    const date = moment(selectedDate);
    const dateString = date.format(API_DATE);
    const previousSelectedDate = this.state.selectedDate;
    this.setState({ selectedDate: date }, () => {
      if (userId) {
        if (previousSelectedDate.get('year') !== this.state.selectedDate.get('year')) {
          this.refreshStatistics(userId);
        } else if (previousSelectedDate.get('month') !== this.state.selectedDate.get('month')) {
          this.monthChange(userId);
        }

        this.resetTimestampsAndComplains(() => {
          this.getComplainsAndTimestamps(userId, dateString);
          this.props.history.push(`/bookings/${userId}/${dateString}`);
        });
      }
    });
  };

  refreshStatistics = (userId: string, force?: boolean): void => {
    this.resetStaticForDate(() => {
      this.getStatisticForDate(userId);
      this.monthChange(userId, force);
    });
  };

  monthChange = (userId: string, force?: boolean): void => {
    const currentDate = this.state.selectedDate;
    const previousSelectedDate = moment(this.state.previousSelectedDate, API_DATE);
    if (
      previousSelectedDate.get('month') !== currentDate.get('month') ||
      previousSelectedDate.get('year') !== currentDate.get('year') ||
      force
    ) {
      this.getStatisticForMonth(userId, currentDate.format(API_DATE));
      this.getLeaveDaysAndPublicHoliday(userId, currentDate.format('YYYY'));
    }
  };

  updateComplainsAndRefreshStatistics = (complains: t.Complain[]): void => {
    const userId = this.props.match.params.userId;
    const dateKey = this.state.selectedDate.format(API_DATE);
    this.updateComplains(userId, dateKey, complains).then(() => this.refreshStatistics(userId, true));
  };

  updateTimestampsAndRefreshStatistics = (timestamps: t.Timestamp[]): void => {
    const userId = this.props.match.params.userId;
    const dateKey = this.state.selectedDate.format(API_DATE);
    this.updateTimestamps(userId, dateKey, timestamps).then(() => this.refreshStatistics(userId, true));
  };

  handleBookingModalClose = () => {
    //
  };

  render(): JSX.Element {
    return (
      <Container fluid={true}>
        <Row>
          <Col lg={5} xs={12} className="pt-3">
            <DayPickerWidgetContainer
              onDayClick={this.onCalendarSelect}
              selectedDate={this.state.selectedDate.toDate()}
              publicHolidays={this.state.publicHolidays}
              listOfLeaves={this.state.listOfLeaves}
              hoursSpentForMonthPerDay={this.state.hoursSpentForMonthPerDay}
              yearSaldo={this.state.yearSaldo}
            />
            <div className="pt-3">
              <TimestampWidget
                selectedDate={this.state.selectedDate}
                timestamps={this.state.timestamps}
                timestampError={this.state.timestampError}
                onClose={this.handleBookingModalClose}
                onUpdateTimestamps={this.updateTimestampsAndRefreshStatistics}
                showData={this.state.showData}
                userRole={this.props.loggedInUser.role}
              />
            </div>

            <ComplainWidget
              selectedDate={this.state.selectedDate}
              complains={this.state.complains}
              complainsErrors={this.state.complainsErrors}
              onUpdateComplains={this.updateComplainsAndRefreshStatistics}
              showData={this.state.showData}
              userRole={this.props.loggedInUser.role}
            />
          </Col>
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
        </Row>
      </Container>
    );
  }
}

export const BookingPageContainer = withApollo(BookingPage);
