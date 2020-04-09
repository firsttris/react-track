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

interface State {
  toggleModal: boolean;
}

export class MonthAndYearPickerWidget extends React.Component<Props, State> {
  render(): JSX.Element {
    return (
      <Card className={this.props.className}>
        <CardHeader>
          <FormattedMessage id="SELECT_DATE" />
        </CardHeader>
        <CardBody>
          <MonthAndYearPicker
            onChange={this.props.onChange}
            showLabels={true}
            showMonth={true}
            selectedDate={this.props.selectedDate}
          />
        </CardBody>
        <CardFooter className="text-muted" />
      </Card>
    );
  }
}
