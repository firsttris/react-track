import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Row } from 'reactstrap';
import { NumberPicker } from './NumberPicker';

export interface Time {
  hour: string;
  minute: string;
}

interface Props {
  onTimeChange?: (time: string) => void;
  onHourAndMinuteChange?: (time: Time) => void;
  label: string;
  labelBefore?: string;
  time: string;
}

export class TimePicker extends React.Component<Props, {}> {
  hour = '00';
  minute = '00';
  setHours = (hour: string): void => {
    this.hour = hour;
    this.onChange();
  };

  setMinutes = (minute: string): void => {
    this.minute = minute;
    this.onChange();
  };

  onChange = () => {
    if (this.props.onTimeChange) {
      this.props.onTimeChange(`${this.hour}:${this.minute}`);
    }
    if (this.props.onHourAndMinuteChange) {
      this.props.onHourAndMinuteChange({ hour: this.hour, minute: this.minute });
    }
  };

  static parseTime(props: Props) {
    if (!props.time) {
      return;
    }

    const timeComponents = props.time.split(':');
    if (timeComponents.length !== 2) {
      return;
    }

    return {
      hour: timeComponents[0],
      minute: timeComponents[1]
    };
  }

  parseTime(time: string) {
    if (!time) {
      return {
        hour: '00',
        minute: '00'
      };
    }

    const timeComponents = time.split(':');
    if (timeComponents.length !== 2) {
      return {
        hour: '00',
        minute: '00'
      };
    }

    return {
      hour: timeComponents[0],
      minute: timeComponents[1]
    };
  }

  render(): JSX.Element {
    const { hour, minute } = this.parseTime(this.props.time);
    return (
      <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
        {this.props.labelBefore && (
          <div style={{ paddingRight: '5px' }}>
            <FormattedMessage id={this.props.labelBefore} />
          </div>
        )}
        <NumberPicker setNumber={this.setHours} max={23} number={hour} />
        <div style={{ padding: '5px' }}> : </div>
        <NumberPicker setNumber={this.setMinutes} max={59} number={minute} />
        <div style={{ paddingLeft: '5px' }}>
          <FormattedMessage id={this.props.label} />
        </div>
      </Row>
    );
  }
}
