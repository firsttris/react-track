import { ApolloProps, withApollo } from 'components/hoc/WithApollo';
import { PublicHolidayWidget } from 'components/Leave/PublicHolidayWidget/PublicHolidayWidget';
import { WorkDaySettings } from 'components/Settings/WorkDaySettings';
import * as React from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import { PauseWidget } from './Pause/PauseWidget';

export class SettingsPage extends React.Component<WrappedComponentProps & RouteComponentProps<{}> & ApolloProps, {}> {
  render(): JSX.Element {
    return (
      <Container fluid={true}>
        <Row>
          <Col lg={6} xs={12} className="pt-3">
            <PauseWidget apollo={this.props.apollo} />
            <WorkDaySettings intl={this.props.intl} apollo={this.props.apollo} />
          </Col>
          <Col lg={6} xs={12} className="pt-3">
            <PublicHolidayWidget apollo={this.props.apollo} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export const SettingsPageContainer = withApollo(withRouter(injectIntl(SettingsPage)));
