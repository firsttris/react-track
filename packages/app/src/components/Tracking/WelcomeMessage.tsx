import * as React from 'react';

const rfid = require('assets/rfid.png');

interface Props {
  onTab: () => void;
}

export const WelcomeMessage = (props: Props) => <img className="p-5" src={rfid} onClick={props.onTab} />;
