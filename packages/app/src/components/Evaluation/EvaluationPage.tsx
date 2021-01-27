import { useApollo } from 'components/hoc/WithApollo';
import { LoadingSpinner } from 'components/Spinner/LoadingSpinner';
import { API_DATE } from 'common/constants';
import { initialUserState } from 'common/initialState';
import * as moment from 'moment';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { Container } from 'reactstrap';
import * as t from 'common/types';
import { EvaluationTable } from './EvaluationTable';
import { MonthAndYearPickerWidget } from './MonthAndYearPickerWidget';

export const EvaluationPage = () => {
  const [listOfEvaluation, setListOfEvaluation] = React.useState<t.Evaluation[]>([]);
  const [selectedUser, setSelectedUser] = React.useState<t.User>(initialUserState);
  const [selectedDate, setSelectedDate] = React.useState<moment.Moment>();
  const intl = useIntl();
  const apollo = useApollo();
  const { userId } = useParams<{ userId: string }>();

  const getEvaluationForMonth = (date: moment.Moment) => {
    apollo.getEvaluationForMonth(userId, date.format(API_DATE)).then(result => {
      if (result.data) {
        setListOfEvaluation(result.data.getEvaluationForMonth);
      }
    });
  };

  React.useEffect(() => {
    apollo.getUserById(userId).then(result => {
      if (result.data) {
        setSelectedUser(result.data.getUserById);
      }
    });
    getEvaluationForMonth(moment());
  }, []);

  const handleChange = (date: moment.Moment) => {
    setListOfEvaluation([]);
    setSelectedDate(date);
    getEvaluationForMonth(date);
  };

  return (
    <Container fluid={true} className="pt-3">
      <MonthAndYearPickerWidget
        onChange={handleChange}
        className="d-print-none"
        selectedDate={selectedDate?.toISOString()}
      />
      {!!listOfEvaluation.length && (
        <EvaluationTable
          intl={intl}
          userName={selectedUser.name}
          listOfEvaluation={listOfEvaluation}
          className="mt-3"
        />
      )}
      {!listOfEvaluation.length && <LoadingSpinner />}
    </Container>
  );
};
