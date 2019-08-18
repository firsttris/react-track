import { withProps } from 'components/hoc/WithProps';
import * as React from 'react';
import { SettingsCollection } from './../../collections/SettingsCollection';

interface Props {
  collection: typeof SettingsCollection;
}

interface States {
  url: string;
}

export class ConnectPage extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      url: ''
    };
  }

  componentDidMount(): void {
    this.setState(this.props.collection.get());
  }

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      url: event.target.value
    });
  };

  cancel = (): void => {
    this.setState(this.props.collection.get());
  };

  save = (): void => {
    this.props.collection.setUrl(this.state.url);
    location.reload();
  };

  render(): JSX.Element {
    return (
      <div className="container pt-3">
        <div className="form-group">
          <label className="col-form-label pb-0">Server URL</label>
          <input className="form-control" value={this.state.url} name="url" onChange={this.handleInputChange} />
        </div>
        <form className="form-inline pt-2">
          <button type="button" className="btn btn-primary mr-2" onClick={this.save}>
            Save and Reload
          </button>
          <button type="button" className="btn btn-secondary" onClick={this.cancel}>
            Cancel
          </button>
        </form>
      </div>
    );
  }
}

export const ConnectPageContainer = withProps(ConnectPage, { collection: SettingsCollection });
