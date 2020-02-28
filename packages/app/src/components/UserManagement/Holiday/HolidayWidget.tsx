import { GraphQLErrorMessage } from 'components/Error/GraphQLErrorMessage';
import { GraphQLError } from 'graphql';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Card, CardBody, CardFooter, CardHeader, Table } from 'reactstrap';
import * as t from 'common/types';
import { HolidayWidgetCreateModal } from './HolidayWidgetCreateModal';
import { HolidayWidgetItem } from './HolidayWidgetItem';

interface Props {
  user: t.User;
  errors: readonly GraphQLError[];
  onUpdateHoliday: (holiday: t.Holiday[]) => void;
}

interface State {
  isPopupOpen: boolean;
}

export class HolidayWidget extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isPopupOpen: false
    };
  }

  removeRow = (index: number): void => {
    const holidaysList = this.props.user.holidays.slice();
    holidaysList.splice(index, 1);
    this.props.onUpdateHoliday(holidaysList);
  };

  handleToggleModal = (): void => {
    this.setState({ isPopupOpen: !this.state.isPopupOpen });
  };

  render(): JSX.Element {
    return (
      <div className="container">
        <HolidayWidgetCreateModal
          holidayList={this.props.user.holidays}
          isOpen={this.state.isPopupOpen}
          onToggle={this.handleToggleModal}
          onUpdate={this.props.onUpdateHoliday}
        />
        <Card className="mt-3">
          <CardHeader>
            <FormattedMessage id="HOLIDAY" />
          </CardHeader>
          <CardBody>
            {!!this.props.user.holidays.length && (
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
                        <FormattedMessage id="DAYS" />
                      </th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.user.holidays.map((holiday, index) => (
                      <HolidayWidgetItem key={index} index={index} holiday={holiday} onClick={this.removeRow} />
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
