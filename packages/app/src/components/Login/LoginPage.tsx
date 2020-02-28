import { ErrorMessage } from 'components/Error/ErrorMessage';
import { initialUserState } from 'initialState';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Redirect } from 'react-router-dom';
import * as t from 'types';
import { loginUser } from './../../graphql/apollo/client';

interface Props {}

interface States {
  error: string;
  password: string;
  user: t.User;
}

export class LoginPage extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: '',
      password: '',
      user: initialUserState
    };
  }

  componentDidMount(): void {}

  componentWillUnmount(): void {
    // this.props.resetLoggedInUserError();
  }

  onKeyPressEvent = (event: any): void => {
    if (event && (event.which === 13 || event.keyCode === 13)) {
      this.loginWithPassword();
    }
  };

  loginWithPassword = (): void => {
    // this.props.verifySuperAdmin(this.state.password);
    loginUser(this.state.password)
      .then(result => {
        localStorage.setItem('timetracking-login-token', result.token || '');
        this.setState({ user: result });
      })
      .catch(e => this.setState({ error: e.message }));
  };

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      password: event.target.value
    });
  };

  render(): JSX.Element {
    if (this.state.user.role === t.UserRole.ADMIN || this.state.user.role === t.UserRole.USER) {
      return <Redirect to={'/'} />;
    }

    return (
      <div className="container pt-3">
        <p>
          <FormattedMessage id="LOGIN_AS_ADMIN" />
        </p>
        <div className="pt-3">
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Passwort"
              value={this.state.password}
              name="password"
              onChange={this.handleInputChange}
              onKeyPress={this.onKeyPressEvent}
            />
          </div>
          <button className="btn btn-primary mr-2" onClick={this.loginWithPassword}>
            <FormattedMessage id="LOGIN_WITH_PASSWORD" />
          </button>
          <div className="form-group">
            <ErrorMessage error={this.state.error} />
          </div>
        </div>
      </div>
    );
  }
}
