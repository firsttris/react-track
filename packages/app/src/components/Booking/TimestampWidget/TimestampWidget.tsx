import { ErrorMessage } from 'components/Error/ErrorMessage';
import * as moment from 'moment';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Card, CardBody, CardFooter, CardHeader, Table } from 'reactstrap';
import * as t from 'common/types';
import { TimestampWidgetCreateModal } from './TimestampWidgetCreateModal';
import { TimestampWidgetItem } from './TimestampWidgetItem';
declare let MOCKLOGIN: boolean;

interface Props {
  selectedDate: moment.Moment;
  timestamps: t.Timestamp[];
  onClose: () => void;
  onUpdateTimestamps: (timestamps: t.Timestamp[]) => void;
  showData: boolean;
  timestampError?: string | null;
  userRole: string;
}

interface State {
  isPopupOpen: boolean;
}

export class TimestampWidget extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isPopupOpen: false
    };
  }

  removeTimestamp = (index: number): void => {
    const timestamps = this.props.timestamps.slice();
    timestamps.splice(index, 1);
    this.props.onUpdateTimestamps(timestamps);
  };

  refreshTimestamps = (index: number) => {
    const timestamps = this.props.timestamps.slice();
    timestamps[index].time = timestamps[index].actualTime;
    this.props.onUpdateTimestamps(timestamps);
  };

  toggleModal = (): void => {
    const value = !this.state.isPopupOpen;
    this.setState({ isPopupOpen: value });
    this.props.onClose();
  };

  render(): JSX.Element {
    if (this.props.showData) {
      return (
        <div>
          <TimestampWidgetCreateModal
            timestamps={this.props.timestamps}
            selectedDate={this.props.selectedDate}
            isOpen={this.state.isPopupOpen}
            onToggleModal={this.toggleModal}
            onUpdateTimestamps={this.props.onUpdateTimestamps}
          />
          <Card>
            <CardHeader>
              <FormattedMessage id="BOOKINGS" />
            </CardHeader>
            <CardBody>
              {!!this.props.timestamps.length && (
                <div className="table-responsive" style={{ overflowY: 'auto', maxHeight: 685 }}>
                  <Table>
                    <thead>
                      <tr>
                        <th>
                          <FormattedMessage id="TIME" />
                        </th>
                        <th>
                          <FormattedMessage id="ACTUAL_TIME" />
                        </th>
                        <th className="text-right">
                          <FormattedMessage id="STATUS" />
                        </th>
                        <th className="text-right">
                          <FormattedMessage id="TYPE" />
                        </th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {this.props.timestamps.map((ts, index) => {
                        return (
                          <TimestampWidgetItem
                            key={index}
                            index={index}
                            timestamp={ts}
                            onDeleteClick={this.removeTimestamp}
                            onRefreshClick={this.refreshTimestamps}
                            userRole={this.props.userRole}
                          />
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              )}
            </CardBody>
            <CardFooter className="text-muted">
              {this.props.userRole === (t.UserRole.ADMIN || MOCKLOGIN) && (
                <Button onClick={this.toggleModal}>
                  <i className="fa fa-plus" />
                </Button>
              )}
              <ErrorMessage error={this.props.timestampError} />
            </CardFooter>
          </Card>
        </div>
      );
    } else {
      return <div />;
    }
  }
}
