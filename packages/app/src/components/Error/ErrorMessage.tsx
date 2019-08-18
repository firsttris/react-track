import * as React from 'react';
import { FormattedMessage } from 'react-intl';

interface Props {
  error?: string | null;
}

export class ErrorMessage extends React.Component<Props, {}> {
  render() {
    return (
      <div className="mt-3" style={{ color: 'red' }}>
        {this.props.error && <FormattedMessage id={this.props.error} />}
      </div>
    );
  }
}
