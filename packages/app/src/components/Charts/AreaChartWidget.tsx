import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface Props {
  data: any;
  dataKeyA: any;
  dataKeyB: any;
  name: string;
  handleBarClick: (date: any) => void;
}

interface State {}

export class AreaChartWidget extends React.Component<Props, State> {
  render(): JSX.Element {
    return (
      <Card>
        <CardHeader>
          <FormattedMessage id="HOURS_IN_MONTH" />
        </CardHeader>
        <CardBody>
          <ResponsiveContainer height={320}>
            <AreaChart data={this.props.data} style={{ marginLeft: '-20px', WebkitUserSelect: 'none' }}>
              <XAxis dataKey={this.props.dataKeyA} interval={0} />
              <YAxis ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} interval={0} allowDecimals={true} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area
                style={{ cursor: 'pointer' }}
                dataKey={this.props.dataKeyB}
                name={this.props.name}
                fill="#666666"
                onClick={this.props.handleBarClick}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>
    );
  }
}
