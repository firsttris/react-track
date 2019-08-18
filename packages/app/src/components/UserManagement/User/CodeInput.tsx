import classNames = require('classnames');
import * as React from 'react';

interface Props {
  code: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface States {
  type: string;
}

export class CodeInput extends React.Component<Props, States> {
  state = {
    type: 'password'
  };

  togglePw = (): void => {
    this.setState({
      type: this.state.type === 'input' ? 'password' : 'input'
    });
  };

  render(): JSX.Element {
    return (
      <div className="input-group">
        <input
          className="form-control"
          type={this.state.type}
          value={this.props.code}
          id="code"
          name="code"
          onChange={this.props.onChange}
        />
        <div className="input-group-prepend" onClick={this.togglePw} style={{ cursor: 'pointer' }}>
          <div className="input-group-text">
            <i
              className={classNames('fa', {
                'fa-eye': this.state.type.includes('password'),
                'fa-eye-slash': this.state.type.includes('input')
              })}
            />
          </div>
        </div>
      </div>
    );
  }
}
