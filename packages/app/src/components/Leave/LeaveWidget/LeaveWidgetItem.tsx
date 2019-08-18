import * as moment from 'moment';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import * as t from 'types';

interface Props {
  index: number;
  leave: t.Leave;
  onClick: (leave: t.Leave) => void;
}

interface State {}

export class LeaveWidgetItem extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  handleOnClick = (): void => {
    this.props.onClick(this.props.leave);
  };

  render(): JSX.Element {
    return (
      <tr>
        <td>{moment(this.props.leave.start.date).format('DD.MM.YYYY')}</td>
        <td>
          <FormattedMessage id={this.props.leave.start.type} />
        </td>
        <td>{moment(this.props.leave.end.date).format('DD.MM.YYYY')}</td>
        <td>
          <FormattedMessage id={this.props.leave.end.type} />
        </td>
        <td>
          <FormattedMessage id={this.props.leave.type} />
        </td>
        <td>{this.props.leave.requestedLeaveDays}</td>
        <td>
          <i className="fa fa-trash pr-2" onClick={this.handleOnClick} style={{ float: 'right', cursor: 'pointer' }} />
        </td>
      </tr>
    );
  }
}
