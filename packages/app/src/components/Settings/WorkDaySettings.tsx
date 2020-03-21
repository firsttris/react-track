import { ApolloProps } from 'components/hoc/WithApollo';
import * as React from 'react';
import { GraphQLError } from 'graphql';
import { FormattedMessage, WrappedComponentProps } from 'react-intl';
import { Card, CardBody, CardFooter, CardHeader, FormGroup, Input, Label } from 'reactstrap';
import * as t from 'common/types';
import { GraphQLErrorMessage } from 'components/Error/GraphQLErrorMessage';

interface Props extends WrappedComponentProps, ApolloProps {}

interface State {
  workTimeSettings: t.WorkTimeSettings;
  errors: readonly GraphQLError[];
}

export class WorkDaySettings extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      workTimeSettings: {
        holiday: t.WorkDayPaymentType.UNPAID,
        publicHoliday: t.WorkDayPaymentType.UNPAID,
        schoolday: t.WorkDayPaymentType.UNPAID,
        sickday: t.WorkDayPaymentType.UNPAID
      },
      errors: []
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
              <option value={t.WorkDayPaymentType.PAID}>{this.props.intl.messages.PAID}</option>
              <option value={t.WorkDayPaymentType.UNPAID}>{this.props.intl.messages.UNPAID}</option>
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
              <option value={t.WorkDayPaymentType.PAID}>{this.props.intl.messages.PAID}</option>
              <option value={t.WorkDayPaymentType.UNPAID}>{this.props.intl.messages.UNPAID}</option>
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
              <option value={t.WorkDayPaymentType.PAID}>{this.props.intl.messages.PAID}</option>
              <option value={t.WorkDayPaymentType.UNPAID}>{this.props.intl.messages.UNPAID}</option>
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
              <option value={t.WorkDayPaymentType.PAID}>{this.props.intl.messages.PAID}</option>
              <option value={t.WorkDayPaymentType.UNPAID}>{this.props.intl.messages.UNPAID}</option>
            </Input>
          </FormGroup>
        </CardBody>
        <CardFooter className="text-muted text-right">
          <button type="button" className="btn btn-primary mr-2" onClick={this.handleSave}>
            <i className="fa fa-floppy-o" />
          </button>
          <GraphQLErrorMessage errors={this.state.errors} />
        </CardFooter>
      </Card>
    );
  }

  handleSave = () => {
    this.props.apollo.UpdateWorkTimeSettings(this.state.workTimeSettings).then(result => {
      if (result.errors) {
        this.setState({ errors: result.errors });
      } else {
        this.setState({ errors: [] });
      }
    });
  };

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const state: any = { ...this.state };
    state.workTimeSettings[event.target.name] = value;
    this.setState(state);
  };
}
