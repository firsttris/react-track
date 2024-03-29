import { formatNumber } from 'common/NumberFormatter';
import * as React from 'react';
import * as t from 'common/types';

interface Props {
  saldo: t.Saldo;
  index: number;
  onClick: (index: number) => void;
}

export class SaldoWidgetItem extends React.Component<Props, {}> {
  handleOnClick = (): void => {
    this.props.onClick(this.props.index);
  };

  render(): JSX.Element {
    return (
      <tr>
        <td>{this.props.saldo.year}</td>
        <td>{this.props.saldo.comment}</td>
        <td className="text-right">{formatNumber(this.props.saldo.hours)}</td>
        <td className="text-right">
          <i className="fa fa-trash pr-2" onClick={this.handleOnClick} style={{ cursor: 'pointer' }} />
        </td>
      </tr>
    );
  }
}
