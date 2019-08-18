import * as React from 'react';
import { FormattedMessage, WrappedComponentProps } from 'react-intl';
import { Col, FormGroup, Input, Label, Row } from 'reactstrap';
import * as t from 'types';
import { WorkTimeWidgetCreateModal } from './WorkTimeWidgetCreateModal';

interface Props extends WrappedComponentProps {
  onUpdateWorkTime: (workTime: t.WorkTime) => void;
  label: string;
  workTime: t.WorkTime;
}

interface States {
  workTime: t.WorkTime;
  showWorkStartTimeModal: boolean;
  showWorkEndTimeModal: boolean;
  showMandatoryHoursModal: boolean;
}

export class WorkTimeWidgetItem extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      workTime: props.workTime,
      showWorkStartTimeModal: false,
      showWorkEndTimeModal: false,
      showMandatoryHoursModal: false
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.workTime) {
      this.setState({ workTime: nextProps.workTime });
    }
  }

  setWorkStartTime = (startTime: string): void => {
    const workTime = { ...this.state.workTime };
    workTime.startTime = startTime;
    this.setState(
      {
        workTime,
        showWorkStartTimeModal: !this.state.showWorkStartTimeModal
      },
      () => this.props.onUpdateWorkTime(this.state.workTime)
    );
  };

  setWorkEndTime = (endTime: string): void => {
    const workTime = { ...this.state.workTime };
    workTime.endTime = endTime;
    this.setState(
      {
        workTime,
        showWorkEndTimeModal: !this.state.showWorkEndTimeModal
      },
      () => this.props.onUpdateWorkTime(this.state.workTime)
    );
  };

  setMandatoryHours = (mandatoryHours: string): void => {
    const workTime = { ...this.state.workTime };
    workTime.mandatoryHours = mandatoryHours;
    this.setState(
      {
        workTime,
        showMandatoryHoursModal: !this.state.showMandatoryHoursModal
      },
      () => this.props.onUpdateWorkTime(this.state.workTime)
    );
  };

  toggleWorkStartTimeModal = () => {
    this.setState({ showWorkStartTimeModal: !this.state.showWorkStartTimeModal });
  };

  toggleWorkEndTimeModal = () => {
    this.setState({ showWorkEndTimeModal: !this.state.showWorkEndTimeModal });
  };

  toggleMandatoryHoursModal = () => {
    this.setState({ showMandatoryHoursModal: !this.state.showMandatoryHoursModal });
  };

  render(): JSX.Element {
    return (
      <FormGroup>
        <Label>
          <FormattedMessage id={this.props.label} />
        </Label>
        <WorkTimeWidgetCreateModal
          header={'START_TIME'}
          time={this.state.workTime.startTime}
          isOpen={this.state.showWorkStartTimeModal}
          onToggle={this.toggleWorkStartTimeModal}
          onSave={this.setWorkStartTime}
        />
        <WorkTimeWidgetCreateModal
          header={'END_TIME'}
          time={this.state.workTime.endTime}
          isOpen={this.state.showWorkEndTimeModal}
          onToggle={this.toggleWorkEndTimeModal}
          onSave={this.setWorkEndTime}
        />
        <WorkTimeWidgetCreateModal
          header={'TOTALHOURS'}
          time={this.state.workTime.mandatoryHours}
          isOpen={this.state.showMandatoryHoursModal}
          onToggle={this.toggleMandatoryHoursModal}
          onSave={this.setMandatoryHours}
        />
        <Row>
          <Col xs="4">
            <Input
              title={this.props.intl.formatMessage({ id: 'START_TIME' })}
              style={{ cursor: 'pointer' }}
              value={this.state.workTime.startTime}
              name="startTime"
              onClick={this.toggleWorkStartTimeModal}
              readOnly={true}
            />
          </Col>
          <Col xs="4">
            <Input
              title={this.props.intl.formatMessage({ id: 'END_TIME' })}
              style={{ cursor: 'pointer' }}
              value={this.state.workTime.endTime}
              name="endTime"
              onClick={this.toggleWorkEndTimeModal}
              readOnly={true}
            />
          </Col>
          <Col xs="4">
            <Input
              title={this.props.intl.formatMessage({ id: 'TOTALHOURS' })}
              style={{ cursor: 'pointer' }}
              value={this.state.workTime.mandatoryHours}
              name="mandatoryHours"
              onClick={this.toggleMandatoryHoursModal}
              readOnly={true}
            />
          </Col>
        </Row>
      </FormGroup>
    );
  }
}
