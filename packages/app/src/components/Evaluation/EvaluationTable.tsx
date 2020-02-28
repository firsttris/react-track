import classNames = require('classnames');
import * as moment from 'moment';
import * as React from 'react';
import { FormattedMessage, WrappedComponentProps } from 'react-intl';
import { Card, CardBody, CardFooter, CardHeader, Col, Row, Table } from 'reactstrap';
import * as t from 'common/types';
import * as bootstraps from '../../Bootstrap';
import './EvaluationTable.css';

interface Props extends WrappedComponentProps {
  userName: string;
  listOfEvaluation: t.Evaluation[];
  className?: string;
}

interface State {}

export class EvaluationTable extends React.Component<Props, State> {
  print = () => {
    window.print();
  };

  render(): JSX.Element {
    return (
      <Card className={this.props.className}>
        <CardHeader>
          <Row className={bootstraps.flex.align_items_center}>
            <Col>
              <FormattedMessage id="EVALUATION" /> <b>{this.props.userName}</b>
            </Col>
            <Col>
              <button
                type="button"
                title={this.props.intl.formatMessage({ id: 'PRINT' })}
                className="btn btn-primary float-right"
                onClick={this.print}
              >
                <i className="fa fa-print" />
              </button>
            </Col>
          </Row>
        </CardHeader>
        <CardBody className="table-responsive-sm">
          <Table className={'evaluation-table'}>
            <thead>
              <tr>
                <th>
                  <FormattedMessage id="DATE" />
                </th>
                <th>
                  <FormattedMessage id="TITLE" />
                </th>
                <th className="text-right">
                  <FormattedMessage id="TOTALHOURS" />
                </th>
                <th className="text-right">
                  <FormattedMessage id="TIMESPENT" />
                </th>
                <th className="text-right">
                  <FormattedMessage id="TIMEPAUSE" />
                </th>
                <th className="text-right">
                  <FormattedMessage id="TIMECOMPLAIN" />
                </th>
                <th className="text-right">
                  <FormattedMessage id="TIMEEARNED" />
                </th>
                <th className="text-right">
                  <FormattedMessage id="TIMELEFT" />
                </th>
              </tr>
            </thead>
            <tbody>
              {this.props.listOfEvaluation.map((evaluation, index) => (
                <tr key={index}>
                  <td>{evaluation.date ? moment(evaluation.date).format('DD.MM.YYYY dddd') : ''}</td>
                  <td>
                    {evaluation.title && <FormattedMessage id={evaluation.title} />}{' '}
                    <i className={classNames('fa', 'float-right', evaluation.icon)} />
                  </td>
                  <td className="text-right">{evaluation.totalHours}</td>
                  <td className="text-right">{evaluation.timeSpent}</td>
                  <td className="text-right">{evaluation.timePause}</td>
                  <td className="text-right">{evaluation.timeComplain}</td>
                  <td className="text-right">{evaluation.timeEarned}</td>
                  <td className="text-right">{evaluation.timeLeft}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
        <CardFooter className="text-muted" />
      </Card>
    );
  }
}
