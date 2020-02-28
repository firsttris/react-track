import { GraphQLErrorMessage } from 'components/Error/GraphQLErrorMessage';
import { ApolloProps } from 'components/hoc/WithApollo';
import { GraphQLError } from 'graphql';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Card, CardBody, CardFooter, CardHeader, Table } from 'reactstrap';
import * as t from 'common/types';
import { PauseWidgetCreateModal } from './PauseWidgetCreateModal';
import { PauseWidgetItem } from './PauseWidgetItem';

type Props = ApolloProps;

interface State {
  isOpen: boolean;
  pauses: t.Pause[];
  errors: readonly GraphQLError[];
}

export class PauseWidget extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isOpen: false,
      pauses: [],
      errors: []
    };
  }

  componentDidMount(): void {
    this.props.apollo.getPauses().then(result => {
      if (result.data) {
        this.setState({ pauses: result.data.getPauses });
      }
      if (result.errors) {
        this.setState({ errors: result.errors });
      }
    });
  }

  toggleModal = (): void => {
    const value = !this.state.isOpen;
    this.setState({ isOpen: value });
  };

  createPause = (time: string, durationInMinutes: string): void => {
    const newPause: t.PauseInput = {
      time,
      durationInMinutes
    };
    this.props.apollo.createPause(newPause).then(result => {
      if (result.data) {
        this.setState({ pauses: result.data.createPause });
      }
      if (result.errors) {
        this.setState({ errors: result.errors });
      }
    });
    this.setState({ isOpen: !this.state.isOpen });
  };

  deletePause = (pauseId: string): void => {
    this.props.apollo.deletePause(pauseId).then(result => {
      if (result.data) {
        this.setState({ pauses: result.data.deletePause });
      }
      if (result.errors) {
        this.setState({ errors: result.errors });
      }
    });
  };

  render(): JSX.Element {
    return (
      <Card>
        <CardHeader>
          <FormattedMessage id="BREAKS" />
        </CardHeader>
        <CardBody className="table-responsive">
          <Table>
            <thead>
              <tr>
                <th>
                  <FormattedMessage id="FROM2" /> <FormattedMessage id="HOUR" />
                </th>
                <th>
                  <FormattedMessage id="MINUTES_PAUSE" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {this.state.pauses.map((pause, index) => {
                return <PauseWidgetItem key={index} pause={pause} onClick={this.deletePause} />;
              })}
            </tbody>
          </Table>
        </CardBody>
        <CardFooter className="text-muted">
          <Button onClick={this.toggleModal}>
            <i className="fa fa-plus" />
          </Button>
          <GraphQLErrorMessage errors={this.state.errors} />
        </CardFooter>
        <PauseWidgetCreateModal
          isOpen={this.state.isOpen}
          toggleModal={this.toggleModal}
          saveModal={this.createPause}
        />
      </Card>
    );
  }
}
