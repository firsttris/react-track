import * as moment from 'moment';
import 'moment/locale/de';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import * as t from 'common/types';

interface Props {
  timestamp: t.Timestamp;
  hoursToday: string;
  saldo: string;
}

interface States {}

export class TimeStampStatus extends React.Component<Props, States> {
  render(): JSX.Element {
    let status;
    let style;
    let icon;
    const currentTime = moment(this.props.timestamp.time)
      .locale('de')
      .format('HH:mm:ss');
    if (this.props.timestamp.status === 'K') {
      style = { color: 'green' };
      icon = 'fa fa-sign-in';
      status = <FormattedMessage id="COME" />;
    }
    if (this.props.timestamp.status === 'G') {
      style = { color: 'red' };
      icon = 'fa fa-sign-out';
      status = <FormattedMessage id="GO" />;
    }

    return (
      <div>
        <div>
          <h1 style={style}>
            <i className={icon + ' pr-2'} style={style} />
            {status}
          </h1>
          <h1>{currentTime}</h1>
        </div>
        <h3>
          <FormattedMessage id="TIME_LEFT_TODAY" />{' '}
          <span style={{ color: this.props.hoursToday.includes('-') ? 'red' : 'green' }}>
            {' '}
            {this.props.hoursToday ? this.props.hoursToday : ''}
          </span>
        </h3>
        <h3>
          <FormattedMessage id="YEAR_SALDO" />:
          <span style={{ color: this.props.saldo.includes('-') ? 'red' : 'green' }}>
            {' '}
            {this.props.saldo ? this.props.saldo : ''}
          </span>
        </h3>
      </div>
    );
  }
}
