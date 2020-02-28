import classNames = require('classnames');
import { ApolloProps, withApollo } from 'components/hoc/WithApollo';
import { GraphQLError } from 'graphql';
import { initialUserState } from 'common/initialState';
import * as moment from 'moment';
import * as React from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import * as t from 'common/types';
import { HolidayWidget } from './Holiday/HolidayWidget';
import { SaldoWidget } from './Saldo/SaldoWidget';
import { CreateUser } from './User/CreateUser';
import { UpdateUser } from './User/UpdateUser';
import { WorkTimeWidget } from './WorkTime/WorkTimeWidget';

interface Props extends RouteComponentProps<{ tab: string; userId: string }>, ApolloProps, WrappedComponentProps {
  //
}

interface States {
  activeTab: string;
  errors: readonly GraphQLError[];
  user: t.User;
}

export enum Views {
  USER = 'user',
  SALDO = 'saldo',
  HOLIDAY = 'holiday',
  WORKTIME = 'worktime'
}

export class UserTabPage extends React.Component<Props, States> {
  path: string;
  userId: string;
  constructor(props: Props) {
    super(props);
    this.state = {
      activeTab: props.match.params.tab,
      user: initialUserState,
      errors: []
    };
    this.path = this.props.match.path;
    this.userId = this.props.match.params.userId;
  }

  componentDidMount() {
    if (this.userId) {
      this.props.apollo.getUserById(this.userId).then(result => {
        if (result.data) {
          this.setState({ user: result.data.getUserById });
        }
        if (result.errors) {
          this.setState({ errors: result.errors });
        }
      });
    }
  }

  handleUpdateUser = () => {
    this.resetError();
    this.props.apollo.updateUser(this.state.user).then(result => {
      if (result.errors) {
        this.setState({ errors: result.errors });
      }
    });
  };

  handleCreateUser = () => {
    this.resetError();
    this.props.apollo.createUser(this.state.user).then(result => {
      if (result.errors) {
        this.setState({ errors: result.errors });
      }
    });
  };

  handleUpdateAllUserWorkTimesById = () => {
    this.resetError();
    this.props.apollo.updateAllUserWorkTimesById(this.userId, this.state.user.workTimes).then(result => {
      if (result.errors) {
        this.setState({ errors: result.errors });
      }
    });
  };

  resetError = () => {
    this.setState({ errors: [] });
  };

  handleUserChange = (user: t.User) => {
    this.setState({ user });
  };

  handleWorkTimesChange = (workTimes: t.WorkTimes) => {
    const user = { ...this.state.user };
    user.workTimes = workTimes;
    this.setState({ user });
  };

  handleSaldoUpdate = (saldos: t.Saldo[]) => {
    const user = { ...this.state.user };
    user.saldos = saldos;
    this.setState({ user }, () => this.handleUpdateUser());
  };

  handleHolidayUpdate = (holidays: t.Holiday[]) => {
    const user = { ...this.state.user };
    user.holidays = holidays;
    this.setState({ user }, () => this.handleUpdateUser());
  };

  handleTimestampRewrite = () => {
    this.props.apollo.rewriteTimestamps(this.userId, moment().format('YYYY-MM-DD')).then(result => {
      if (result.data) {
        //
      }
      if (result.errors) {
        this.setState({ errors: result.errors });
      }
    });
  };

  handleCancel = (): void => {
    this.goToUsersPath();
  };

  goToUsersPath() {
    this.setState({ errors: [], user: initialUserState });
    this.props.history.push('/users');
  }

  setTabToUser = (event: React.MouseEvent<HTMLAnchorElement>) => {
    this.resetError();
    const newPath = this.path.replace(':userId', this.userId).replace(':tab', Views.USER);
    this.setState({
      activeTab: Views.USER
    });
    this.props.history.push(newPath);
  };

  setTabToSaldo = (event: React.MouseEvent<HTMLAnchorElement>) => {
    this.resetError();
    const newPath = this.path.replace(':userId', this.userId).replace(':tab', Views.SALDO);
    this.setState({
      activeTab: Views.SALDO
    });
    this.props.history.push(newPath);
  };

  setTabToHoliday = (event: React.MouseEvent<HTMLAnchorElement>) => {
    this.resetError();
    const newPath = this.path.replace(':userId', this.userId).replace(':tab', Views.HOLIDAY);
    this.setState({
      activeTab: Views.HOLIDAY
    });
    this.props.history.push(newPath);
  };

  setTabToWorkTime = (event: React.MouseEvent<HTMLAnchorElement>) => {
    this.resetError();
    const newPath = this.path.replace(':userId', this.userId).replace(':tab', Views.WORKTIME);
    this.setState({
      activeTab: Views.WORKTIME
    });
    this.props.history.push(newPath);
  };

  render(): JSX.Element {
    return (
      <div>
        <Nav tabs={true}>
          <NavItem>
            <NavLink
              className={classNames({ active: this.state.activeTab === Views.USER })}
              style={{ cursor: 'pointer' }}
              onClick={this.setTabToUser}
            >
              <FormattedMessage id="USER" />
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classNames({ active: this.state.activeTab === Views.HOLIDAY })}
              style={{ cursor: 'pointer' }}
              onClick={this.setTabToHoliday}
            >
              <FormattedMessage id="HOLIDAY" />
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classNames({ active: this.state.activeTab === Views.SALDO })}
              style={{ cursor: 'pointer' }}
              onClick={this.setTabToSaldo}
            >
              <FormattedMessage id="SALDO" />
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classNames({ active: this.state.activeTab === Views.WORKTIME })}
              style={{ cursor: 'pointer' }}
              onClick={this.setTabToWorkTime}
            >
              <FormattedMessage id="WORKTIME" />
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId={Views.USER}>
            {this.props.match.url.includes('createUser') && (
              <CreateUser
                onCreate={this.handleCreateUser}
                onChange={this.handleUserChange}
                onCancel={this.handleCancel}
                user={this.state.user}
                errors={this.state.errors}
                intl={this.props.intl}
              />
            )}
            {this.props.match.url.includes('updateUser') && (
              <UpdateUser
                onUpdate={this.handleUpdateUser}
                onChange={this.handleUserChange}
                onCancel={this.handleCancel}
                user={this.state.user}
                errors={this.state.errors}
                intl={this.props.intl}
              />
            )}
          </TabPane>
          <TabPane tabId={Views.HOLIDAY}>
            <HolidayWidget
              user={this.state.user}
              errors={this.state.errors}
              onUpdateHoliday={this.handleHolidayUpdate}
            />
          </TabPane>
          <TabPane tabId={Views.SALDO}>
            <SaldoWidget user={this.state.user} errors={this.state.errors} onUpdateSaldo={this.handleSaldoUpdate} />
          </TabPane>
          <TabPane tabId={Views.WORKTIME}>
            <WorkTimeWidget
              user={this.state.user}
              intl={this.props.intl}
              history={this.props.history}
              onCancel={this.handleCancel}
              onChange={this.handleWorkTimesChange}
              onUpdateAllUserWorkTimes={this.handleUpdateAllUserWorkTimesById}
              onUpdateUserWorkTimes={this.handleUpdateUser}
              onRewriteTimestamps={this.handleTimestampRewrite}
              errors={this.state.errors}
            />
          </TabPane>
        </TabContent>
      </div>
    );
  }
}

export const UserTabPageContainer = withApollo(withRouter(injectIntl(UserTabPage)));
