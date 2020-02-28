import * as React from 'react';
import * as t from 'types';
declare let MOCKLOGIN: boolean;

interface Props {
  complain: t.Complain;
  index: number;
  onDelete: (index: number) => void;
  userRole: string | null;
}

export class ComplainWidgetItem extends React.Component<Props, {}> {
  handleOnClick = (): void => {
    this.props.onDelete(this.props.index);
  };

  render(): JSX.Element {
    return (
      <tr>
        <td>{this.props.complain.reason}</td>
        <td className="text-right">{this.props.complain.duration}</td>
        <td className="text-right">
          {(this.props.userRole === t.UserRole.ADMIN || MOCKLOGIN) && (
            <i className="fa fa-trash pr-2" onClick={this.handleOnClick} style={{ cursor: 'pointer' }} />
          )}
        </td>
      </tr>
    );
  }
}
