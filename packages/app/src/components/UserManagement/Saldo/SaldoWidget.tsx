import { GraphQLErrorMessage } from 'components/Error/GraphQLErrorMessage';
import { GraphQLError } from 'graphql';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Card, CardBody, CardFooter, CardHeader, Table } from 'reactstrap';
import * as t from 'types';
import { SaldoWidgetCreateModal } from './SaldoWidgetCreateModal';
import { SaldoWidgetItem } from './SaldoWidgetItem';

interface Props {
  user: t.User;
  errors: readonly GraphQLError[];
  onUpdateSaldo: (saldos: t.Saldo[]) => void;
}

interface State {
  isPopupOpen: boolean;
}

export class SaldoWidget extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isPopupOpen: false
    };
  }

  removeRow = (index: number): void => {
    const saldoList = this.props.user.saldos.slice();
    saldoList.splice(index, 1);
    this.props.onUpdateSaldo(saldoList);
  };

  handleToggleModal = (): void => {
    this.setState({ isPopupOpen: !this.state.isPopupOpen });
  };

  render(): JSX.Element {
    return (
      <div className="container">
        <SaldoWidgetCreateModal
          saldoList={this.props.user.saldos}
          isOpen={this.state.isPopupOpen}
          onToggle={this.handleToggleModal}
          onUpdate={this.props.onUpdateSaldo}
        />
        <Card className="mt-3">
          <CardHeader>
            <FormattedMessage id="SALDO" />
          </CardHeader>
          <CardBody>
            {!!this.props.user.saldos.length && (
              <div className="table-responsive" style={{ overflowY: 'auto', maxHeight: 685 }}>
                <Table>
                  <thead>
                    <tr>
                      <th>
                        <FormattedMessage id="YEAR" />
                      </th>
                      <th>
                        <FormattedMessage id="COMMENT" />
                      </th>
                      <th className="text-right">
                        <FormattedMessage id="HOURS" />
                      </th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.user.saldos.map((saldo, index) => (
                      <SaldoWidgetItem key={index} index={index} saldo={saldo} onClick={this.removeRow} />
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </CardBody>
          <CardFooter className="text-muted">
            <Button onClick={this.handleToggleModal}>
              <i className="fa fa-plus" />
            </Button>
            <GraphQLErrorMessage errors={this.props.errors} />
          </CardFooter>
        </Card>
      </div>
    );
  }
}
