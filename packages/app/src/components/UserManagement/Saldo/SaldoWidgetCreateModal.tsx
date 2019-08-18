import { MonthAndYearPicker } from 'components/TimePicker/MonthAndYearPicker.tsx';
import * as moment from 'moment';
import { formatNumber, parseFormattedString } from 'NumberFormatter';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, FormGroup, Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import * as t from 'types';

interface State {
  year: string;
  hours: string;
  comment: string;
}

interface Props {
  isOpen: boolean;
  onToggle: () => void;
  onUpdate: (saldos: t.Saldo[]) => void;
  saldoList: t.Saldo[];
}

export class SaldoWidgetCreateModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      year: moment().format('YYYY'),
      hours: '',
      comment: ''
    };
  }

  save = (): void => {
    let hours = this.getHours(this.state.hours);
    if (!hours) {
      hours = 0;
    }
    const saldo = {
      year: this.state.year,
      comment: this.state.comment,
      hours
    };
    const saldoList = [...this.props.saldoList];
    saldoList.push(saldo);
    this.props.onUpdate(saldoList);
    this.props.onToggle();
  };

  handleOnChange = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    const value = evt.target.value;

    if (value === '-') {
      this.setState({ hours: value });
      return;
    }

    const hours = this.getHours(value);
    if (hours) {
      this.setState({ hours: formatNumber(hours) });
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

    const hours = parseFloat(parseFormattedString(value));
    if (isNaN(hours)) {
      return undefined;
    }

    const roundedHours = Math.round(hours * 2) / 2; // one decimal place, only 0.5 allowed
    return roundedHours;
  }

  onYearChange = (date: moment.Moment) => {
    this.setState({ year: date.format('YYYY') });
  };

  render(): JSX.Element {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.onToggle}>
        <ModalHeader toggle={this.props.onToggle}>
          <FormattedMessage id="CREATE_SALDO" />
        </ModalHeader>
        <ModalBody>
          <MonthAndYearPicker onChange={this.onYearChange} showMonth={false} showLabels={false} />
          <FormGroup>
            <label className="col-form-label pb-0">
              <FormattedMessage id="HOURS" />
            </label>
            <Input type="text" name="hours" onChange={this.handleOnChange} />
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
