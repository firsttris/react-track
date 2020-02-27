import { ApolloProps } from 'components/hoc/WithApollo';
import * as React from 'react';
import { FormattedMessage, WrappedComponentProps } from 'react-intl';
import { Card, CardBody, CardFooter, CardHeader, FormGroup, Input, Label } from 'reactstrap';
import * as t from 'types';

interface Props extends WrappedComponentProps, ApolloProps {}

interface State {
  workTimeSettings: t.WorkTimeSettings;
}

export class WorkDaySettings extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      workTimeSettings: {
        holiday: t.WorkDayPaymentType.Unpaid,
        publicHoliday: t.WorkDayPaymentType.Unpaid,
        schoolday: t.WorkDayPaymentType.Unpaid,
        sickday: t.WorkDayPaymentType.Unpaid
      }
    };
  }

  componentDidMount() {
    this.props.apollo.getWorkTimeSettings().then(result => {
      if (result.data) {
        this.setState({ workTimeSettings: result.data.getWorkTimeSettings });
      }
    });
  }

  render(): JSX.Element {
    return (
      <Card className="mt-3">
        <CardHeader>
          <FormattedMessage id="WORKDAY_SETTINGS" />
        </CardHeader>
        <CardBody>
          <FormGroup>
            <Label for="publicHoliday">
              <FormattedMessage id="PUBLIC_HOLIDAYS" />
            </Label>
            <Input
              type="select"
              name="publicHoliday"
              id="publicHoliday"
              value={this.state.workTimeSettings.publicHoliday}
              onChange={this.handleInputChange}
            >
              <option value={t.WorkDayPaymentType.Paid}>{this.props.intl.messages.Paid}</option>
              <option value={t.WorkDayPaymentType.Unpaid}>{this.props.intl.messages.Unpaid}</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="schoolday">
              <div>
                <FormattedMessage id="SCHOOL" />
              </div>
            </Label>
            <Input
              type="select"
              name="schoolday"
              id="schoolday"
              value={this.state.workTimeSettings.schoolday}
              onChange={this.handleInputChange}
            >
              <option value={t.WorkDayPaymentType.Paid}>{this.props.intl.messages.Paid}</option>
              <option value={t.WorkDayPaymentType.Unpaid}>{this.props.intl.messages.Unpaid}</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="holiday">
              <FormattedMessage id="HOLIDAY" />
            </Label>
            <Input
              type="select"
              name="holiday"
              id="holiday"
              value={this.state.workTimeSettings.holiday}
              onChange={this.handleInputChange}
            >
              <option value={t.WorkDayPaymentType.Paid}>{this.props.intl.messages.Paid}</option>
              <option value={t.WorkDayPaymentType.Unpaid}>{this.props.intl.messages.Unpaid}</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="sickday">
              <FormattedMessage id="SICK" />
            </Label>
            <Input
              type="select"
              name="sickday"
              id="sickday"
              value={this.state.workTimeSettings.sickday}
              onChange={this.handleInputChange}
            >
              <option value={t.WorkDayPaymentType.Paid}>{this.props.intl.messages.Paid}</option>
              <option value={t.WorkDayPaymentType.Unpaid}>{this.props.intl.messages.Unpaid}</option>
            </Input>
          </FormGroup>
        </CardBody>
        <CardFooter className="text-muted text-right">
          <button type="button" className="btn btn-primary mr-2" onClick={this.handleSave}>
            <i className="fa fa-floppy-o" />
          </button>
        </CardFooter>
      </Card>
    );
  }

  handleSave = () => {
    this.props.apollo.UpdateWorkTimeSettings(this.state.workTimeSettings);
  };

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const state: any = { ...this.state };
    state.workTimeSettings[event.target.name] = value;
    this.setState(state);
  };
}
