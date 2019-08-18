import classNames = require('classnames');
import { API_DATE } from 'cons';
import * as moment from 'moment';
import * as React from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import * as t from 'types';
import { LinkItem } from './LinkItem';
import './Navigation.css';
declare let MOCKLOGIN: boolean;

const fixedNavBarStyle = {
  width: '100%',
  borderBottom: '1px solid #61DAFB'
};

const navButtonStyle = {
  margin: '10px',
  color: '#61DAFB',
  textDecoration: 'none'
};

interface Props {
  loggedInUser: t.User;
  path?: string;
  logout: () => void;
}

interface State {
  hideNav: boolean;
}

export class Navigation extends React.Component<Props & WrappedComponentProps, State> {
  state = {
    hideNav: true
  };

  handleOnClick = (name: string): void => {
    if (name.includes('Logout')) {
      this.logout();
    }
    this.setState({ hideNav: true });
  };

  toggleNavigation = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    this.setState({ hideNav: !this.state.hideNav });
  };

  logout = (): void => {
    const isLoggedIn =
      (this.props.loggedInUser && this.props.loggedInUser.role === t.UserRole.ADMIN) ||
      this.props.loggedInUser.role === t.UserRole.USER ||
      MOCKLOGIN;
    if (isLoggedIn) {
      this.props.logout();
    }
  };

  render(): JSX.Element {
    const isAdminLoggedIn = (this.props.loggedInUser && this.props.loggedInUser.role === t.UserRole.ADMIN) || MOCKLOGIN;
    const isUserLoggedIn = this.props.loggedInUser && this.props.loggedInUser.role === t.UserRole.USER;
    const navItems = [
      {
        path: '/',
        name: this.props.intl.messages.TRACKING,
        class: classNames('d-none', { 'd-block': isUserLoggedIn || isAdminLoggedIn }),
        position: 'float-left'
      },
      {
        path: `/evaluation/${this.props.loggedInUser.id}`,
        name: this.props.intl.messages.EVALUATION,
        class: classNames('d-none', { 'd-block': isUserLoggedIn }),
        position: 'float-left'
      },
      {
        path: `/bookings/${this.props.loggedInUser.id}/${moment().format(API_DATE)}`,
        name: this.props.intl.messages.BOOKINGS,
        class: classNames('d-none', { 'd-block': isUserLoggedIn }),
        position: 'float-left'
      },
      {
        path: '/users',
        name: this.props.intl.messages.USERS,
        class: classNames('d-none', { 'd-block': isAdminLoggedIn }),
        position: 'float-left'
      },
      {
        path: '/settings',
        name: this.props.intl.messages.SETTINGS,
        class: classNames('d-none', { 'd-block': isAdminLoggedIn }),
        position: 'float-left'
      },

      {
        path: '/login',
        name: this.props.intl.formatMessage({ id: 'LOGOUT' }, { name: this.props.loggedInUser.name }),
        class: classNames('d-none', { 'd-block': isUserLoggedIn || isAdminLoggedIn }),
        position: 'float-right'
      },
      {
        path: '/login',
        name: this.props.intl.messages.LOGIN,
        class: classNames('d-none', { 'd-block': !(isUserLoggedIn || isAdminLoggedIn) }),
        position: 'float-right'
      }
    ];
    return (
      <div className="d-print-none nav-menu" style={fixedNavBarStyle}>
        <ul
          style={{
            listStyleType: 'none',
            margin: '0',
            padding: '0',
            overflow: 'hidden',
            backgroundColor: '#222'
          }}
        >
          <li className="d-block d-sm-none">
            <a className="btn btn-outline-dark pull-right" onClick={this.toggleNavigation} style={navButtonStyle}>
              <i className="fa fa-bars" aria-hidden="true" />
            </a>
            <div className="clearfix" />
          </li>
          <div className={classNames({ navigation: this.state.hideNav })}>
            {navItems.map((item, index) => {
              return (
                <LinkItem key={index} onClick={this.handleOnClick} focus={this.props.path === item.path} {...item} />
              );
            })}
          </div>
        </ul>
      </div>
    );
  }
}
export const NavigationContainer = injectIntl(Navigation);
