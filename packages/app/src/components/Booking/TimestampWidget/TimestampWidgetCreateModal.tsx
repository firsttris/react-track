import { State as TimePickerState, TimePicker } from 'components/TimePicker/TimePicker';
import * as moment from 'moment';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Col, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import * as t from 'types';
import uuid = require('uuid/v4');

interface Props {
  timestamps: t.Timestamp[];
  onToggleModal: () => void;
  onUpdateTimestamps: (timestamps: t.Timestamp[]) => void;
  selectedDate: moment.Moment;
  isOpen: boolean;
}

interface State {
  hour: string;
  minute: string;
  status: string;
}

const initialValue = {
  hour: '00',
  minute: '00',
  status: 'K'
};

export class TimestampWidgetCreateModal extends React.Component<Props, State> {
  state = initialValue;

  componentWillReceiveProps(nextProps: Props) {
    this.setState(initialValue);
  }

  saveModal = (): void => {
    const date = this.getDate();
    const timestamps = this.props.timestamps.slice();
    timestamps.push(this.createManualTimestamp(date));
    this.props.onUpdateTimestamps(timestamps);
    this.props.onToggleModal();
  };

  createManualTimestamp = (date: moment.Moment): t.Timestamp => {
    const formattedDate = date.format();
    return { id: uuid(), time: formattedDate, actualTime: formattedDate, status: this.state.status, type: 'manuell' };
  };

  getDate = (): moment.Moment => {
    const date = moment(this.props.selectedDate);
    date.hours(Number(this.state.hour));
    date.minutes(Number(this.state.minute));
    date.seconds(0);
    return date;
  };

  updateStatus = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ status: evt.target.value });
  };

  setTime = (time: TimePickerState): void => {
    this.setState({ ...time });
  };

  render(): JSX.Element {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.onToggleModal}>
        <ModalHeader toggle={this.props.onToggleModal}>
          <FormattedMessage id="CREATE_BOOKING" />
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <TimePicker onHourAndMinuteChange={this.setTime} label="TIME" />
            </Col>
            <Col style={{ display: 'flex', alignItems: 'center' }}>
              <Input type="select" name="select" onChange={this.updateStatus}>
                <option value="K" label="Kommen" />
                <option value="G" label="Gehen" />
              </Input>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.saveModal}>
            <i className="fa fa-floppy-o" />
          </Button>{' '}
          <Button color="secondary" onClick={this.props.onToggleModal}>
            <i className="fa fa-times" />
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
