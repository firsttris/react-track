import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Input } from 'reactstrap';

interface State {
  key: string;
}

interface Props {
  isOpen: boolean;
  toggleModal: () => void;
  saveModal: (key: string) => void;
}

const initialState = {
  key: ''
};

export class LicenseWidgetAddModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = initialState;
  }

  save = (): void => {
    this.props.saveModal(this.state.key);
    this.toggleModal();
  };

  toggleModal = () => this.setState(initialState, () => this.props.toggleModal());

  setKey = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ key: event.target.value });
  };

  render(): JSX.Element {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.toggleModal}>
        <ModalHeader toggle={this.toggleModal}>
          <FormattedMessage id="ADD_LICENSE" />
        </ModalHeader>
        <ModalBody>
          <Input type="text" value={this.state.key} name="key" onChange={this.setKey} />
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
