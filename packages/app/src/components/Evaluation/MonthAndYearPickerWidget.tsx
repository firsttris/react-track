import { MonthAndYearPicker } from 'components/TimePicker/MonthAndYearPicker';
import * as moment from 'moment';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Card, CardBody, CardFooter, CardHeader } from 'reactstrap';

interface Props {
  className?: string;
  onChange: (date: moment.Moment) => void;
  selectedDate?: string;
}

export const MonthAndYearPickerWidget = (props: Props) => (
  <Card className={props.className}>
    <CardHeader>
      <FormattedMessage id="SELECT_DATE" />
    </CardHeader>
    <CardBody>
      <MonthAndYearPicker
        onChange={props.onChange}
        showLabels={true}
        showMonth={true}
        selectedDate={props.selectedDate}
      />
    </CardBody>
    <CardFooter className="text-muted" />
  </Card>
);
