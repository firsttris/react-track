import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Row } from 'reactstrap';
import { HoursPicker } from './HoursPicker';
import { MinutesPicker } from './MinutesPicker';

export interface State {
  hour: string;
  minute: string;
}

interface Props {
  onTimeChange?: (time: string) => void;
  onHourAndMinuteChange?: (time: State) => void;
  label: string;
  labelBefore?: string;
  time?: string;
}

const initialState = {
  hour: '00',
  minute: '00'
};

export class TimePicker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const time = this.parseTime(props);
    this.state = time || initialState;
  }

  setHours = (time: { hour: string }): void => {
    this.setState({ hour: time.hour }, () => this.onChange());
  };

  setMinutes = (time: { minute: string }): void => {
    this.setState({ minute: time.minute }, () => this.onChange());
  };

  onChange = () => {
    if (this.props.onTimeChange) {
      this.props.onTimeChange(`${this.state.hour}:${this.state.minute}`);
    }
    if (this.props.onHourAndMinuteChange) {
      this.props.onHourAndMinuteChange(this.state);
    }
  };

  static getDerivedStateFromProps(nextProps: Props, prevState: Props) {
    if (nextProps.time !== prevState.time) {
      const time = this.parseTime(nextProps);
      if (time) {
        return time;
      }
    } else return null;
  }

  static parseTime(props: Props): State | undefined {
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

  parseTime(props: Props): State | undefined {
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

  render(): JSX.Element {
    return (
      <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
        {this.props.labelBefore && (
          <div style={{ paddingRight: '5px' }}>
            <FormattedMessage id={this.props.labelBefore} />
          </div>
        )}
        <HoursPicker setHours={this.setHours} hours={this.state.hour} />
        <div style={{ padding: '5px' }}> : </div>
        <MinutesPicker setMinutes={this.setMinutes} max={59} minutes={this.state.minute} />
        <div style={{ paddingLeft: '5px' }}>
          <FormattedMessage id={this.props.label} />
        </div>
      </Row>
    );
  }
}
