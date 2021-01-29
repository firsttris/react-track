import * as moment from 'moment';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import * as t from 'common/types';

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
        <td>{moment(this.props.leave.start).format('DD.MM.YYYY')}</td>
        <td>{moment(this.props.leave.end).format('DD.MM.YYYY')}</td>
        <td>{this.props.leave.hoursPerDay}</td>
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
