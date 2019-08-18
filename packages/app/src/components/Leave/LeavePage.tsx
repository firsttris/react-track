import { ApolloProps, withApollo } from 'components/hoc/WithApollo';
import { initialUserState } from 'initialState';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import * as t from 'types';
import { LeaveWidget } from './LeaveWidget/LeaveWidget';
import { PublicHolidayWidget } from './PublicHolidayWidget/PublicHolidayWidget';

interface Props extends RouteComponentProps<{ userId: string }>, ApolloProps {}

interface State {
  selectedUser: t.User;
}

class LeavePage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedUser: initialUserState
    };
  }

  componentDidMount(): void {
    this.props.apollo.getUserById(this.props.match.params.userId).then(result => {
      if (result.data) {
        this.setState({ selectedUser: result.data.getUserById });
      }
    });
  }

  render() {
    return (
      <Container fluid={true}>
        <Row>
          <Col lg={6} md={12} xs={12} className="pt-3">
            <LeaveWidget
              userId={this.props.match.params.userId}
              selectedUser={this.state.selectedUser}
              apollo={this.props.apollo}
            />
          </Col>
          <Col lg={6} md={12} xs={12} className="pt-3">
            <PublicHolidayWidget apollo={this.props.apollo} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export const LeavePageContainer = withApollo(LeavePage);
