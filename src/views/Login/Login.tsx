//importacion de dependencias y servicios
import React, { useState, useEffect } from "react";
import { createStyles } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Card from '@material-ui/core/Card';
import logoApit from 'assets/img/logoAPIT.png';
import jwt_decode from 'jwt-decode'
import {
  successColor,
  blackColor,
  whiteColor,
  hexToRgb
} from '../../assets/jss/material-dashboard-react';
import "../../assets/css/google-login-button.css"

import AlertComponent from '../../components/Alert/AlertComponent'
import ModalLoading from '../../components/ModalLoading/ModalLoading';
import { validateLogin } from "../../services/loginServices"

//Inicio componente funcional
function Login(props: any) {
  const document = window.document;
  //Declaración de variables y estados del componente
  const { classes } = props;
  const [openModalLoading, setOpenModalLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [severityAlert, setSeverityAlert] = useState('');
  const [messageAlert, setMessagesAlert] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const clientId: string = process.env.CLIENT_ID!

  const handleCallbackResponse = async (response: any) => {
    const user: any = jwt_decode(response.credential)
    await setEmail(user.email)
    await setPassword("google identity")
    setOpenModalLoading(true)
    setTimeout(() => {
      handleLogin(false, true)
    }, 2000);

  }

  useEffect(() => {
    google.accounts.id.initialize({
      client_id: "430408237878-50tskg6vp41l7aojrnajacckra4hnurb.apps.googleusercontent.com",
      callback: handleCallbackResponse
    })
    google.accounts.id.renderButton(
      document.getElementById("sign-in")!,
      { theme: "outline", size: "large", type: "standard" }
    )
  }, [])

  //Metodo que controla el inicio de sesion
  const handleLogin = (guest?: Boolean, googleIdentity?: Boolean) => {
    if (guest) {
      //Ingreso con el rol de invitado
      localStorage.setItem('token', '-1');
      localStorage.setItem('idProfileLoggedUser', '5');
      window.location.reload();
    } else {
      if ((email && password) || googleIdentity) {
        //Ingreso roles del sistema con credenciales
        let response: any = validateLogin({
          correo: email,
          contrasena: password,
          googleIdentity: googleIdentity
        });
        let { body } = response;
        debugger
        if (body && body.token) {
          //almacenamiento de token y del perfil logeado
          localStorage.setItem('token', body.token);
          localStorage.setItem('idProfileLoggedUser', body.user.rolId);
          localStorage.setItem('userEmail', body.user.correo);
          localStorage.setItem('userName', body.user.nombreUsuario);
          window.location.reload();
        } else {
          setSeverityAlert('error');
          setMessagesAlert(body && body.descripcion ? body.descripcion : 'Ha ocurrido al intentar iniciar sesion');
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
          }, 1000);
        }
      }
      else {
        setSeverityAlert('error');
        setMessagesAlert('Correo electrónico y contraseña son obligatorios');
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 1000);
      }

    }
    setOpenModalLoading(false);
  }

  //Retorno con todos la construcción de la interfaz del modulo
  return (
    <div className="App" >
      <AlertComponent severity={severityAlert} message={messageAlert} visible={showAlert} />
      <Card className={classes.cardLogin}>
        <form >
          <div className={classes.containerForm}>
            <img src={logoApit} className={classes.logoApitImg} />
            <div className={classes.containerFields}>
              <TextField
                id="outlined-email"
                label="Correo electrónico"
                variant="outlined"
                margin="dense"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <TextField
                id="outlined-password"
                label="Contraseña"
                variant="outlined"
                margin="dense"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />

              <Button type="button" variant="contained" className={classes.loginButton} onClick={() => { setOpenModalLoading(true); handleLogin() }}>
                Iniciar sesión
              </Button>

              <a onClick={() => { setOpenModalLoading(true); handleLogin(true) }} className={classes.a}>
                Ingresar cómo invitado
              </a>
              <div id="sign-in__container">
                <p className="horizontal-row"> ────────────────────── </p>
                <div id="sign-in"></div>
              </div>

            </div>
          </div>
        </form>

      </Card>
      <ModalLoading showModal={openModalLoading} />
    </div>
  );
}

//Estilos del modulo
const styles = createStyles({
  cardLogin: {
    padding: '10px',
    backgroundColor: '#ffffffba'
  },
  containerForm: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerFields: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  loginButton: {
    marginTop: '15px',
    backgroundColor: successColor[0],
    color: whiteColor,
    boxShadow:
      '0 12px 20px -10px rgba(' +
      hexToRgb(successColor[0]) +
      ',.28), 0 4px 20px 0 rgba(' +
      hexToRgb(blackColor) +
      ',.12), 0 7px 8px -5px rgba(' +
      hexToRgb(successColor[0]) +
      ',.2)',
    '&:hover': {
      backgroundColor: successColor[0],
      boxShadow:
        '0 12px 20px -10px rgba(' +
        hexToRgb(successColor[0]) +
        ',.28), 0 4px 20px 0 rgba(' +
        hexToRgb(blackColor) +
        ',.12), 0 7px 8px -5px rgba(' +
        hexToRgb(successColor[0]) +
        ',.2)'
    }
  },
  logoApitImg: {
    width: '40%',
  },
  a: {
    fontSize: 20,
    fontWeight: 400,
    color: successColor[0], // color: primaryColor
    textDecoration: 'none',
    backgroundColor: 'transparent',
    marginTop: 15,
    marginBottom: 15,
    textAlign: 'center',
    cursor: 'pointer',
    '&:hover': {
      color: successColor[1],
    }
  },
});

export default withStyles(styles)(Login);

