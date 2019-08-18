import ApolloClient, { InMemoryCache } from 'apollo-boost';
import * as t from 'types';
import { SettingsCollection } from './../../collections/SettingsCollection';

const url = SettingsCollection.get().url;

const token = localStorage.getItem('timetracking-login-token');

export const client = new ApolloClient({
  uri: `http://${url}:3001/graphql`,
  headers: {
    authorization: token ? token : ''
  },
  cache: new InMemoryCache()
});

export const loginUser = (password: string): Promise<t.User> => {
  return fetch(`http://${url}:3001/login`, {
    body: JSON.stringify({ password }),
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(result => {
    if (!result.ok) {
      throw new Error(result.statusText);
    }
    return result.json();
  });
};
