import { GraphQLErrorMessage } from 'components/Error/GraphQLErrorMessage';
import { CheckModal } from 'components/Modal/CheckModal';
import { GraphQLError } from 'graphql';
import { History } from 'history';
import * as React from 'react';
import { FormattedMessage, WrappedComponentProps } from 'react-intl';
import { Card, CardBody, CardFooter, CardHeader, FormGroup } from 'reactstrap';
import * as t from 'types';
import { WorkTimeWidgetItem } from './WorkTimeWidgetItem';

interface Props extends WrappedComponentProps {
  user: t.User;
  errors: readonly GraphQLError[];
  history: History;
  onChange: (workTimes: t.WorkTimes) => void;
  onUpdateUserWorkTimes: () => void;
  onRewriteTimestamps: () => void;
  onUpdateAllUserWorkTimes: () => void;
  onCancel: () => void;
}

interface State {
  isSaving: boolean;
  isSavingModalOpen: boolean;
}

export class WorkTimeWidget extends React.Component<Props, State> {
  state = {
    isSaving: false,
    isSavingModalOpen: false
  };

  setWorkTimeForMonday = (workTime: t.WorkTime) => {
    const workTimes = { ...this.props.user.workTimes };
    workTimes.monday = workTime;
    this.props.onChange(workTimes);
  };

  setWorkTimeForTuesday = (workTime: t.WorkTime) => {
    const workTimes = { ...this.props.user.workTimes };
    workTimes.tuesday = workTime;
    this.props.onChange(workTimes);
  };

  setWorkTimeForWednesday = (workTime: t.WorkTime) => {
    const workTimes = { ...this.props.user.workTimes };
    workTimes.wednesday = workTime;
    this.props.onChange(workTimes);
  };

  setWorkTimeForThursday = (workTime: t.WorkTime) => {
    const workTimes = { ...this.props.user.workTimes };
    workTimes.thursday = workTime;
    this.props.onChange(workTimes);
  };

  setWorkTimeForFriday = (workTime: t.WorkTime) => {
    const workTimes = { ...this.props.user.workTimes };
    workTimes.friday = workTime;
    this.props.onChange(workTimes);
  };

  setWorkTimeForSaturday = (workTime: t.WorkTime) => {
    const workTimes = { ...this.props.user.workTimes };
    workTimes.saturday = workTime;
    this.props.onChange(workTimes);
  };

  setWorkTimeForSunday = (workTime: t.WorkTime) => {
    const workTimes = { ...this.props.user.workTimes };
    workTimes.sunday = workTime;
    this.props.onChange(workTimes);
  };

  isSaving = () => {
    this.setState({ isSaving: true }, () => setTimeout(() => this.setState({ isSaving: false }), 2500));
  };

  updateUserWorkTimes = () => {
    this.isSaving();
    this.props.onUpdateUserWorkTimes();
  };

  reWriteTimestamps = () => {
    this.isSaving();
    this.props.onRewriteTimestamps();
  };

  updateAllUserWorkTimes = () => {
    this.isSaving();
    this.props.onUpdateAllUserWorkTimes();
  };

  toggleIsSavingModal = () => {
    this.setState({ isSavingModalOpen: !this.state.isSavingModalOpen });
  };

  saveModal = () => {
    this.updateAllUserWorkTimes();
    this.toggleIsSavingModal();
  };

  render(): JSX.Element {
    return (
      <div className="container">
        <CheckModal
          isOpen={this.state.isSavingModalOpen}
          onToggle={this.toggleIsSavingModal}
          onSave={this.saveModal}
          text={this.props.intl.formatMessage({ id: 'SAVEALL' }) + ' ?'}
          header={this.props.intl.formatMessage({ id: 'AREYOUSURE' })}
        />
        <Card className="mt-3">
          <CardHeader>
            <FormattedMessage id="WORKTIME" />
            {this.state.isSaving && (
              <span className="badge badge-success float-right">
                <FormattedMessage id="SAVE" />
              </span>
            )}
          </CardHeader>
          <CardBody>
            <WorkTimeWidgetItem
              label="MONDAY"
              workTime={this.props.user.workTimes.monday}
              onUpdateWorkTime={this.setWorkTimeForMonday}
              intl={this.props.intl}
            />
            <WorkTimeWidgetItem
              label="TUESDAY"
              workTime={this.props.user.workTimes.tuesday}
              onUpdateWorkTime={this.setWorkTimeForTuesday}
              intl={this.props.intl}
            />
            <WorkTimeWidgetItem
              label="WEDNESDAY"
              workTime={this.props.user.workTimes.wednesday}
              onUpdateWorkTime={this.setWorkTimeForWednesday}
              intl={this.props.intl}
            />
            <WorkTimeWidgetItem
              label="THURSDAY"
              workTime={this.props.user.workTimes.thursday}
              onUpdateWorkTime={this.setWorkTimeForThursday}
              intl={this.props.intl}
            />
            <WorkTimeWidgetItem
              label="FRIDAY"
              workTime={this.props.user.workTimes.friday}
              onUpdateWorkTime={this.setWorkTimeForFriday}
              intl={this.props.intl}
            />
            <WorkTimeWidgetItem
              label="SATURDAY"
              workTime={this.props.user.workTimes.saturday}
              onUpdateWorkTime={this.setWorkTimeForSaturday}
              intl={this.props.intl}
            />
            <WorkTimeWidgetItem
              label="SUNDAY"
              workTime={this.props.user.workTimes.sunday}
              onUpdateWorkTime={this.setWorkTimeForSunday}
              intl={this.props.intl}
            />
            <GraphQLErrorMessage errors={this.props.errors} />
          </CardBody>
          <CardFooter className="text-muted">
            <FormGroup className="pt-2">
              <button
                type="button"
                title={this.props.intl.formatMessage({ id: 'SAVE' })}
                className="btn btn-primary mr-2"
                onClick={this.updateUserWorkTimes}
              >
                <i className="fa fa-floppy-o" />
              </button>
              <button
                type="button"
                title={this.props.intl.formatMessage({ id: 'SAVEALL' })}
                className="btn btn-primary mr-2"
                onClick={this.toggleIsSavingModal}
              >
                <i className="fa fa-hdd-o" />
              </button>
              <button
                type="button"
                title={this.props.intl.formatMessage({ id: 'REWRITE_TIMESTAMPS' })}
                className="btn btn-primary mr-2"
                onClick={this.reWriteTimestamps}
              >
                <i className="fa fa-ravelry" />
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
