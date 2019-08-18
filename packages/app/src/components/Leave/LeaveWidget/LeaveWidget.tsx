import { GraphQLErrorMessage } from 'components/Error/GraphQLErrorMessage';
import { ApolloProps } from 'components/hoc/WithApollo';
import { MonthAndYearPicker } from 'components/TimePicker/MonthAndYearPicker.tsx';
import { GraphQLError } from 'graphql';
import { filter } from 'lodash';
import * as moment from 'moment';
import * as React from 'react';
import { ExecutionResult } from 'apollo-boost';
import { FormattedMessage } from 'react-intl';
import { Button, Card, CardBody, CardFooter, CardHeader, Table } from 'reactstrap';
import * as t from 'types';
import { LeaveWidgetCreateModalContainer } from './LeaveWidgetCreateModal';
import { LeaveWidgetItem } from './LeaveWidgetItem';

interface Props extends ApolloProps {
  userId: string;
  selectedUser: t.User;
}

interface State {
  isOpen: boolean;
  year: string;
  listOfLeave: t.Leave[];
  publicHolidays: t.PublicHoliday[];
  errors: readonly GraphQLError[];
}

export class LeaveWidget extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isOpen: false,
      year: moment().format('YYYY'),
      listOfLeave: [],
      publicHolidays: [],
      errors: []
    };
  }

  componentDidMount(): void {
    this.props.apollo.getLeaveDays(this.props.userId, this.state.year).then(result => {
      if (result.data) {
        this.setState({ listOfLeave: result.data.getLeaveDays });
      }
      this.setError(result);
    });
    this.props.apollo.getPublicHolidays(this.state.year).then(result => {
      if (result.data) {
        this.setState({ publicHolidays: result.data.getPublicHolidays });
      }
      this.setError(result);
    });
  }

  toggleModal = (): void => {
    const value = !this.state.isOpen;
    this.setState({ isOpen: value });
  };

  createLeave = (from: t.LeaveDate, to: t.LeaveDate, type: t.DayType): void => {
    this.resetError();
    const leave: t.LeaveInput = {
      start: from,
      end: to,
      type
    };
    this.props.apollo.createLeave(this.props.userId, leave).then(result => {
      if (result.data) {
        this.setState({ listOfLeave: result.data.createLeave });
      }
      this.setError(result);
    });
    this.toggleModal();
  };

  deleteLeaveForUser = (leave: t.LeaveInput): void => {
    this.resetError();
    this.props.apollo.deleteLeave(this.props.userId, leave).then(result => {
      if (result.data) {
        this.setState({ listOfLeave: result.data.deleteLeave });
      }
      this.setError(result);
    });
  };

  onYearChange = (date: moment.Moment) => {
    this.resetError();
    this.setState({ year: date.format('YYYY') });
    this.props.apollo.getLeaveDays(this.props.userId, date.format('YYYY')).then(result => {
      if (result.data) {
        this.setState({ listOfLeave: result.data.getLeaveDays });
      }
      this.setError(result);
    });
  };

  setError(result: ExecutionResult<any>) {
    if (result.errors) {
      this.setState({ errors: result.errors });
    }
  }

  resetError() {
    this.setState({ errors: [] });
  }

  render(): JSX.Element {
    const year = this.state.year;
    const maxLeaveDays = filter(this.props.selectedUser.holidays, { year }).reduce((a, b) => a + b.days, 0);
    const requestedSickDays = this.state.listOfLeave.reduce(
      (a, b) => a + (b.type === t.DayType.SICKDAY ? b.requestedLeaveDays : 0),
      0
    );
    const requestedLeaveDays = this.state.listOfLeave.reduce(
      (a, b) => a + (b.type === t.DayType.HOLIDAY ? b.requestedLeaveDays : 0),
      0
    );

    return (
      <Card>
        <CardHeader>
          <FormattedMessage id="DAYS_OF_LEAVE" values={{ name: this.props.selectedUser.name }} />
          <div className="pt-3" />
          <MonthAndYearPicker onChange={this.onYearChange} showMonth={false} showLabels={false} />
        </CardHeader>
        <CardBody className="table-responsive">
          <Table>
            <thead>
              <tr>
                <th>
                  <FormattedMessage id="FROM" />
                </th>
                <th>
                  <FormattedMessage id="TYPE" />
                </th>
                <th>
                  <FormattedMessage id="TO" />
                </th>
                <th>
                  <FormattedMessage id="TYPE" />
                </th>
                <th>
                  <FormattedMessage id="TYPE" />
                </th>
                <th>
                  <FormattedMessage id="DAYS" />
                </th>
              </tr>
            </thead>
            <tbody>
              {this.state.listOfLeave
                .sort((a, b) => moment(a.start.date).diff(moment(b.start.date)))
                .map((leave, index) => (
                  <LeaveWidgetItem key={index} index={index} leave={leave} onClick={this.deleteLeaveForUser} />
                ))}
            </tbody>
          </Table>
        </CardBody>
        <CardFooter className="text-muted d-flex align-items-center justify-content-center">
          <div className="container">
            <div className="row">
              <GraphQLErrorMessage errors={this.state.errors} />
            </div>
            <div className="row align-items-center">
              <div className="col-sm-12 col-lg-1 pl-lg-0">
                <Button className="mr-auto" onClick={this.toggleModal}>
                  <i className="fa fa-plus" />
                </Button>
              </div>
              <div className="col-sm-12 col-lg-3">
                <FormattedMessage
                  id="REQUESTED_SICK_DAYS"
                  values={{
                    days: requestedSickDays
                  }}
                />
              </div>
              <div className="col-sm-12 col-lg-3">
                <FormattedMessage
                  id="REQUESTED_LEAVE_DAYS"
                  values={{
                    days: requestedLeaveDays
                  }}
                />
              </div>
              <div className="col-sm-12 col-lg-3">
                <FormattedMessage id="MAX_DAYS_OF_LEAVE" values={{ max: maxLeaveDays }} />
              </div>
              <div className="col-sm-12 col-lg-2">
                <FormattedMessage id="LEFT_LEAVE_DAYS" values={{ days: maxLeaveDays - requestedLeaveDays }} />
              </div>
            </div>
          </div>
        </CardFooter>
        <LeaveWidgetCreateModalContainer
          isOpen={this.state.isOpen}
          toggleModal={this.toggleModal}
          createLeave={this.createLeave}
          listOfLeaves={this.state.listOfLeave}
          publicHolidays={this.state.publicHolidays}
        />
      </Card>
    );
  }
}
