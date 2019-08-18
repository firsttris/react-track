import * as moment from 'moment';
import 'moment/locale/de';
import * as React from 'react';

let intervalId: any = 0;

interface Props {}

interface State {
  time: string;
  date: string;
}

export class LiveClock extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      time: moment()
        .locale('de')
        .format('HH:mm:ss'),
      date: moment()
        .locale('de')
        .format('dddd, MMMM Do YYYY')
    };
  }

  componentDidMount(): void {
    intervalId = setInterval(() => {
      this.refreshTime();
    }, 1000);
  }

  componentWillUnmount(): void {
    clearInterval(intervalId);
  }

  refreshTime(): void {
    this.setState({
      time: moment()
        .locale('de')
        .format('HH:mm:ss'),
      date: moment()
        .locale('de')
        .format('dddd, MMMM Do YYYY')
    });
  }

  render(): JSX.Element {
    return (
      <div className="p-3">
        <h1>{this.state.time}</h1>
        <h2>{this.state.date}</h2>
      </div>
    );
  }
}
