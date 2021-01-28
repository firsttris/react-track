import { GraphQLErrorMessage } from 'components/Error/GraphQLErrorMessage';
import { API_DATE } from 'common/constants';
import { GraphQLError } from 'graphql';
import * as moment from 'moment';
import * as React from 'react';
/// <reference path="./day-picker-input.d.ts" />
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { FormattedMessage, WrappedComponentProps } from 'react-intl';
import { Card, CardBody, CardFooter, CardHeader, FormGroup, Input, Label } from 'reactstrap';
import * as t from 'common/types';
import { CodeInput } from './CodeInput';
import './DayPickerInput.css';

const MomentLocaleUtils = require('react-day-picker/moment');
const { formatDate, parseDate } = require('react-day-picker/moment');

interface Props {
  buttonName: string;
  errors: readonly GraphQLError[];
  user: t.User;
  onAction: () => void;
  onChange: (user: t.User) => void;
  onCancel: () => void;
}

interface States {
  isSaving: boolean;
}

export class User extends React.Component<Props & WrappedComponentProps, States> {
  state = {
    isSaving: false
  };

  getFormattedStartDate(props: Props & WrappedComponentProps) {
    return props.user.startDate ? formatDate(moment(props.user.startDate, API_DATE), 'L', props.intl.locale) : '';
  }

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const user: any = { ...this.props.user };
    user[event.target.name] = value;
    this.props.onChange(user);
  };

  handleStartDateChange = (selectedDay: Date) => {
    const user = this.props.user;
    user.startDate = selectedDay ? moment(selectedDay).format(API_DATE) : '';
    this.props.onChange(user);
  };

  onAction = () => {
    this.setState({ isSaving: true }, () => setTimeout(() => this.setState({ isSaving: false }), 2500));
    this.props.onAction();
  };

  render(): JSX.Element {
    return (
      <div className="container">
        <Card className="mt-3">
          <CardHeader>
            <FormattedMessage id="USER" />
            {this.state.isSaving && (
              <span className="badge badge-success float-right">
                <FormattedMessage id="SAVE" />
              </span>
            )}
          </CardHeader>
          <CardBody>
            <FormGroup>
              <Label for="name">
                <FormattedMessage id="NAME" />
              </Label>
              <Input value={this.props.user.name} name="name" id="name" onChange={this.handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="code">
                <FormattedMessage id="CODE" />
              </Label>
              <CodeInput code={this.props.user.code} onChange={this.handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label for="role">
                <FormattedMessage id="ROLE" />
              </Label>
              <Input type="select" name="role" id="role" value={this.props.user.role} onChange={this.handleInputChange}>
                <option value={t.UserRole.GUEST} label={this.props.intl.formatMessage({ id: t.UserRole.GUEST })} />
                <option value={t.UserRole.USER} label={this.props.intl.formatMessage({ id: t.UserRole.USER })} />
                <option value={t.UserRole.ADMIN} label={this.props.intl.formatMessage({ id: t.UserRole.ADMIN })} />
              </Input>
            </FormGroup>
            <FormGroup>
              <Label>
                <FormattedMessage id="START_DATE" />
              </Label>
              <div>
                <DayPickerInput
                  name="startDate"
                  clickUnselectsDay={true}
                  onDayChange={this.handleStartDateChange}
                  value={this.getFormattedStartDate(this.props)}
                  formatDate={formatDate}
                  parseDate={parseDate}
                  placeholder={`${formatDate(new Date(), 'L', this.props.intl.locale)}`}
                  dayPickerProps={{
                    locale: this.props.intl.locale,
                    localeUtils: MomentLocaleUtils
                  }}
                />
              </div>
            </FormGroup>
            <FormGroup style={{ marginLeft: '1.25rem' }}>
              <Input
                type="checkbox"
                name="isGpsRequired"
                id="isGpsRequired"
                checked={this.props.user.isGpsRequired ?? false}
                onChange={this.handleInputChange}
              />
              <Label for="isGpsRequired">
                <FormattedMessage id="GPS" />
              </Label>
            </FormGroup>
            <GraphQLErrorMessage errors={this.props.errors} />
          </CardBody>
          <CardFooter className="text-muted">
            <FormGroup className="pt-2">
              <button
                type="button"
                title={this.props.intl.formatMessage({ id: 'SAVE' })}
                className="btn btn-primary mr-2"
                onClick={this.onAction}
              >
                <i className="fa fa-floppy-o" />
              </button>
              <button
                type="button"
                title={this.props.intl.formatMessage({ id: 'CANCEL' })}
                className="btn btn-secondary"
                onClick={this.props.onCancel}
              >
                <i className="fa fa-arrow-left" />
              </button>
            </FormGroup>
          </CardFooter>
        </Card>
      </div>
    );
  }
}
