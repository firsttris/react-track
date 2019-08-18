import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import * as React from 'react';
import 'react-day-picker/lib/style.css';
import { render } from 'react-dom';
import { hot } from 'react-hot-loader';
import { IntlProvider } from 'react-intl';
import './DayPicker.css';
import './graphql';
import { de_DE } from './i18n/de_DE';
import { en_US } from './i18n/en_US';
import Router from './router/Router';

const app = render(
  <IntlProvider locale={navigator.language} messages={navigator.language.includes('de') ? de_DE : en_US}>
    <Router />
  </IntlProvider>,
  document.getElementById('root')
);

export default Object.is(process.env.NODE_ENV, 'production') ? app : hot(module)(app);
