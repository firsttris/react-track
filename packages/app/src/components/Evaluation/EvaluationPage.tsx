import { ApolloProps, withApollo } from 'components/hoc/WithApollo';
import { LoadingSpinner } from 'components/Spinner/LoadingSpinner';
import { API_DATE } from 'common/constants';
import { initialUserState } from 'common/initialState';
import * as moment from 'moment';
import * as React from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import { RouteComponentProps } from 'react-router-dom';
import { Container } from 'reactstrap';
import { GraphQLError } from 'graphql';
import * as t from 'common/types';
import { EvaluationTable } from './EvaluationTable';
import { MonthAndYearPickerWidget } from './MonthAndYearPickerWidget';
import { GraphQLErrorMessage } from 'components/Error/GraphQLErrorMessage';

interface Props extends RouteComponentProps<{ userId: string }>, ApolloProps, WrappedComponentProps {}

interface State {
  listOfEvaluation: t.Evaluation[];
  selectedUser: t.User;
  errors: readonly GraphQLError[];
}

export class EvaluationPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      listOfEvaluation: [],
      selectedUser: initialUserState,
      errors: []
    };
  }

  componentDidMount() {
    const userId = this.props.match.params.userId;
    this.props.apollo.getUserById(userId).then(result => {
      if (result.data) {
        this.setState({ selectedUser: result.data.getUserById });
      }
    });
    this.getEvaluationForMonth(userId, moment().format(API_DATE));
  }

  componentWillUnmount() {
    this.setState({ listOfEvaluation: [] });
  }

  getEvaluationForMonth(userId: string, date: string) {
    this.props.apollo.getEvaluationForMonth(userId, date).then(result => {
      if (result.data) {
        this.setState({ listOfEvaluation: result.data.getEvaluationForMonth });
      }
      if (result.errors) {
        this.setState({ errors: result.errors });
      } else {
        this.setState({ errors: [] });
      }
    });
  }

  handleChange = (date: moment.Moment) => {
    this.setState({ listOfEvaluation: [], errors: [] });
    const userId = this.props.match.params.userId;
    this.getEvaluationForMonth(userId, moment(date).format(API_DATE));
  };

  render(): JSX.Element {
    return (
      <Container fluid={true} className="pt-3">
        <MonthAndYearPickerWidget onChange={this.handleChange} className="d-print-none" />
        {!!this.state.listOfEvaluation.length && (
          <EvaluationTable
            intl={this.props.intl}
            userName={this.state.selectedUser.name}
            listOfEvaluation={this.state.listOfEvaluation}
            className="mt-3"
          />
        )}
        {!!this.state.errors.length && <GraphQLErrorMessage errors={this.state.errors} />}
        {!this.state.listOfEvaluation.length && !this.state.errors && <LoadingSpinner />}
      </Container>
    );
  }
}

export const EvaluationPageContainer = withApollo(injectIntl(EvaluationPage));
