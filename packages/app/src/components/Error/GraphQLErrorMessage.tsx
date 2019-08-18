import { GraphQLError } from 'graphql';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

interface Props {
  errors: readonly GraphQLError[];
}

export class GraphQLErrorMessage extends React.Component<Props, {}> {
  render() {
    return (
      <div style={{ color: 'red' }}>
        {this.props.errors &&
          this.props.errors.map((error, index) => <FormattedMessage key={index} id={error.message} />)}
      </div>
    );
  }
}
