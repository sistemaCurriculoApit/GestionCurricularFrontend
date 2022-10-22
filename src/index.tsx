import ReactDOM from 'react-dom';
import React, { useEffect, useState } from 'react';
import { createBrowserHistory } from 'history';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { userProfilesObject } from './constants/generalConstants';

import Login from './layouts/Login';
import Admin from './layouts/Admin';
import Coordinador from './layouts/Coordinador';
import Docente from './layouts/Docente';
import Invitado from './layouts/Invitado';
import Estudiante from './layouts/Estudiante';

import 'assets/css/material-dashboard-react.css?v=1.6.0';

const history = createBrowserHistory();

const App: React.FC = () => {
  const [token, Token] = useState<string>('');

  useEffect(() => {
    const activeSession = localStorage.getItem('token');
    Token(activeSession || '');
  }, []);

  const getRouteByProfile = () => {
    const idProfile = localStorage.getItem('idProfileLoggedUser');
    switch (idProfile) {
      case userProfilesObject.admin.id.toString():
        return (

          <Switch>
            <Route path="/admin" component={Admin} />
            <Redirect to={'/admin/dashboard'} from={'/'} />
          </Switch>

        );
      case userProfilesObject.coor.id.toString():
        return (

          <Switch>
            <Route path="/coordinador" component={Coordinador} />
            <Redirect to={'/coordinador/actas'} from={'/'} />
          </Switch>

        );
      case userProfilesObject.doc.id.toString():
        return (

          <Switch>
            <Route path="/docente" component={Docente} />
            <Redirect to={'/docente/avancesAsignatura'} from={'/'} />
          </Switch>

        );
      case userProfilesObject.est.id.toString():
        return (

          <Switch>
            <Route path="/estudiante" component={Estudiante} />
            <Redirect to={'/estudiante/homologacion'} from={'/'} />
          </Switch>

        );
      default:
        return (
          <Switch>
            <Route path="/invitado" component={Invitado} />
            <Redirect to={'/invitado/micrositio'} from={'/'} />
          </Switch>
        );
    }
  };

  return (
    <Router history={history}>
      {
        token ?
          getRouteByProfile()
          :
          (
            <Switch>
              <Route path="/login" component={Login} />
              <Redirect to={'/login'} from={'/'} />
            </Switch>
          )
      }
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
