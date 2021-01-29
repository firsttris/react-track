import * as React from 'react';
import 'react-day-picker/lib/style.css';
import { WrappedComponentProps } from 'react-intl';
import { Input } from 'reactstrap';

interface Props extends WrappedComponentProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export class DayTypePicker extends React.Component<Props, {}> {
  render(): JSX.Element {
    return (
      <Input type="select" onChange={this.props.onChange}>
        <option value={8} label={'8 Stunden'} />
        <option value={6} label={'6 Stunden'} />
        <option value={4} label={'4 Stunden'} />
        <option value={2} label={'2 Stunden'} />
      </Input>
    );
  }
}
