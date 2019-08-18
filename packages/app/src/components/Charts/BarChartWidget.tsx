import { CustomTooltip } from 'components/Charts/CustomTooltip';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Card, CardBody, CardHeader } from 'reactstrap';
const {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} = require('recharts');

interface Props {
  data: any;
  yDataKey: string;
  xDataKey: string;
  labelKey: string;
  name: string;
  handleBarClick: (date: any) => void;
}

export class BarChartWidget extends React.Component<Props, {}> {
  render(): JSX.Element {
    const customBar = (props: any) => {
      let { fill } = props;
      fill = props.hasError ? '#FF0000' : '#666666';
      const opacity = props.hasError ? '0.25' : '1';
      return <Rectangle {...props} fill={fill} fillOpacity={opacity} />;
    };

    return (
      <Card>
        <CardHeader>
          <FormattedMessage id="HOURS_IN_MONTH" />
        </CardHeader>
        <CardBody>
          <ResponsiveContainer height={500}>
            <BarChart data={this.props.data} style={{ marginLeft: '-20px', WebkitUserSelect: 'none' }}>
              <XAxis dataKey={this.props.xDataKey} interval={0} />
              <YAxis
                ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]}
                interval={0}
                allowDecimals={true}
              />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                style={{ cursor: 'pointer' }}
                dataKey={this.props.yDataKey}
                name={this.props.name}
                fill="#666666"
                onClick={this.props.handleBarClick}
                shape={customBar}
              >
                <LabelList dataKey={this.props.labelKey} position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>
    );
  }
}
