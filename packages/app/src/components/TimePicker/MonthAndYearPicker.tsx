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

interface State {
  currentDate: moment.Moment;
}

interface Props {
  onChange: (date: moment.Moment) => void;
  showMonth: boolean;
  showLabels: boolean;
  selectedDate?: string;
}

export class MonthAndYearPicker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      currentDate: moment()
    };
  }

  handleChange = (e: any) => {
    const { year, month } = e.target.form;
    const copy = moment(currentDate);
    copy.year(year.value);
    if (month) {
      copy.month(month.value);
    }
    this.setState({ currentDate: copy });
    this.props.onChange(copy);
  };

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.selectedDate) {
      this.setState({ currentDate: moment(nextProps.selectedDate) });
    }
  }

  render(): JSX.Element {
    const months = moment.months();
    return (
      <Form>
        {this.props.showMonth && (
          <FormGroup>
            {this.props.showLabels && (
              <Label for="month">
                <FormattedMessage id="MONTH" />
              </Label>
            )}
            <Input
              type="select"
              name="month"
              id="month"
              onChange={this.handleChange}
              value={this.state.currentDate.month()}
            >
              {months.map((month, i) => (
                <option key={i} value={i}>
                  {month}
                </option>
              ))}
            </Input>
          </FormGroup>
        )}
        <FormGroup>
          {this.props.showLabels && (
            <Label for="year">
              <FormattedMessage id="YEAR" />
            </Label>
          )}
          <Input type="select" name="year" id="year" onChange={this.handleChange} value={this.state.currentDate.year()}>
            {years.map((year, i) => (
              <option key={i} value={year}>
                {year}
              </option>
            ))}
          </Input>
        </FormGroup>
      </Form>
    );
  }
}
