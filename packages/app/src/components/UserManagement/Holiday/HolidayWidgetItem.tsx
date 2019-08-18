import { formatNumber } from 'NumberFormatter';
import * as React from 'react';
import * as t from 'types';

interface Props {
  holiday: t.Holiday;
  index: number;
  onClick: (index: number) => void;
}

export class HolidayWidgetItem extends React.Component<Props, {}> {
  handleOnClick = (): void => {
    this.props.onClick(this.props.index);
  };

  render(): JSX.Element {
    return (
      <tr>
        <td>{this.props.holiday.year}</td>
        <td>{this.props.holiday.comment}</td>
        <td className="text-right">{formatNumber(this.props.holiday.days)}</td>
        <td className="text-right">
          <i className="fa fa-trash pr-2" onClick={this.handleOnClick} style={{ cursor: 'pointer' }} />
        </td>
      </tr>
    );
  }
}
