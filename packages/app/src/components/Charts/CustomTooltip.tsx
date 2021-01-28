import * as moment from 'moment';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

export class CustomTooltip extends React.Component<any, {}> {
  render(): JSX.Element | null {
    if (this.props.active) {
      const { payload, label, labelStyle, wrapperStyle } = this.props;
      if (!payload || !payload.length) {
        return null;
      }
      const finalStyle = {
        margin: 0,
        padding: 10,
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        whiteSpace: 'nowrap',
        ...wrapperStyle
      };
      const finalLabelStyle = {
        margin: 0,
        ...labelStyle
      };
      const hasError = payload[0]?.payload?.hasError;
      if (hasError) {
        return (
          <div style={finalStyle}>
            <p style={finalLabelStyle}>Stempelfehler</p>
          </div>
        );
      } else {
        const workTimes = payload[0].value;
        const startTime = workTimes[0];
        const endTime = workTimes[1];
        let workTime = '';
        if (startTime === 0 && endTime === 0) {
          workTime = '-';
        } else {
          const formattedStartTime = moment.utc(startTime * 60 * 60 * 1000).format('HH:mm');
          const formattedEndTime = moment.utc(endTime * 60 * 60 * 1000).format('HH:mm');
          workTime = formattedStartTime + ' - ' + formattedEndTime + ' ';
        }
        return (
          <div style={finalStyle}>
            <p style={finalLabelStyle}>
              <FormattedMessage id="DAY" />
              {`: ${label}`}
            </p>
            <p style={finalLabelStyle}>
              <FormattedMessage id="WORKTIME" />
              {`: ${workTime}`}
              {workTime.length > 1 ? <FormattedMessage id="OCLOCK" /> : ''}
            </p>
          </div>
        );
      }
    }

    return null;
  }
}
