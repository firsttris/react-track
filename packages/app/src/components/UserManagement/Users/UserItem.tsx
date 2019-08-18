import { CheckModal } from 'components/Modal/CheckModal';
import { API_DATE } from 'cons';
import * as moment from 'moment';
import * as React from 'react';
import { WrappedComponentProps } from 'react-intl';
import { Link } from 'react-router-dom';

interface Props extends WrappedComponentProps {
  user: { id: string; name: string };
  onClick: (id: string, index: number) => void;
  index: number;
}

interface States {
  isDeleteModalOpen: boolean;
}

export class UserItem extends React.Component<Props, States> {
  state = {
    isDeleteModalOpen: false
  };

  toggleModal = () => {
    this.setState({ isDeleteModalOpen: !this.state.isDeleteModalOpen });
  };

  saveModal = () => {
    this.toggleModal();
    this.props.onClick(this.props.user.id, this.props.index);
  };

  render(): JSX.Element {
    return (
      <li className="list-group-item justify-content-between d-lg-flex d-sm-block align-items-center">
        <CheckModal
          onToggle={this.toggleModal}
          isOpen={this.state.isDeleteModalOpen}
          onSave={this.saveModal}
          text={this.props.intl.formatMessage({ id: 'DELETE_USER' })}
          header={this.props.intl.formatMessage({ id: 'AREYOUSURE' })}
        />
        <div>{this.props.user.name}</div>
        <div>
          <Link
            title={this.props.intl.formatMessage({ id: 'EVALUATION' })}
            className="btn btn-secondary mr-1"
            to={`evaluation/${this.props.user.id}`}
          >
            <i className="fa fa-line-chart" />
          </Link>
          <Link
            title={this.props.intl.formatMessage({ id: 'HOLIDAY' })}
            className="btn btn-secondary mr-1"
            to={`holidays/${this.props.user.id}`}
          >
            <i className="fa fa-sun-o" />
          </Link>
          <Link
            title={this.props.intl.formatMessage({ id: 'BOOKINGS' })}
            className="btn btn-secondary mr-1"
            to={`bookings/${this.props.user.id}/${moment().format(API_DATE)}`}
          >
            <i className="fa fa-book" />
          </Link>
          <Link
            title={this.props.intl.formatMessage({ id: 'EDIT' })}
            className="btn btn-secondary mr-1"
            to={`updateUser/${this.props.user.id}/user`}
          >
            <i className="fa fa-wrench" />
          </Link>
          <button
            title={this.props.intl.formatMessage({ id: 'DELETE' })}
            className="btn btn-secondary"
            onClick={this.toggleModal}
          >
            <i className="fa fa-trash-o" />
          </button>
        </div>
      </li>
    );
  }
}
