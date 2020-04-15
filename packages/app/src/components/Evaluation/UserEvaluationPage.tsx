import { ApolloProps, withApollo } from 'components/hoc/WithApollo';
import { LoadingSpinner } from 'components/Spinner/LoadingSpinner';
import { API_DATE } from 'common/constants';
import * as moment from 'moment';
import * as React from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import { RouteComponentProps } from 'react-router-dom';
import { Container } from 'reactstrap';
import * as t from 'common/types';
import { EvaluationTable } from './EvaluationTable';
import { MonthAndYearPickerWidget } from './MonthAndYearPickerWidget';

interface Props extends RouteComponentProps<{}>, ApolloProps, WrappedComponentProps {}

interface State {
  listOfUserEvaluation: t.UserEvaluation[];
  selectedDate?: moment.Moment;
}

export class UserEvaluationPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      listOfUserEvaluation: []
    };
  }

  componentDidMount() {
    this.getEvaluationForUsers(moment().format(API_DATE));
  }

  getEvaluationForUsers(date: string) {
    this.props.apollo.getEvaluationForUsers(date).then(result => {
      if (result.data) {
        this.setState({ listOfUserEvaluation: result.data.getEvaluationForUsers });
      }
    });
  }

  componentWillUnmount() {
    this.setState({ listOfUserEvaluation: [] });
  }

  handleChange = (date: moment.Moment) => {
    this.setState({ listOfUserEvaluation: [] });
    this.getEvaluationForUsers(moment(date).format(API_DATE));
  };

  render(): JSX.Element {
    return (
      <Container fluid={true} className="pt-3">
        <MonthAndYearPickerWidget
          onChange={this.handleChange}
          className="d-print-none"
          selectedDate={this.state.selectedDate?.toString()}
        />
        {!!this.state.listOfUserEvaluation.length &&
          this.state.listOfUserEvaluation.map((userEvaluation, index) => {
            return (
              <EvaluationTable
                key={index}
                intl={this.props.intl}
                userName={userEvaluation.userName}
                listOfEvaluation={userEvaluation.listOfEvaluation}
                className="mt-3"
              />
            );
          })}
        {!this.state.listOfUserEvaluation.length && <LoadingSpinner />}
      </Container>
    );
  }
}

export const UserEvaluationPageContainer = withApollo(injectIntl(UserEvaluationPage));
