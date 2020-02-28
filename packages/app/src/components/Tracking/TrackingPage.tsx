import { GraphQLErrorMessage } from 'components/Error/GraphQLErrorMessage';
import { ApolloProps, withApollo } from 'components/hoc/WithApollo';
import { API_DATE } from 'common/constants';
import { GraphQLError } from 'graphql';
import { initialUserState } from 'common/initialState';
import * as moment from 'moment';
import * as React from 'react';
import * as t from 'common/types';
import { beepSound } from './Audio';
import { IdentityCard } from './IdentityCard';
import './Tracking.css';
import { WelcomeMessage } from './WelcomeMessage';

const initialTimeStampState = {
  actualTime: '',
  id: '',
  status: '',
  time: '',
  type: ''
};

interface Props extends ApolloProps {
  loggedInUser: t.User;
}

interface States {
  scannedUser: t.User;
  timestamp: t.Timestamp;
  timeLeft: string;
  yearSaldo: string;
  errors: readonly GraphQLError[];
}

export class TrackingPage extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      scannedUser: initialUserState,
      timestamp: initialTimeStampState,
      timeLeft: '',
      yearSaldo: '',
      errors: []
    };
  }

  componentWillUnmount(): void {
    this.setState({
      scannedUser: initialUserState,
      timestamp: initialTimeStampState,
      timeLeft: '',
      yearSaldo: '',
      errors: []
    });
  }

  render(): JSX.Element {
    return (
      <div className="App">
        <div>
          <WelcomeMessage onTab={this.onTab} />
          {this.state.timestamp.id && (
            <IdentityCard
              user={this.state.scannedUser}
              timeLeft={this.state.timeLeft}
              yearSaldo={this.state.yearSaldo}
              timestamp={this.state.timestamp}
            />
          )}
          {!!this.state.errors.length && <GraphQLErrorMessage errors={this.state.errors} />}
        </div>
      </div>
    );
  }

  onTab = (): void => {
    this.setState({ yearSaldo: '' });

    this.props.apollo.addTimestampByCode(this.props.loggedInUser.code).then(result => {
      if (result.data) {
        this.setState({
          scannedUser: result.data.addTimestampByCode.user,
          timeLeft: result.data.addTimestampByCode.timeLeft,
          timestamp: result.data.addTimestampByCode.timestamp,
          errors: []
        });
        beepSound.play();
      }
      if (result.errors) {
        this.setState({ errors: result.errors });
      }
    });

    this.props.apollo.getYearSaldo(this.props.loggedInUser.id, moment().format(API_DATE)).then(result => {
      if (result.data) {
        this.setState({
          yearSaldo: result.data.getYearSaldo
        });
      }
    });
  };
}

export const TrackingPageContainer = withApollo(TrackingPage);
