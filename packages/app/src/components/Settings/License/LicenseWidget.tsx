import { GraphQLErrorMessage } from 'components/Error/GraphQLErrorMessage';
import { ApolloProps } from 'components/hoc/WithApollo';
import { GraphQLError } from 'graphql';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Card, CardBody, CardFooter, CardHeader, Table, Button } from 'reactstrap';
import * as t from 'common/types';
import { LicenseWidgetAddModal } from './LicenseWidgetAddModal';

type Props = ApolloProps;

interface State {
  license: t.License;
  errors: readonly GraphQLError[];
  isModalOpen: boolean;
}

export class LicenseWidget extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      license: {
        key: '',
        validUntil: '',
        userLimit: ''
      },
      errors: [],
      isModalOpen: false
    };
  }

  componentDidMount(): void {
    this.props.apollo.getLicense().then(result => {
      if (result.data) {
        this.setState({ license: result.data.getLicense });
      }
      if (result.errors) {
        this.setState({ errors: result.errors });
      }
    });
  }

  toggleModal = (): void => {
    const isModalOpen = !this.state.isModalOpen;
    this.setState({ isModalOpen });
  };

  addLicense = (key: string): void => {
    this.props.apollo.addLicense(key).then(result => {
      if (result.data) {
        this.setState({ license: result.data.addLicense, errors: [] });
      }
      if (result.errors) {
        this.setState({ errors: result.errors });
      }
    });
  };

  render(): JSX.Element {
    return (
      <Card className="mt-3">
        <CardHeader>
          <FormattedMessage id="LICENSE" />
        </CardHeader>
        <CardBody className="table-responsive">
          <Table>
            <tbody>
              <tr>
                <th scope="row">
                  <FormattedMessage id="KEY" />
                </th>
                <td className="text-right">{this.state.license.key}</td>
              </tr>
              <tr>
                <th scope="row">
                  <FormattedMessage id="VALID_UNTIL" />
                </th>
                <td className="text-right">
                  {this.state.license.validUntil ? this.state.license.validUntil : <FormattedMessage id="UNLIMITED" />}
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <FormattedMessage id="USER_LIMIT" />
                </th>
                <td className="text-right">
                  {this.state.license.userLimit ? this.state.license.userLimit : <FormattedMessage id="UNLIMITED" />}
                </td>
              </tr>
            </tbody>
          </Table>
        </CardBody>
        <CardFooter className="text-muted">
          <Button onClick={this.toggleModal}>
            <i className="fa fa-plus" />
          </Button>
          <GraphQLErrorMessage errors={this.state.errors} />
        </CardFooter>
        <LicenseWidgetAddModal
          isOpen={this.state.isModalOpen}
          toggleModal={this.toggleModal}
          saveModal={this.addLicense}
        />
      </Card>
    );
  }
}
