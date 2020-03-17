import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { GraphQLError } from 'graphql';
import { Card, CardBody, CardFooter, CardHeader, Table } from 'reactstrap';
import * as t from 'common/types';
import { GraphQLErrorMessage } from 'components/Error/GraphQLErrorMessage';

interface Props {
  yearSaldo: string;
  selectedUser: t.User;
  statisticForDate: t.Statistic;
  statisticForWeek: t.Statistic;
  statisticForMonth: t.Statistic;
  errors: readonly GraphQLError[];
}

export class StatisticWidget extends React.Component<Props, {}> {
  render(): JSX.Element {
    return (
      <Card style={{ minHeight: '350px', height: '100%' }}>
        <CardHeader>
          <FormattedMessage id="STATISTIC" values={{ name: this.props.selectedUser.name }} />
        </CardHeader>
        <CardBody className="table-responsive">
          <Table className="m-0">
            <thead>
              <tr className="text-right">
                <th />
                <th>
                  <FormattedMessage id="DAYS" />
                </th>
                <th>
                  <FormattedMessage id="WEEK" />
                </th>
                <th>
                  <FormattedMessage id="MONTH" />
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">
                  <FormattedMessage id="TOTALHOURS" />
                </th>
                <td className="text-right">{this.props.statisticForDate.totalHours}</td>
                <td className="text-right">{this.props.statisticForWeek.totalHours}</td>
                <td className="text-right">{this.props.statisticForMonth.totalHours}</td>
              </tr>
              <tr>
                <th scope="row">
                  <FormattedMessage id="TIMESPENT" />
                </th>
                <td className="text-right">{this.props.statisticForDate.timeSpent}</td>
                <td className="text-right">{this.props.statisticForWeek.timeSpent}</td>
                <td className="text-right">{this.props.statisticForMonth.timeSpent}</td>
              </tr>
              <tr>
                <th scope="row">
                  <FormattedMessage id="TIMEPAUSE" />
                </th>
                <td className="text-right">{this.props.statisticForDate.timePause}</td>
                <td className="text-right">{this.props.statisticForWeek.timePause}</td>
                <td className="text-right">{this.props.statisticForMonth.timePause}</td>
              </tr>
              <tr>
                <th scope="row">
                  <FormattedMessage id="TIMECOMPLAIN" />
                </th>
                <td className="text-right">{this.props.statisticForDate.timeComplain}</td>
                <td className="text-right">{this.props.statisticForWeek.timeComplain}</td>
                <td className="text-right">{this.props.statisticForMonth.timeComplain}</td>
              </tr>
              <tr>
                <th scope="row">
                  <FormattedMessage id="TIMEEARNED" />
                </th>
                <td className="text-right">
                  <b>{this.props.statisticForDate.timeEarned}</b>
                </td>
                <td className="text-right">
                  <b>{this.props.statisticForWeek.timeEarned}</b>
                </td>
                <td className="text-right">
                  <b>{this.props.statisticForMonth.timeEarned}</b>
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <FormattedMessage id="TIMELEFT" />
                </th>
                <td
                  className="text-right"
                  style={{
                    color: this.props.statisticForDate.timeLeft.includes('-') ? 'red' : 'green'
                  }}
                >
                  {this.props.statisticForDate.timeLeft}
                </td>
                <td
                  className="text-right"
                  style={{
                    color: this.props.statisticForWeek.timeLeft.includes('-') ? 'red' : 'green'
                  }}
                >
                  {this.props.statisticForWeek.timeLeft}
                </td>
                <td
                  className="text-right"
                  style={{
                    color: this.props.statisticForMonth.timeLeft.includes('-') ? 'red' : 'green'
                  }}
                >
                  {this.props.statisticForMonth.timeLeft}
                </td>
              </tr>
            </tbody>
          </Table>
        </CardBody>
        <CardFooter className="text-muted">
          <b>
            <FormattedMessage id="YEAR_SALDO" />
          </b>
          <b
            style={{
              color: this.props.yearSaldo.includes('-') ? 'red' : 'green',
              float: 'right'
            }}
          >
            {this.props.yearSaldo}
          </b>
          <GraphQLErrorMessage errors={this.props.errors} />
        </CardFooter>
      </Card>
    );
  }
}
