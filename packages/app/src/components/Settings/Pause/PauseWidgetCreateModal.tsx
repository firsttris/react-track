import { NumberPicker } from 'components/TimePicker/NumberPicker';
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

const initialState = {
  time: '00:00',
  duration: '00'
};

export class PauseWidgetCreateModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = initialState;
  }

  save = (): void => {
    this.props.saveModal(this.state.time, this.state.duration);
    this.toggleModal();
  };

  toggleModal = () => this.setState(initialState, () => this.props.toggleModal());

  setTime = (time: string): void => {
    this.setState({ time });
  };

  setDuration = (minute: string): void => {
    this.setState({ duration: minute });
  };

  render(): JSX.Element {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.toggleModal}>
        <ModalHeader toggle={this.toggleModal}>
          <FormattedMessage id="CREATE_PAUSE" />
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <TimePicker onTimeChange={this.setTime} time={this.state.time} labelBefore="FROM2" label="HOUR" />
            </Col>
            <Col>
              <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
                <NumberPicker setNumber={this.setDuration} max={600} number={this.state.duration} />
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
          <Button color="secondary" onClick={this.toggleModal}>
            <i className="fa fa-times" />
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
