import * as React from 'react';
import { Button, Input } from 'reactstrap';

interface State {
  hour: string;
}

interface Props {
  hours: string;
  setHours: (time: State) => void;
}

export class HoursPicker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hour: '00'
    };
  }

  componentWillReceiveProps(nextProps: Props): void {
    this.setState({ hour: nextProps.hours });
  }

  updateHour = (evt: any): void => {
    let hoursString = evt.target.value;
    if (hoursString) {
      const hours = parseInt(evt.target.value, 10);
      if (isNaN(hours) || hours < 0 || hours > 23) {
        return;
      }
      hoursString = hours.toString();
      if (hours < 10) {
        hoursString = 0 + hoursString;
      }
    }

    this.setState(
      {
        hour: hoursString
      },
      () => this.props.setHours(this.state)
    );
  };

  addHour = (): void => {
    let hours = 0;
    let hoursString = '00';
    if (this.state.hour) {
      hours = parseInt(this.state.hour, 10);
      if (isNaN(hours) || hours === 23) {
        return;
      }
      hoursString = (hours + 1).toString();
      if (hours + 1 < 10) {
        hoursString = 0 + hoursString;
      }
    }
    this.setState({ hour: hoursString }, () => this.props.setHours(this.state));
  };

  removeHour = (): void => {
    const hours = parseInt(this.state.hour, 10);
    let hoursString = '00';
    if (isNaN(hours) || hours === 0) {
      return;
    }
    hoursString = (hours - 1).toString();
    if (hours - 1 < 10) {
      hoursString = 0 + hoursString;
    }
    this.setState({ hour: hoursString }, () => this.props.setHours(this.state));
  };

  render(): JSX.Element {
    const inputStyle = { width: '45px', margin: 'auto' };
    return (
      <div className="text-center">
        <Button onClick={this.addHour}>
          <i className="fa fa-chevron-up" />
        </Button>
        <Input
          type="text"
          className="my-2"
          value={this.state.hour}
          name="hour"
          style={inputStyle}
          onChange={this.updateHour}
        />
        <Button onClick={this.removeHour}>
          <i className="fa fa-chevron-down" />
        </Button>
      </div>
    );
  }
}
