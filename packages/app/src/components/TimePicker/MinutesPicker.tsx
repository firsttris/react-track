import * as React from 'react';
import { Button, Input } from 'reactstrap';

interface State {
  minute: string;
}

interface Props {
  setMinutes: (time: State) => void;
  max: number;
  minutes: string;
}

export class MinutesPicker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      minute: '00'
    };
  }

  componentWillReceiveProps(nextProps: Props): void {
    this.setState({ minute: nextProps.minutes });
  }

  updateMinute = (evt: any): void => {
    let minutesString = evt.target.value;
    if (minutesString) {
      const minutes = parseInt(evt.target.value, 10);
      if (isNaN(minutes) || minutes < 0 || minutes > this.props.max) {
        return;
      }
      minutesString = minutes.toString();
      if (minutes < 10) {
        minutesString = 0 + minutesString;
      }
    }

    this.setState(
      {
        minute: minutesString
      },
      () => this.props.setMinutes(this.state)
    );
  };

  addMinute = (): void => {
    let minutes = 0;
    let minutesString = '00';
    if (this.state.minute) {
      minutes = parseInt(this.state.minute, 10);
      if (isNaN(minutes) || minutes === this.props.max) {
        return;
      }
      minutesString = (minutes + 1).toString();
      if (minutes + 1 < 10) {
        minutesString = 0 + minutesString;
      }
    }
    this.setState({ minute: minutesString }, () => this.props.setMinutes(this.state));
  };

  removeMinute = (): void => {
    const minutes = parseInt(this.state.minute, 10);
    let minutesString = '00';
    if (isNaN(minutes) || minutes === 0) {
      return;
    }
    minutesString = (minutes - 1).toString();
    if (minutes - 1 < 10) {
      minutesString = 0 + minutesString;
    }
    this.setState({ minute: minutesString }, () => this.props.setMinutes(this.state));
  };

  render(): JSX.Element {
    const inputStyle = { width: '45px', margin: 'auto' };
    return (
      <div className="text-center">
        <Button onClick={this.addMinute}>
          <i className="fa fa-chevron-up" />
        </Button>
        <Input
          type="text"
          className="my-2"
          value={this.state.minute}
          name="minute"
          style={inputStyle}
          onChange={this.updateMinute}
        />
        <Button onClick={this.removeMinute}>
          <i className="fa fa-chevron-down" />
        </Button>
      </div>
    );
  }
}
