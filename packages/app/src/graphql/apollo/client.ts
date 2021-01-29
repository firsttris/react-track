import ApolloClient, { InMemoryCache } from 'apollo-boost';
import * as t from 'common/types';

const token = localStorage.getItem('timetracking-login-token');

const url = process.env.NODE_ENV === 'production' ? window.location.host : window.location.hostname + ':3001';

export const client = new ApolloClient({
  uri: `${window.location.protocol}//${url}/graphql`,
  headers: {
    authorization: token ? token : ''
  },
  cache: new InMemoryCache()
});

export const loginUser = (password: string): Promise<t.User> => {
  return fetch(`${window.location.protocol}//${url}/api/login`, {
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
