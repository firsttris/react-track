import { NavigationContainer } from 'components/Navigation/Navigation';
import { LoadingSpinner } from 'components/Spinner/LoadingSpinner';
import * as c from 'common/constants';
import { initialUserState } from 'common/initialState';
import * as React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import * as t from 'common/types';
import { Apollo } from './../../graphql';
declare let MOCKLOGIN: boolean;

interface Props extends RouteProps {
  component: React.ComponentClass<any>;
  allowedRoles: t.UserRole[];
}

interface State {
  user: t.User;
  loading: boolean;
}

export class ProtectedRoute extends React.Component<Props, State> {
  state = {
    user: initialUserState,
    loading: true
  };

  componentDidMount() {
    this.verifyLogin();
  }

  logout = () => {
    this.setState({ user: initialUserState });
    localStorage.removeItem(c.LOCAL_STORAGE_KEY.TOKEN);
    Apollo.logout();
  };

  verifyLogin() {
    const token = localStorage.getItem(c.LOCAL_STORAGE_KEY.TOKEN);
    if (token) {
      Apollo.verifyLogin(token)
        .then(result => {
          if (result.data) {
            this.setState({ user: result.data.verifyLogin, loading: false });
          }
        })
        .catch(() => this.setState({ loading: false }));
    } else {
      this.setState({ loading: false });
    }
  }

  render(): JSX.Element {
    const { component: Component, ...rest } = this.props;
    const pathname = this.props.location ? this.props.location.pathname : '';
    return (
      <Route
        {...rest}
        render={props =>
          this.props.allowedRoles.includes(this.state.user.role) || MOCKLOGIN ? (
            <>
              <NavigationContainer loggedInUser={this.state.user} path={pathname} logout={this.logout} />
              <Component {...props} loggedInUser={this.state.user} />
            </>
          ) : this.state.loading ? (
            <LoadingSpinner />
          ) : (
            <Redirect
              to={{
                pathname: '/login'
              }}
            />
          )
        }
      />
    );
  }
}
