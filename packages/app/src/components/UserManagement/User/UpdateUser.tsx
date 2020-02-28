import { GraphQLError } from 'graphql';
import * as React from 'react';
import { WrappedComponentProps } from 'react-intl';
import * as t from 'common/types';
import { User } from './User';

interface Props {
  user: t.User;
  onUpdate: () => void;
  onChange: (user: t.User) => void;
  onCancel: () => void;
  errors: readonly GraphQLError[];
}

interface States {}

export class UpdateUser extends React.Component<Props & WrappedComponentProps, States> {
  render(): JSX.Element {
    return (
      <User
        buttonName="Update"
        user={this.props.user}
        errors={this.props.errors}
        onAction={this.props.onUpdate}
        onCancel={this.props.onCancel}
        onChange={this.props.onChange}
        intl={this.props.intl}
      />
    );
  }
}
