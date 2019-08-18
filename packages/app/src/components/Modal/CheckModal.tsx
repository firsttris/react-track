import * as React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

interface Props {
  onToggle: () => void;
  onSave: () => void;
  text: string;
  header: string;
  isOpen: boolean;
}

interface State {}

export class CheckModal extends React.Component<Props, State> {
  state = {};

  render(): JSX.Element {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.onToggle}>
        <ModalHeader toggle={this.props.onToggle}>{this.props.header}</ModalHeader>
        <ModalBody>
          <div className="text-center">{this.props.text}</div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.props.onSave}>
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
