import { useApollo } from 'components/hoc/WithApollo';
import { LoadingSpinner } from 'components/Spinner/LoadingSpinner';
import { API_DATE } from 'common/constants';
import * as moment from 'moment';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { Container } from 'reactstrap';
import * as t from 'common/types';
import { EvaluationTable } from './EvaluationTable';
import { MonthAndYearPickerWidget } from './MonthAndYearPickerWidget';

export const UserEvaluationPage = () => {
  const [listOfUserEvaluation, setListOfUserEvaluation] = React.useState<t.UserEvaluation[]>([]);
  const [selectedDate, setSelectedDate] = React.useState<moment.Moment>();
  const intl = useIntl();
  const apollo = useApollo();

  const getEvaluationForUsers = (date: moment.Moment) => {
    apollo.getEvaluationForUsers(date.format(API_DATE)).then(result => {
      if (result.data) {
        setListOfUserEvaluation(result.data.getEvaluationForUsers);
      }
    });
  };

  React.useEffect(() => {
    getEvaluationForUsers(moment());
  }, []);

  const handleChange = (date: moment.Moment) => {
    setListOfUserEvaluation([]);
    setSelectedDate(date);
    getEvaluationForUsers(date);
  };

  return (
    <Container fluid={true} className="pt-3">
      <MonthAndYearPickerWidget
        onChange={handleChange}
        className="d-print-none"
        selectedDate={selectedDate?.toString()}
      />
      {!!listOfUserEvaluation.length &&
        listOfUserEvaluation.map((userEvaluation, index) => {
          return (
            <EvaluationTable
              key={index}
              intl={intl}
              userName={userEvaluation.userName}
              listOfEvaluation={userEvaluation.listOfEvaluation}
              className="mt-3"
            />
          );
        })}
      {!listOfUserEvaluation.length && <LoadingSpinner />}
    </Container>
  );
};
