import { BookingPageContainer } from 'components/Booking/BookingPage';
import { ConnectPageContainer } from 'components/Connect/ConnectPage';
import { EvaluationPageContainer } from 'components/Evaluation/EvaluationPage';
import { UserEvaluationPageContainer } from 'components/Evaluation/UserEvaluationPage';
import { ProtectedRoute } from 'components/hoc/ProtectedRoute';
import { LeavePageContainer } from 'components/Leave/LeavePage';
import { LoginPage } from 'components/Login/LoginPage';
import { NotFoundPage } from 'components/NotFoundPage';
import { SettingsPageContainer } from 'components/Settings/SettingsPage';
import { TrackingPageContainer } from 'components/Tracking/TrackingPage';
import { UserPageContainer } from 'components/UserManagement/Users/UsersPage';
import { UserTabPageContainer } from 'components/UserManagement/UserTabPage';
import * as React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import * as t from 'types';

const UserAndAdminRole = [t.UserRole.ADMIN, t.UserRole.USER];

const AdminRole = [t.UserRole.ADMIN];

class Router extends React.Component<{}, {}> {
  render() {
    return (
      <HashRouter>
        <div>
          <Switch>
            <Route path="/connect" component={ConnectPageContainer} />
            <Route path="/login" component={LoginPage} />
            <ProtectedRoute allowedRoles={UserAndAdminRole} exact={true} path="/" component={TrackingPageContainer} />
            <ProtectedRoute allowedRoles={AdminRole} path="/users" component={UserPageContainer} />
            <ProtectedRoute allowedRoles={AdminRole} path="/settings" component={SettingsPageContainer} />
            <ProtectedRoute allowedRoles={AdminRole} path="/createUser/:tab" component={UserTabPageContainer} />
            <ProtectedRoute allowedRoles={AdminRole} path="/updateUser/:userId/:tab" component={UserTabPageContainer} />
            <ProtectedRoute
              allowedRoles={UserAndAdminRole}
              path="/bookings/:userId/:date"
              component={BookingPageContainer}
            />
            <ProtectedRoute allowedRoles={AdminRole} path="/holidays/:userId" component={LeavePageContainer} />
            <ProtectedRoute
              allowedRoles={UserAndAdminRole}
              path="/evaluation/:userId"
              component={EvaluationPageContainer}
            />
            <ProtectedRoute allowedRoles={AdminRole} path="/evaluations" component={UserEvaluationPageContainer} />
            <Route component={NotFoundPage} />
          </Switch>
        </div>
      </HashRouter>
    );
  }
}

export default Router;
