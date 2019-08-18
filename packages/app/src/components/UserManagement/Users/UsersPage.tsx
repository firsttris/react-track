import { ApolloProps, withApollo } from 'components/hoc/WithApollo';
import * as React from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { UserItem } from './UserItem';

interface Props extends ApolloProps {}

interface States {
  users: Array<{ id: string; name: string }>;
}

export class UsersPage extends React.Component<Props & WrappedComponentProps, States> {
  state = {
    users: []
  };

  componentDidMount(): void {
    this.props.apollo.getUsers().then(result => {
      if (result.data) {
        this.setState({ users: result.data.getUsers });
      }
    });
  }

  deleteUser = (userId: string, index: number) => {
    const users = [...this.state.users];
    users.splice(index, 1);
    this.setState({ users });
    this.props.apollo.deleteUser(userId);
  };

  render(): JSX.Element {
    return (
      <div className="container pt-3">
        <ul className="list-group">
          {this.state.users.map((user: { id: string; name: string }, index: number) => (
            <UserItem key={index} index={index} user={user} onClick={this.deleteUser} intl={this.props.intl} />
          ))}
        </ul>
        <div className="py-3">
          <Link
            title={this.props.intl.formatMessage({ id: 'CREATE_USER' })}
            className="btn btn-secondary mr-1"
            to="createUser/user"
          >
            <i className="fa fa-user-plus" />
          </Link>
          <Link
            title={this.props.intl.formatMessage({ id: 'EVALUATION' })}
            to="evaluations"
            className="btn btn-secondary"
          >
            <i className="fa fa-line-chart" />
          </Link>
        </div>
      </div>
    );
  }
}

export const UserPageContainer = withApollo(injectIntl(UsersPage));
