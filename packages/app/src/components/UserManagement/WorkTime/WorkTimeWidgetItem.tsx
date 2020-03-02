import * as React from 'react';
import { FormattedMessage, WrappedComponentProps } from 'react-intl';
import { Col, FormGroup, Input, Label, Row } from 'reactstrap';
import * as t from 'common/types';
import { WorkTimeWidgetCreateModal } from './WorkTimeWidgetCreateModal';

interface Props extends WrappedComponentProps {
  onUpdateWorkTime: (workTime: t.WorkTime) => void;
  label: string;
  workTime: t.WorkTime;
}

interface States {
  showWorkStartTimeModal: boolean;
  showWorkEndTimeModal: boolean;
  showMandatoryHoursModal: boolean;
}

export class WorkTimeWidgetItem extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showWorkStartTimeModal: false,
      showWorkEndTimeModal: false,
      showMandatoryHoursModal: false
    };
  }

  setWorkStartTime = (startTime: string): void => {
    const workTime = { ...this.props.workTime };
    workTime.startTime = startTime;
    this.props.onUpdateWorkTime(workTime);
  };

  setWorkEndTime = (endTime: string): void => {
    const workTime = { ...this.props.workTime };
    workTime.endTime = endTime;
    this.props.onUpdateWorkTime(workTime);
  };

  setMandatoryHours = (mandatoryHours: string): void => {
    const workTime = { ...this.props.workTime };
    workTime.mandatoryHours = mandatoryHours;
    this.props.onUpdateWorkTime(workTime);
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
          time={this.props.workTime.startTime}
          isOpen={this.state.showWorkStartTimeModal}
          toggleModal={this.toggleWorkStartTimeModal}
          onSave={this.setWorkStartTime}
        />
        <WorkTimeWidgetCreateModal
          header={'END_TIME'}
          time={this.props.workTime.endTime}
          isOpen={this.state.showWorkEndTimeModal}
          toggleModal={this.toggleWorkEndTimeModal}
          onSave={this.setWorkEndTime}
        />
        <WorkTimeWidgetCreateModal
          header={'TOTALHOURS'}
          time={this.props.workTime.mandatoryHours}
          isOpen={this.state.showMandatoryHoursModal}
          toggleModal={this.toggleMandatoryHoursModal}
          onSave={this.setMandatoryHours}
        />
        <Row>
          <Col xs="4">
            <Input
              title={this.props.intl.formatMessage({ id: 'START_TIME' })}
              style={{ cursor: 'pointer' }}
              value={this.props.workTime.startTime}
              name="startTime"
              onClick={this.toggleWorkStartTimeModal}
              readOnly={true}
            />
          </Col>
          <Col xs="4">
            <Input
              title={this.props.intl.formatMessage({ id: 'END_TIME' })}
              style={{ cursor: 'pointer' }}
              value={this.props.workTime.endTime}
              name="endTime"
              onClick={this.toggleWorkEndTimeModal}
              readOnly={true}
            />
          </Col>
          <Col xs="4">
            <Input
              title={this.props.intl.formatMessage({ id: 'TOTALHOURS' })}
              style={{ cursor: 'pointer' }}
              value={this.props.workTime.mandatoryHours}
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
