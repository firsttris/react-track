import * as React from 'react';
import { Apollo } from './../../graphql';
const apollo = { apollo: Apollo };

export interface ApolloProps {
  apollo: typeof Apollo;
}

export function withApollo<P>(Comp: React.ComponentClass<P> | React.StatelessComponent<P>): React.ComponentClass<P> {
  return class extends React.Component<P, {}> {
    render(): JSX.Element {
      return <Comp {...this.props} {...apollo} {...this.state} />;
    }
  };
}

export const useApollo = () => {
  return apollo.apollo;
};
