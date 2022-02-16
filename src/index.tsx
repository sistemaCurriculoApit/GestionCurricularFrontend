//importacion de dependencias
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { Router, Route, Switch, Redirect } from 'react-router-dom';

import Login from './layouts/Login';
import Admin from './layouts/Admin';
import Coordinador from './layouts/Coordinador';
import Docente from './layouts/Docente';
import Invitado from './layouts/Invitado';

import {userProfilesObject} from './constants/generalConstants';

import 'assets/css/material-dashboard-react.css?v=1.6.0';

const hist = createBrowserHistory();

//Inicio componente funcional En este se valida el rol logueado para retornar sus respectivos accesos
function IndexApp(props: any) {
  const [islogged, setIsLogged] = useState('');

  //Al iniciar el componente se valida si existe un token activo
  useEffect(() => {
    var activeSession = localStorage.getItem('token');
    setIsLogged(activeSession ? activeSession : '');
  });

  //Se obtinen las rutas o accesos segun el rol en sesion
  const getRouteByProfile = () => {
    var idProfile = localStorage.getItem('idProfileLoggedUser');
    switch (idProfile) {
      case userProfilesObject.admin.id.toString():
        return (

          <Switch>
            <Route path="/admin" component={Admin} />
            <Redirect to={'/admin/dashboard'} from={'/'} />
          </Switch>

        );
        break;
      case userProfilesObject.coor.id.toString():
        return (

          <Switch>
            <Route path="/coordinador" component={Coordinador} />
            <Redirect to={'/coordinador/actas'} from={'/'} />
          </Switch>

        );
        break;
      case userProfilesObject.doc.id.toString():
        return (

          <Switch>
            <Route path="/docente" component={Docente} />
            <Redirect to={'/docente/actas'} from={'/'} />
          </Switch>

        );
        break;

      default:
        return (
          <Switch>
            <Route path="/invitado" component={Invitado} />
            <Redirect to={'/invitado/micrositio'} from={'/'} />
          </Switch>
        );
        break;
    }
  }

  //Retorno de las rutas si existe sesión, de lo contrario direcciona al login
  return (
    <Router history={hist}>
      {
        islogged ?
          getRouteByProfile()
          :
          <Switch>
            <Route path="/login" component={Login} />
            <Redirect to={'/login'} from={'/'} />
          </Switch>
      }
    </Router>
  );
};

ReactDOM.render(<IndexApp />, document.getElementById('root'))

