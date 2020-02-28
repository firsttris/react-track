import { TimePicker } from 'components/TimePicker/TimePicker';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';

interface State {
  time: string;
}

interface Props {
  time: string;
  isOpen: boolean;
  header: string;
  onToggle: () => void;
  onSave: (time: string) => void;
}

export class WorkTimeWidgetCreateModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      time: props.time
    };
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: Props) {
    if (nextProps.time !== prevState.time) {
      return { time: nextProps.time };
    } else return null;
  }

  save = (): void => {
    this.props.onSave(this.state.time);
  };

  setTime = (time: string): void => {
    this.setState({ time });
  };

  render(): JSX.Element {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.onToggle}>
        <ModalHeader toggle={this.props.onToggle}>
          <FormattedMessage id={this.props.header} />
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <TimePicker onTimeChange={this.setTime} labelBefore="FROM" label="HOUR" time={this.state.time} />
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.save}>
            <i className="fa fa-floppy-o" />
          </Button>{' '}
          <Button color="secondary" onClick={this.props.onToggle}>
            <i className="fa fa-times" />
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
