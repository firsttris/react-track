import { API_DATE } from 'cons';
import { cloneDeep } from 'lodash';
import * as moment from 'moment';
import * as React from 'react';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Button, Col, Container, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import * as t from 'types';
import { DayTypePicker } from './DayTypePicker';
import './LeaveWidgetCreateModal.css';

interface Props {
  toggleModal: () => void;
  createLeave: (from: t.LeaveDate, to: t.LeaveDate, type: t.DayType) => void;
  isOpen: boolean;
  listOfLeaves: t.Leave[];
  publicHolidays: t.PublicHoliday[];
}

interface State {
  from: Date;
  to: Date;
  type: t.DayType;
  dayType: {
    startDay: t.WorkDayType;
    endDay: t.WorkDayType;
  };
  showSecondDaySelector: boolean;
}

const initialState = {
  from: new Date(),
  to: new Date(),
  type: t.DayType.Holiday,
  dayType: {
    startDay: t.WorkDayType.FullDay,
    endDay: t.WorkDayType.FullDay
  },
  showSecondDaySelector: false
};

export class LeaveWidgetCreateModal extends React.Component<Props & WrappedComponentProps, State> {
  constructor(props: Props & WrappedComponentProps) {
    super(props);
    this.state = cloneDeep(initialState);
  }

  reset() {
    this.setState(cloneDeep(initialState));
  }

  handleDayClick = (day: Date): void => {
    const range = DayPicker.DateUtils.addDayToRange(day, this.state);
    if (range.from.getDate() === range.to.getDate()) {
      return this.setState({ showSecondDaySelector: false, ...range });
    }
    return this.setState({ showSecondDaySelector: true, ...range });
  };

  handleSelection = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ type: e.target.value as t.DayType });
  };

  createLeave = (): void => {
    const { dayType, from, to, type } = this.state;
    const start = { date: moment(from).format(API_DATE), type: dayType.startDay };
    const end = {
      date: moment(to).format(API_DATE),
      type: this.state.showSecondDaySelector ? dayType.endDay : dayType.startDay
    };
    this.props.createLeave(start, end, type);
    this.reset();
  };

  handleDayTypeSelection = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const type = event.target.value as t.WorkDayType;
    const dayType: any = this.state.dayType;
    dayType[event.target.name] = type;
    this.setState({ dayType });
  };

  toggleModal = (): void => {
    this.props.toggleModal();
    this.reset();
  };

  render(): JSX.Element {
    const { from, to } = this.state;
    const modifiers = { start: from, end: to, ...this.getModifiers() };
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.toggleModal} className="max-content">
        <ModalHeader toggle={this.toggleModal}>
          <FormattedMessage id="CREATE_HOLIDAY" />
        </ModalHeader>
        <ModalBody>
          <Container>
            <Row>
              <Col>
                <Row>
                  <Col lg="4" xs="12">
                    <DayTypePicker onChange={this.handleDayTypeSelection} name="startDay" intl={this.props.intl} />
                  </Col>
                  <Col lg="2" xs="0" />
                  <Col lg="4" xs="12">
                    {this.state.showSecondDaySelector && (
                      <DayTypePicker onChange={this.handleDayTypeSelection} name="endDay" intl={this.props.intl} />
                    )}
                  </Col>
                </Row>
                <Row>
                  <DayPicker
                    showWeekNumbers={true}
                    className="create-leave-modal"
                    numberOfMonths={2}
                    selectedDays={[from, { from, to }]}
                    onDayClick={this.handleDayClick}
                    fixedWeeks={true}
                    modifiers={modifiers}
                  />
                </Row>
              </Col>
            </Row>
            <Row>
              <Col lg="4">
                <Input type="select" name="select" onChange={this.handleSelection}>
                  <option value={t.DayType.Holiday} label={this.props.intl.formatMessage({ id: t.DayType.Holiday })} />
                  <option value={t.DayType.Sickday} label={this.props.intl.formatMessage({ id: t.DayType.Sickday })} />
                  <option
                    value={t.DayType.Schoolday}
                    label={this.props.intl.formatMessage({ id: t.DayType.Schoolday })}
                  />
                </Input>
              </Col>
            </Row>
            <br />
            <Row>
              <Col>
                <Row style={{ alignItems: 'center' }}>
                  <Col>
                    <div style={{ backgroundColor: '#f39c12', display: 'inline-block' }} className="mr-2 p-2" />
                    <FormattedMessage id="PUBLIC_HOLIDAY" />
                  </Col>
                </Row>
                <Row style={{ alignItems: 'center' }}>
                  <Col>
                    <div style={{ backgroundColor: '#9b59b6', display: 'inline-block' }} className="mr-2 p-2" />
                    <FormattedMessage id="SICKDAY" />
                  </Col>
                </Row>
                <Row style={{ alignItems: 'center' }}>
                  <Col>
                    <div style={{ backgroundColor: '#95a5a6', display: 'inline-block' }} className="mr-2 p-2" />
                    <FormattedMessage id="LEAVEDAY" />
                  </Col>
                </Row>
                <Row style={{ alignItems: 'center' }}>
                  <Col>
                    <div style={{ backgroundColor: '#fa78de', display: 'inline-block' }} className="mr-2 p-2" />
                    <FormattedMessage id="SCHOOL" />
                  </Col>
                </Row>
                <Row style={{ alignItems: 'center' }}>
                  <Col>
                    <div style={{ backgroundColor: '#51a0fa', display: 'inline-block' }} className="mr-2 p-2" />
                    <FormattedMessage id="SELECTED_DAY" />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.createLeave}>
            <i className="fa fa-floppy-o" />
          </Button>{' '}
          <Button color="secondary" onClick={this.toggleModal}>
            <i className="fa fa-times" />
          </Button>
        </ModalFooter>
      </Modal>
    );
  }

  private getModifiers() {
    const modifiers: any = {
      publicHolidayDates: [],
      sickDates: [],
      leaveDates: [],
      schoolDates: []
    };
    for (const publicHoliday of this.props.publicHolidays) {
      modifiers.publicHolidayDates.push(new Date(publicHoliday.date));
    }
    for (const leave of this.props.listOfLeaves) {
      if (leave.type === t.DayType.Sickday) {
        modifiers.sickDates.push({ from: new Date(leave.start.date), to: new Date(leave.end.date) });
      }
      if (leave.type === t.DayType.Holiday) {
        modifiers.leaveDates.push({ from: new Date(leave.start.date), to: new Date(leave.end.date) });
      }
      if (leave.type === t.DayType.Schoolday) {
        modifiers.schoolDates.push({ from: new Date(leave.start.date), to: new Date(leave.end.date) });
      }
    }
    return modifiers;
  }
}

export const LeaveWidgetCreateModalContainer = injectIntl(LeaveWidgetCreateModal);
