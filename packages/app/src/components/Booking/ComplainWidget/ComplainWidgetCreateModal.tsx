import { TimePicker } from 'components/TimePicker/TimePicker';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Col, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import * as t from 'types';

interface State {
  duration: string;
  reason: string;
}

interface Props {
  isOpen: boolean;
  toggleModal: () => void;
  updateComplains: (complains: t.Complain[]) => void;
  complains: t.Complain[];
}

export class ComplainWidgetCreateModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      duration: '00:00',
      reason: ''
    };
  }

  save = (): void => {
    const complain: t.Complain = {
      reason: this.state.reason,
      duration: this.state.duration
    };
    const complains = [...this.props.complains];
    complains.push(complain);
    this.props.toggleModal();
    this.props.updateComplains(complains);
  };

  setDuration = (duration: string): void => {
    this.setState({ duration });
  };

  handleOnChange = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ reason: evt.target.value });
  };

  render(): JSX.Element {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggleModal}>
        <ModalHeader toggle={this.props.toggleModal}>
          <FormattedMessage id="CREATE_COMPLAIN" />
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <TimePicker onTimeChange={this.setDuration} labelBefore="MINUS" label="HOURS" />
              <Row className="d-flex justify-content-center">
                <div className="form-group" style={{ width: '80%' }}>
                  <label className="col-form-label pb-0">
                    <FormattedMessage id="REASON" />
                  </label>
                  <Input type="textarea" name="reason" onChange={this.handleOnChange} />
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
