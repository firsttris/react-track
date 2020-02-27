import * as moment from 'moment';
import * as React from 'react';
import DayPicker from 'react-day-picker';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Card, CardBody, CardFooter, CardHeader, Col, Row } from 'reactstrap';
import * as t from 'types';
// Include the locale utils designed for moment
const MomentLocaleUtils = require('react-day-picker/moment');

interface Props {
  selectedDate: Date;
  publicHolidays: t.PublicHoliday[];
  listOfLeaves: t.Leave[];
  hoursSpentForMonthPerDay: t.HoursPerDay[];
  onDayClick: (date: Date) => void;
}

interface State {}

export class DayPickerWidget extends React.Component<Props & WrappedComponentProps, State> {
  render(): JSX.Element {
    const modifiers = this.getModifiers();
    return (
      <Card>
        <CardHeader>
          <FormattedMessage id="CALENDAR" />
        </CardHeader>
        <CardBody>
          <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Col lg={9} xs={12}>
              <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
                <DayPicker
                  modifiers={modifiers}
                  showWeekNumbers={true}
                  selectedDays={this.props.selectedDate}
                  onDayClick={this.props.onDayClick}
                  localeUtils={MomentLocaleUtils}
                  locale={this.props.intl.locale}
                  onMonthChange={this.props.onDayClick}
                />
              </Row>
            </Col>
            <Col lg={3} xs={12}>
              <Row className="align-items-center">
                <div style={{ backgroundColor: '#f39c12' }} className="mr-2 p-2 d-inline-block" />
                <FormattedMessage id="PUBLIC_HOLIDAY" />
              </Row>
              <Row className="align-items-center">
                <div style={{ backgroundColor: '#9b59b6' }} className="mr-2 p-2 d-inline-block" />
                <FormattedMessage id="SICKDAY" />
              </Row>
              <Row className="align-items-center">
                <div style={{ backgroundColor: '#95a5a6' }} className="mr-2 p-2 d-inline-block" />
                <FormattedMessage id="LEAVEDAY" />
              </Row>
              <Row className="align-items-center">
                <div style={{ backgroundColor: '#2ecc71' }} className="mr-2 p-2 d-inline-block" />
                <FormattedMessage id="PRESENT" />
              </Row>
              <Row className="align-items-center">
                <div style={{ backgroundColor: '#fa78de' }} className="mr-2 p-2 d-inline-block" />
                <FormattedMessage id="SCHOOL" />
              </Row>
              <Row className="align-items-center">
                <div style={{ backgroundColor: '#51a0fa' }} className="mr-2 p-2 d-inline-block" />
                <FormattedMessage id="SELECTED_DAY" />
              </Row>
            </Col>
          </Row>
        </CardBody>
        <CardFooter className="text-muted text-center">
          {moment(this.props.selectedDate).format('DD.MM.YYYY')}
        </CardFooter>
      </Card>
    );
  }

  private getModifiers() {
    const modifiers: any = {
      publicHolidayDates: [],
      sickDates: [],
      leaveDates: [],
      workedDates: [],
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
    for (const hoursPerDay of this.props.hoursSpentForMonthPerDay) {
      if (Number(hoursPerDay.hours) > 0) {
        const currentDate = new Date(this.props.selectedDate);
        currentDate.setDate(hoursPerDay.day);
        modifiers.workedDates.push(currentDate);
      }
    }
    return modifiers;
  }
}

export const DayPickerWidgetContainer = injectIntl(DayPickerWidget);
