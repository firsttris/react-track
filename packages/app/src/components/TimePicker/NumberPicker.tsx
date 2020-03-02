import * as React from 'react';
import { Button, Input } from 'reactstrap';

interface Props {
  setNumber: (number: string) => void;
  max: number;
  number: string;
}

export class NumberPicker extends React.Component<Props, {}> {
  updateNumber = (evt: any): void => {
    let numberString = evt.target.value;
    if (numberString) {
      const number = parseInt(evt.target.value, 10);
      if (isNaN(number) || number < 0 || number > this.props.max) {
        return;
      }
      numberString = number.toString();
      if (number < 10) {
        numberString = 0 + numberString;
      }
    }
    this.props.setNumber(numberString);
  };

  addNumber = (): void => {
    let number = 0;
    let numberString = '00';
    if (this.props.number) {
      number = parseInt(this.props.number, 10);
      if (isNaN(number) || number === this.props.max) {
        return;
      }
      numberString = (number + 1).toString();
      if (number + 1 < 10) {
        numberString = 0 + numberString;
      }
    }
    this.props.setNumber(numberString);
  };

  removeNumber = (): void => {
    const number = parseInt(this.props.number, 10);
    let numberString = '00';
    if (isNaN(number) || number === 0) {
      return;
    }
    numberString = (number - 1).toString();
    if (number - 1 < 10) {
      numberString = 0 + numberString;
    }
    this.props.setNumber(numberString);
  };

  render(): JSX.Element {
    const inputStyle = { width: '45px', margin: 'auto' };
    return (
      <div className="text-center">
        <Button onClick={this.addNumber}>
          <i className="fa fa-chevron-up" />
        </Button>
        <Input
          type="text"
          className="my-2"
          value={this.props.number}
          name="minute"
          style={inputStyle}
          onChange={this.updateNumber}
        />
        <Button onClick={this.removeNumber}>
          <i className="fa fa-chevron-down" />
        </Button>
      </div>
    );
  }
}
