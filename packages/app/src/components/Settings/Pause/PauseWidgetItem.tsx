import * as React from 'react';
import * as t from 'common/types';

interface Props {
  pause: t.Pause;
  onClick: (id: string) => void;
}

interface State {}

export class PauseWidgetItem extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render(): JSX.Element {
    return (
      <tr>
        <td>{this.props.pause.time}</td>
        <td>{this.props.pause.durationInMinutes}</td>
        <td>
          <i className="fa fa-trash pr-2" onClick={this.handleOnClick} style={{ float: 'right', cursor: 'pointer' }} />
        </td>
      </tr>
    );
  }

  protected handleOnClick = (): void => {
    this.props.onClick(this.props.pause.id);
  };
}
