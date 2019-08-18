import { MinutesPicker } from 'components/TimePicker/MinutesPicker';
import { TimePicker } from 'components/TimePicker/TimePicker';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';

interface State {
  time: string;
  duration: string;
}

interface Props {
  isOpen: boolean;
  toggleModal: () => void;
  saveModal: (time: string, duration: string) => void;
}

export class PauseWidgetCreateModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      time: '00:00',
      duration: '00'
    };
  }

  save = (): void => {
    this.props.saveModal(this.state.time, this.state.duration);
  };

  setTime = (time: string): void => {
    this.setState({ time });
  };

  setDuration = (time: { minute: string }): void => {
    this.setState({ duration: time.minute });
  };

  render(): JSX.Element {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggleModal}>
        <ModalHeader toggle={this.props.toggleModal}>
          <FormattedMessage id="CREATE_PAUSE" />
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <TimePicker onTimeChange={this.setTime} labelBefore="FROM2" label="HOUR" />
            </Col>
            <Col>
              <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
                <MinutesPicker setMinutes={this.setDuration} max={600} minutes={this.state.duration} />
                <div style={{ paddingLeft: '5px' }}>
                  <FormattedMessage id="MINUTES_PAUSE" />
                </div>
              </Row>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.save}>
            <i className="fa fa-floppy-o" />
          </Button>{' '}
          <Button color="secondary" onClick={this.props.toggleModal}>
            <i className="fa fa-times" />
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
