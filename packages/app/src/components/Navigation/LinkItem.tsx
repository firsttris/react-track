import classNames = require('classnames');
import * as React from 'react';
import { Link } from 'react-router-dom';
import './LinkItem.css';
import { MessageFormatElement } from 'intl-messageformat-parser';

interface Props {
  focus: boolean;
  path: string;
  name: string | MessageFormatElement[];
  class: string;
  position: string;
  onClick: (name: string) => void;
}

interface State {
  hover: boolean;
}

export class LinkItem extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hover: false
    };
  }

  onMouseLeave = (): void => {
    this.setState({ hover: false });
  };

  onMouseEnter = (): void => {
    this.setState({ hover: true });
  };

  handleOnClick = (): void => {
    this.props.onClick(this.props.name.toString());
  };

  render(): JSX.Element {
    return (
      <li
        className={classNames('link-item', this.props.position)}
        onMouseLeave={this.onMouseLeave}
        onMouseEnter={this.onMouseEnter}
        onClick={this.handleOnClick}
      >
        <Link
          className={classNames('link', this.props.class, { hover: this.state.hover, focus: this.props.focus })}
          to={this.props.path}
          replace={true}
        >
          {this.props.name}
        </Link>
      </li>
    );
  }
}
