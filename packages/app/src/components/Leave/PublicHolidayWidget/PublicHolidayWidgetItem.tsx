import * as moment from 'moment';
import * as React from 'react';
import * as t from 'types';

interface Props {
  holiday: t.PublicHoliday;
  onClick: (year: string, holidayId: string) => void;
}

interface State {}

export class PublicHolidayWidgetItem extends React.Component<Props, State> {
  render(): JSX.Element {
    return (
      <tr>
        <td>{moment(this.props.holiday.date).format('DD.MM.YYYY')}</td>
        <td>{this.props.holiday.title}</td>
        <td>
          <i className="fa fa-trash pr-2" onClick={this.handleOnClick} style={{ float: 'right', cursor: 'pointer' }} />
        </td>
      </tr>
    );
  }

  protected handleOnClick = (): void => {
    this.props.onClick(moment(this.props.holiday.date).format('YYYY'), this.props.holiday.id);
  };
}
