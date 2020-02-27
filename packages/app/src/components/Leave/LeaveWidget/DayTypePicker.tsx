import * as React from 'react';
import 'react-day-picker/lib/style.css';
import { WrappedComponentProps } from 'react-intl';
import { Input } from 'reactstrap';
import * as t from 'types';

interface Props extends WrappedComponentProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
}

export class DayTypePicker extends React.Component<Props, {}> {
  render(): JSX.Element {
    return (
      <Input type="select" name={this.props.name} onChange={this.props.onChange}>
        <option value={t.WorkDayType.FullDay} label={this.props.intl.formatMessage({ id: t.WorkDayType.FullDay })} />
        <option value={t.WorkDayType.HalfDay} label={this.props.intl.formatMessage({ id: t.WorkDayType.HalfDay })} />
      </Input>
    );
  }
}
