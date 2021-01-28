import * as classNames from 'classnames';
import * as moment from 'moment';
import * as React from 'react';
import * as t from 'common/types';

declare let MOCKLOGIN: boolean;

interface Props {
  timestamp: t.Timestamp;
  index: number;
  onDeleteClick: (index: number) => void;
  onRefreshClick: (index: number) => void;
  userRole: string | null;
}

export class TimestampWidgetItem extends React.Component<Props, {}> {
  handleOnDeleteClick = (): void => {
    this.props.onDeleteClick(this.props.index);
  };

  handleOnRefreshClick = (): void => {
    this.props.onRefreshClick(this.props.index);
  };

  handleOnMapClick = (): void => {
    const coordinate = this.props.timestamp.gpsCoordinate;
    if (coordinate) {
      window.open(`http://www.google.com/maps/place/${coordinate.latitude},${coordinate.longitude}`);
    }
  };

  render(): JSX.Element {
    return (
      <tr>
        <td>{moment(this.props.timestamp.time).format('HH:mm a')}</td>
        <td>{moment(this.props.timestamp.actualTime).format('HH:mm a')}</td>
        <td className="text-right">
          <i
            title={this.props.timestamp.status}
            className={classNames('pr-2 fa', this.props.timestamp.status === 'K' ? 'fa-sign-in' : 'fa-sign-out')}
            style={{ color: this.props.timestamp.status === 'K' ? 'green' : 'red' }}
          />
        </td>
        <td className="text-right">{this.props.timestamp.type}</td>
        <td className="text-right">
          {(this.props.userRole === t.UserRole.ADMIN || MOCKLOGIN) && (
            <>
              {this.props.timestamp.gpsCoordinate && (
                <i
                  title="Koordinaten in Google Maps öffnen"
                  className="fa fa-map-marker pr-2"
                  onClick={this.handleOnMapClick}
                  style={{ cursor: 'pointer' }}
                />
              )}
              <i
                title="Gebuchte Zeit Aktualisieren"
                className="fa fa-refresh pr-2"
                onClick={this.handleOnRefreshClick}
                style={{ cursor: 'pointer' }}
              />
              <i
                title="Löschen"
                className="fa fa-trash pr-2"
                onClick={this.handleOnDeleteClick}
                style={{ cursor: 'pointer' }}
              />
            </>
          )}
        </td>
      </tr>
    );
  }
}
