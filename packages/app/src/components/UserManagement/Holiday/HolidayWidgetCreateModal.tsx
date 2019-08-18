import { MonthAndYearPicker } from 'components/TimePicker/MonthAndYearPicker.tsx';
import * as moment from 'moment';
import { formatNumber, parseFormattedString } from 'NumberFormatter';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, FormGroup, Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import * as t from 'types';

interface State {
  year: string;
  days: string;
  comment: string;
}

interface Props {
  isOpen: boolean;
  onToggle: () => void;
  onUpdate: (holiday: t.Holiday[]) => void;
  holidayList: t.Holiday[];
}

export class HolidayWidgetCreateModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      year: moment().format('YYYY'),
      days: '',
      comment: ''
    };
  }

  save = (): void => {
    let days = this.getHours(this.state.days);
    if (!days) {
      days = 0;
    }
    const holiday = {
      year: this.state.year,
      comment: this.state.comment,
      days
    };
    const holidayList = [...this.props.holidayList];
    holidayList.push(holiday);
    this.props.onUpdate(holidayList);
    this.props.onToggle();
  };

  handleOnChange = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    const value = evt.target.value;

    if (value === '-') {
      this.setState({ days: value });
      return;
    }

    const hours = this.getHours(value);
    if (hours) {
      this.setState({ days: formatNumber(hours) });
    }
  };

  handleOnCommentChange = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    const value = evt.target.value;
    this.setState({ comment: value });
  };

  getHours(value: string): number | undefined {
    if (!value || value === '-') {
      return undefined;
    }

    const days = parseFloat(parseFormattedString(value));
    if (isNaN(days)) {
      return undefined;
    }

    const roundedDays = Math.round(days * 2) / 2; // one decimal place, only 0.5 allowed
    return roundedDays;
  }

  onYearChange = (date: moment.Moment) => {
    this.setState({ year: date.format('YYYY') });
  };

  render(): JSX.Element {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.onToggle}>
        <ModalHeader toggle={this.props.onToggle}>
          <FormattedMessage id="CREATE_HOLIDAY" />
        </ModalHeader>
        <ModalBody>
          <MonthAndYearPicker onChange={this.onYearChange} showMonth={false} showLabels={false} />
          <FormGroup>
            <label className="col-form-label pb-0">
              <FormattedMessage id="DAYS" />
            </label>
            <Input type="text" name="days" onChange={this.handleOnChange} />
          </FormGroup>
          <FormGroup>
            <label className="col-form-label pb-0">
              <FormattedMessage id="COMMENT" />
            </label>
            <Input type="text" name="comment" onChange={this.handleOnCommentChange} />
          </FormGroup>
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
