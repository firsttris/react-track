import { API_DATE } from 'common/constants';
import * as moment from 'moment';
import * as React from 'react';
import DayPicker from 'react-day-picker';
import { FormattedMessage } from 'react-intl';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import * as t from 'common/types';

interface Props {
  toggleModal: () => void;
  onCreatePublicHoliday: (holiday: t.PublicHolidayInput) => void;
  isOpen: boolean;
}

interface State {
  selectedDate: Date;
  name: string;
}

const initialState = {
  selectedDate: new Date(),
  name: ''
};

export class PublicHolidayWidgetCreateModal extends React.Component<Props, State> {
  state = { ...initialState };

  reset() {
    this.setState({ ...initialState });
  }

  onCalendarSelect = (selectedDate: Date): void => {
    this.setState({ selectedDate });
  };

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const state: any = { ...this.state };
    state[event.target.name] = value;
    this.setState(state);
  };

  createPublicHoliday = (): void => {
    this.props.onCreatePublicHoliday({
      title: this.state.name,
      date: moment(this.state.selectedDate).format(API_DATE)
    });
    this.toggleModal();
  };

  toggleModal = () => {
    this.reset();
    this.props.toggleModal();
  };

  render(): JSX.Element {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.toggleModal}>
        <ModalHeader toggle={this.toggleModal}>
          <FormattedMessage id="CREATE_PUBLIC_HOLIDAY" />
        </ModalHeader>
        <ModalBody>
          <div className="text-center">
            <DayPicker
              showWeekNumbers={true}
              selectedDays={this.state.selectedDate}
              onDayClick={this.onCalendarSelect}
            />
          </div>
          <div className="form-group">
            <label className="col-form-label pb-0">
              <FormattedMessage id="NAME" />
            </label>
            <input className="form-control" value={this.state.name} name="name" onChange={this.handleInputChange} />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.createPublicHoliday}>
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
