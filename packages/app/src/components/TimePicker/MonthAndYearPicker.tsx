import * as moment from 'moment';
import * as React from 'react';
import 'react-day-picker/lib/style.css';
import { FormattedMessage } from 'react-intl';
import { Form, FormGroup, Input, Label } from 'reactstrap';

const currentDate = moment();
const currentYear = currentDate.year();
const years: number[] = [];
let fromYear = currentYear - 5;
const toYear = currentYear + 5;
while (fromYear < toYear) {
  years.push(fromYear);
  fromYear++;
}

interface Props {
  onChange: (date: moment.Moment) => void;
  showMonth: boolean;
  showLabels: boolean;
  selectedDate?: string;
}

export const MonthAndYearPicker = (props: Props) => {
  const handleChange = (e: any) => {
    const { year, month } = e.target.form;
    const copy = moment(currentDate);
    copy.year(year.value);
    if (month) {
      copy.month(month.value);
    }

    props.onChange(copy);
  };

  const months = moment.months();
  const date = props.selectedDate ? moment(props.selectedDate) : moment(currentDate);

  return (
    <Form>
      {props.showMonth && (
        <FormGroup>
          {props.showLabels && (
            <Label for="month">
              <FormattedMessage id="MONTH" />
            </Label>
          )}
          <Input type="select" name="month" id="month" onChange={handleChange} value={date.month()}>
            {months.map((month, i) => (
              <option key={i} value={i}>
                {month}
              </option>
            ))}
          </Input>
        </FormGroup>
      )}
      <FormGroup>
        {props.showLabels && (
          <Label for="year">
            <FormattedMessage id="YEAR" />
          </Label>
        )}
        <Input type="select" name="year" id="year" onChange={handleChange} value={date.year()}>
          {years.map((year, i) => (
            <option key={i} value={year}>
              {year}
            </option>
          ))}
        </Input>
      </FormGroup>
    </Form>
  );
};
