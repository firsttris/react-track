import { ApolloProps } from 'components/hoc/WithApollo';
import { MonthAndYearPicker } from 'components/TimePicker/MonthAndYearPicker.tsx';
import * as moment from 'moment';
import * as React from 'react';
import { GraphQLError } from 'graphql';
import { FormattedMessage } from 'react-intl';
import { Button, Card, CardBody, CardFooter, CardHeader, Table } from 'reactstrap';
import * as t from 'common/types';
import { PublicHolidayWidgetCreateModal } from './PublicHolidayWidgetCreateModal';
import { PublicHolidayWidgetItem } from './PublicHolidayWidgetItem';
import { GraphQLErrorMessage } from 'components/Error/GraphQLErrorMessage';

type Props = ApolloProps;

interface State {
  isOpen: boolean;
  year: string;
  publicHolidays: t.PublicHoliday[];
  errors: readonly GraphQLError[];
}

export class PublicHolidayWidget extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isOpen: false,
      year: moment().format('YYYY'),
      publicHolidays: [],
      errors: []
    };
  }

  componentDidMount(): void {
    this.GetPublicHolidays();
  }

  toggleModal = (): void => {
    const value = !this.state.isOpen;
    this.setState({ isOpen: value });
  };

  onYearChange = (date: moment.Moment) => {
    this.setState({ year: date.format('YYYY') }, () => this.GetPublicHolidays());
  };

  loadPublicHolidays = () => {
    this.props.apollo.loadPublicHolidays(this.state.year).then(result => {
      if (result.data) {
        this.setState({
          publicHolidays: result.data.loadPublicHolidays,
          errors: []
        });
      }
      if (result.errors) {
        this.setState({ errors: result.errors });
      }
    });
  };

  GetPublicHolidays = () => {
    this.props.apollo.getPublicHolidays(this.state.year).then(result => {
      if (result.data) {
        this.setState({
          publicHolidays: result.data.getPublicHolidays
        });
      }
    });
  };

  deletePublicHoliday = (year: string, holidayId: string) => {
    this.props.apollo.deletePublicHoliday(year, holidayId).then(result => {
      if (result.data) {
        this.setState({
          publicHolidays: result.data.deletePublicHoliday
        });
      }
      if (result.errors) {
        this.setState({ errors: result.errors });
      } else {
        this.setState({ errors: [] });
      }
    });
  };

  createPublicHolidays = (holiday: t.PublicHolidayInput) => {
    this.props.apollo.createPublicHoliday(holiday).then(result => {
      if (result.data) {
        this.setState({ publicHolidays: result.data.createPublicHoliday });
      }
      if (result.errors) {
        this.setState({ errors: result.errors });
      } else {
        this.setState({ errors: [] });
      }
    });
  };

  render(): JSX.Element {
    return (
      <Card>
        <CardHeader>
          <FormattedMessage id="PUBLIC_HOLIDAY" />
          <div className="pt-3" />
          <MonthAndYearPicker onChange={this.onYearChange} showMonth={false} showLabels={false} />
        </CardHeader>
        <CardBody className="table-responsive">
          <Table>
            <thead>
              <tr>
                <th>
                  <FormattedMessage id="DAY" />
                </th>
                <th>
                  <FormattedMessage id="OCCASION" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {this.state.publicHolidays.map((holiday, index) => (
                <PublicHolidayWidgetItem key={index} holiday={holiday} onClick={this.deletePublicHoliday} />
              ))}
            </tbody>
          </Table>
        </CardBody>
        <CardFooter className="text-muted">
          <Button onClick={this.toggleModal}>
            <i className="fa fa-plus" />
          </Button>{' '}
          <Button onClick={this.loadPublicHolidays}>
            <i className="fa fa-refresh" />
          </Button>
          <GraphQLErrorMessage errors={this.state.errors} />
        </CardFooter>
        <PublicHolidayWidgetCreateModal
          onCreatePublicHoliday={this.createPublicHolidays}
          isOpen={this.state.isOpen}
          toggleModal={this.toggleModal}
        />
      </Card>
    );
  }
}
