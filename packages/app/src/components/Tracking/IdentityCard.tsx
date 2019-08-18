import * as React from 'react';
import { Card, CardBody, CardHeader, Container } from 'reactstrap';
import * as t from 'types';
import { TimeStampStatus } from './TimeStampStatus';

interface Props {
  timestamp: t.Timestamp;
  timeLeft: string;
  yearSaldo: string;
  user: t.User;
}

export const IdentityCard = (props: Props) => (
  <Container className="p-4">
    <Card className="col-lg-6 col-md-12 col-xs-12 p-0 m-auto">
      <CardHeader>
        <i className="fa fa-id-card pr-2" /> {props.user.id}
      </CardHeader>
      <CardBody>
        <h1>{props.user.name}</h1>
        <TimeStampStatus timestamp={props.timestamp} hoursToday={props.timeLeft} saldo={props.yearSaldo} />
      </CardBody>
    </Card>
  </Container>
);
