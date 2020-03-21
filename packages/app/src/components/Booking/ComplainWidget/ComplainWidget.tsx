import { GraphQLErrorMessage } from 'components/Error/GraphQLErrorMessage';
import { GraphQLError } from 'graphql';
import * as moment from 'moment';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Card, CardBody, CardFooter, CardHeader, Table } from 'reactstrap';
import * as t from 'common/types';
import { ComplainWidgetCreateModal } from './ComplainWidgetCreateModal';
import { ComplainWidgetItem } from './ComplainWidgetItem';
declare let MOCKLOGIN: boolean;

interface Props {
  selectedDate: moment.Moment;
  complains: t.Complain[];
  complainsErrors: readonly GraphQLError[];
  onUpdateComplains: (complains: t.Complain[]) => void;
  showData: boolean;
  userRole: string;
}

interface State {
  isPopupOpen: boolean;
}

export class ComplainWidget extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isPopupOpen: false
    };
  }

  removeRow = (index: number): void => {
    const complains = this.props.complains.slice();
    complains.splice(index, 1);
    this.props.onUpdateComplains(complains);
  };

  toggleModal = (): void => {
    const value = !this.state.isPopupOpen;
    this.setState({ isPopupOpen: value });
  };

  render(): JSX.Element {
    if (this.props.showData) {
      return (
        <div>
          <ComplainWidgetCreateModal
            complains={this.props.complains}
            isOpen={this.state.isPopupOpen}
            toggleModal={this.toggleModal}
            updateComplains={this.props.onUpdateComplains}
          />
          <Card className="mt-3">
            <CardHeader>
              <FormattedMessage id="COMPLAINS" />
            </CardHeader>
            <CardBody>
              {!!this.props.complains.length && (
                <div className="table-responsive" style={{ overflowY: 'auto', maxHeight: 685 }}>
                  <Table>
                    <thead>
                      <tr>
                        <th>
                          <FormattedMessage id="REASON" />
                        </th>
                        <th className="text-right">
                          <FormattedMessage id="HOURS" />
                        </th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {this.props.complains.map((complain, index) => {
                        return (
                          <ComplainWidgetItem
                            key={index}
                            index={index}
                            complain={complain}
                            onDelete={this.removeRow}
                            userRole={this.props.userRole}
                          />
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              )}
            </CardBody>
            <CardFooter className="text-muted">
              {this.props.userRole === (t.UserRole.ADMIN || MOCKLOGIN) && (
                <Button onClick={this.toggleModal}>
                  <i className="fa fa-plus" />
                </Button>
              )}
              <GraphQLErrorMessage errors={this.props.complainsErrors} />
            </CardFooter>
          </Card>
        </div>
      );
    } else {
      return <div />;
    }
  }
}
