//importacion de dependencias y servicios
import React, { useEffect, useState } from 'react';
import MomentUtils from "@date-io/moment";
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import Modal from '@material-ui/core/Modal';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import Tooltip from '@material-ui/core/Tooltip';
import Search from '@material-ui/icons/Search';
import FilterList from '@material-ui/icons/FilterList';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import SendIcon from '@material-ui/icons/Send';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';
import CheckIcon from '@material-ui/icons/Check';
import moment from "moment";
import "moment/locale/es";

// core components
import { createStyles } from '@material-ui/core';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import Table from '../../components/Table/Table';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import Button from '../../components/CustomButtons/Button';
import TablePagination from '../../components/Pagination/TablePagination';
import ModalLoading from '../../components/ModalLoading/ModalLoading';
import AlertComponent from '../../components/Alert/AlertComponent'

//jss
import { CustomSearchTextField, CustomTextField } from '../../assets/jss/material-dashboard-react/components/customInputStyle'
import cardTabletCustomStyle from '../../assets/jss/material-dashboard-react/components/cardTabletCustomStyle'
import { containerFloatButton } from '../../assets/jss/material-dashboard-react/components/buttonStyle'
import tooltipStyle from '../../assets/jss/material-dashboard-react/tooltipStyle'
import { container, containerFormModal, containerFooterModal, modalForm } from '../../assets/jss/material-dashboard-react'
import checkboxAdnRadioStyle from '../../assets/jss/material-dashboard-react/checkboxAdnRadioStyle';


import { userProfilesArray, AnythingObject } from '../../constants/generalConstants'
import { getAllProgramas } from "../../services/programasServices"
import { getUserPaginated, createUser, updateUser } from "../../services/usersServices"

//Estilos generales usados en el modulo
const styles = createStyles({
  CustomSearchTextFieldStyle: CustomSearchTextField.input,
  CustomTextField: CustomTextField.input,
  container,
  containerFormModal,
  containerFooterModal,
  modalForm,
  ...cardTabletCustomStyle,
  ...tooltipStyle,
  ...containerFloatButton,
  ...checkboxAdnRadioStyle,
});

//Inicio componente funcional con sus rescpectivas propiedades si las hubiere
function Usuarios(props: any) {
  const { classes } = props;
  const openModalCreate = props.history.location.state ? props.history.location.state.openModalCreate : false;

  //Declaración de variables y estados del componente
  const [showAlert, setShowAlert] = useState(false);
  const [severityAlert, setSeverityAlert] = useState('');
  const [messageAlert, setMessagesAlert] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [openModalLoading, setOpenModalLoading] = useState(false);
  const [updatePassword, setUpdatePassword] = useState(false);
  const [openMoreFilters, setOpenMoreFilters] = useState(false);
  const [searchField, setSearchField] = useState('');
  const [dateCreationFrom, setDateCreationFrom] = useState<any>();
  const [dateCreationTo, setDateCreationTo] = useState<any>();
  const [userList, setUserList] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pagePagination, setPagePagination] = useState(1);
  const [programasList, setProgramasList] = useState([]);
  const [programaSelected, setProgramaSelected] = useState<AnythingObject>({});
  const [userObject, setUserObject] = useState<AnythingObject>({
    _id: '',
    name: '',
    email: '',
    role: { id: 0, title: '' },
    password: '',
    passwordConfirm: '',
    identificacionEstudiante: '',
    universidadEstudiante: '',
    programaEstudiante: ''
  });


  //Al iniciar el componente se obtienen los usuarios y si es redirección del dashboard se abre la modal de creacion
  useEffect(() => {
    setOpenModalLoading(true);
    getUsers();
    if (openModalCreate) {
      setOpenModal(true);
    }
  }, [])

  //Actualizacion de la lista de usuarios si el componente de busqueda es modificado
  useEffect(() => {
    if (!searchField) {
      setOpenModalLoading(true);
      getUsers();
    }
  }, [searchField])

  //Metodo de obtencion de usuarios
  const getUsers = async (page?: any) => {
    //Llamado al backend y construcción de los parametros de consulta
    let response: any = await getUserPaginated({
      page: page ? page : 0,
      search: searchField,
      dateCreationFrom: dateCreationFrom ? dateCreationFrom.toDate() : '',
      dateCreationTo: dateCreationTo ? dateCreationTo.toDate() : '',
    });
    setPagePagination(page ? page + 1 : 1);
    if (response.users && response.users.length) {
      //Se recorre respuesta con los datos obtenidos para generar un arreglo en el orden que se muestran los datos en la tabla
      let users = response.users.map((data: any) => {
        let arrayData = [
          data.correo,
          data.nombreUsuario,
          moment(data.fechaCreacion).format('D/MM/YYYY, h:mm:ss a'),
          moment(data.fechaActualizacion).format('D/MM/YYYY, h:mm:ss a'),
          <Tooltip id='filterTooltip' title="Editar" placement='top' classes={{ tooltip: classes.tooltip }}>
            <div className={classes.buttonHeaderContainer}>
              <Button key={'filtersButton'} color={'primary'} size='sm' round variant="outlined" justIcon startIcon={<EditIcon />}
                onClick={() => {
                  setDataEditUser(data);

                }} />
            </div>
          </Tooltip>
        ];
        return arrayData;
      });
      setTotalUsers(response.totalUsers);
      setUserList(users);
    } else {
      setTotalUsers(0);
      setUserList([]);
    }
    setOpenModalLoading(false);
  }

   //Obtencion de los programas para la modal, cuando se crea o se edita una homologacion
   const getProgramas = async (isEdit?: boolean, usuarioToEdit?: any) => {
    let response: any = await getAllProgramas({
      search: '',
    });
    if (response && response.programas) {
      setProgramasList(response.programas);
      if (isEdit && usuarioToEdit.programaId) {
        let findPrograma = response.programas.find((programa: any) => programa._id === usuarioToEdit.programaId);
        if (findPrograma) {
          setProgramaSelected({ ...findPrograma });
        }
      }
    }
    if (!isEdit) {
      setOpenModalLoading(false);
    }
  }

  //Cuando se cambia de pagina se ejecuta el metodo getUsers con la pagina solicitada
  const onChangePage = (page: number) => {
    setOpenModalLoading(true);
    getUsers(page);

  };

  //Se establecen los datos de un usuario a editar en la modal
  const setDataEditUser = (data: any) => {
    setOpenModal(true);
    let roleItem = userProfilesArray.find((item) => item.id === data.rolId);
    setUserObject({
      _id: data._id,
      name: data.nombreUsuario,
      email: data.correo,
      role: roleItem ? roleItem : { id: 0, title: '' },
      password: '',
      passwordConfirm: '',
      identificacionEstudiante: data.identificacionEstudiante,
      universidadEstudiante: data.universidadEstudiante,
    });
    getProgramas(userObject._id? true: false, userObject)
  };

  //Manejador de la accion guardar de la modal, se encarga de crear o editar
  const handleSaveUser = () => {
    setOpenModalLoading(true);
    let isValid = validateFields();
    if (isValid) {

      if (userObject._id) {
        let isValidPassword = true;
        if (updatePassword) {
          isValidPassword = validatePassword();
        }
        if (isValidPassword) {
          //EDITAR USUARIO
          handleEditUser();
        } else {
          setOpenModalLoading(false);
        }
      } else {
        let isValidPassword = validatePassword();
        if (isValidPassword) {
          //CREAR USUARIO
          handleCreateUser();
        } else {
          setOpenModalLoading(false);
        }
      }

    } else {
      setSeverityAlert('warning');
      setShowAlert(true);
      setMessagesAlert('Debe diligenciar todos los campos obligatorios');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
      setOpenModalLoading(false);
    }
  };

  //Metodo para crear un usuario
  const handleCreateUser = async () => {
    let userToSave = {
      nombreUsuario: userObject.name,
      correo: userObject.email,
      contrasena: userObject.password,
      rolId: userObject.role.id
    };
    let response: any = await createUser(userToSave);
    if (response && response.error) {
      setSeverityAlert('error');
      setShowAlert(true);
      setMessagesAlert(response && response.descripcion ? response.descripcion:'Ha ocurrido un error intentando crear, por favor intentelo de nuevo');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
      setOpenModalLoading(false);
    } else {
      setSeverityAlert('success');
      setShowAlert(true);
      setMessagesAlert('Usuario creado satisfactoriamente');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
      setOpenModal(false);
      getUsers();
    }
  }

  //Metodo para editar un usuario
  const handleEditUser = async () => {
    let userToSave = {
      nombreUsuario: userObject.name,
      correo: userObject.email,
      contrasena: userObject.password,
      rolId: userObject.role.id
    };
    let response: any = await updateUser(userToSave, userObject._id);
    if (response && response.error) {
      setSeverityAlert('error');
      setShowAlert(true);
      setMessagesAlert(response && response.descripcion ? response.descripcion:'Ha ocurrido un error intentando actualizar, por favor intentelo de nuevo');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
      setOpenModalLoading(false);
    } else {
      setSeverityAlert('success');
      setShowAlert(true);
      setMessagesAlert('Usuario editado satisfactoriamente');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
      setOpenModal(false);
      getUsers();
    }
  }

  //Validacion de campos obligatorios para la creacion y edicion
  const validateFields = () => {
    if (userObject._id) {
      if (userObject.name && userObject.email && userObject.role.id) {
        return true;
      } else {
        return false;
      }
    } else {
      if (userObject.name &&
        userObject.email &&
        userObject.password &&
        userObject.passwordConfirm &&
        userObject.role.id) {
        return true;
      } else {
        return false;
      }
    }
  };

  //Validacion de contraseñas, que sean iguales
  const validatePassword = () => {
    if (userObject.password !== userObject.passwordConfirm) {
      setShowAlert(true);
      setSeverityAlert('warning');
      setMessagesAlert('Las contraseñas ingresadas no coinciden, verifica que son identicas');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
      setOpenModalLoading(false);
      return false;
    }
    return true;
  };

  //Retorno con todos la construcción de la interfaz del modulo
  return (
    <div>
      <AlertComponent severity={severityAlert} message={messageAlert} visible={showAlert} />
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="success">
              <div className={classes.TitleFilterContainer}>
                <h4 className={classes.cardTitleWhite}>Usuarios</h4>
                <div className={classes.headerActions}>
                  <TextField
                    id="outlined-search"
                    label="Búsqueda"
                    variant="outlined"
                    margin="dense"
                    className={classes.CustomSearchTextFieldStyle}
                    value={searchField}
                    onChange={(event) => setSearchField(event.target.value)}
                    InputProps={{
                      endAdornment:
                        <Button key={'searchButton'} color={'primary'} round variant="outlined" size='sm' justIcon startIcon={<ClearIcon />}
                          onClick={() => {
                            setSearchField('');
                          }} />
                    }}
                  />

                  <Tooltip id='searchTooltip' title="Buscar" placement='top' classes={{ tooltip: classes.tooltip }}>
                    <div className={classes.buttonHeaderContainer}>
                      <Button key={'searchButton'} color={'primary'} round variant="outlined" justIcon startIcon={<Search />}
                        onClick={() => {
                          setOpenModalLoading(true);
                          getUsers();
                        }} />
                    </div>
                  </Tooltip>
                  <Tooltip id='filterTooltip' title="Más filtros" placement='top' classes={{ tooltip: classes.tooltip }}>
                    <div className={classes.buttonHeaderContainer}>
                      <Button key={'filtersButton'} color={'primary'} round variant="outlined" justIcon startIcon={<FilterList />}
                        onClick={() => { setOpenMoreFilters(!openMoreFilters) }} />
                    </div>
                  </Tooltip>
                </div>
              </div>
              {
                openMoreFilters ?
                  <div>
                    <Card className={classes.cardFilters}>
                      <div >
                        <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={"sw"} >
                          <GridContainer>
                            <GridItem xs={12} sm={12} md={12}>
                              <h4 className={classes.cardTitleBlack}>Fecha de creación</h4>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={6}>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <DatePicker
                                  label="Fecha desde"
                                  inputVariant='outlined'
                                  margin='dense'
                                  className={classes.CustomTextField}
                                  format="DD/MM/YYYY"
                                  value={dateCreationFrom}
                                  onChange={(newValue: any) => {
                                    setDateCreationFrom(newValue);
                                  }}
                                  clearable
                                  clearLabel='Limpiar'
                                />
                                {
                                  dateCreationFrom ? (
                                    <CloseIcon onClick={(e) => setDateCreationFrom(null)} />
                                  ) : null
                                }
                              </div>
                            </GridItem>

                            <GridItem xs={12} sm={12} md={6}>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <DatePicker
                                  label="Fecha hasta"
                                  inputVariant='outlined'
                                  margin='dense'
                                  className={classes.CustomTextField}
                                  format="DD/MM/YYYY"
                                  value={dateCreationTo}
                                  onChange={(newValue: any) => {
                                    setDateCreationTo(newValue);
                                  }}
                                  clearable
                                  clearLabel='Limpiar'
                                />
                                {
                                  dateCreationTo ? (
                                    <CloseIcon onClick={(e) => setDateCreationTo(null)} />
                                  ) : null
                                }
                              </div>
                            </GridItem>
                          </GridContainer>
                        </MuiPickersUtilsProvider>
                      </div>
                      <div className={classes.containerFooterCard} >
                        <Button key={'filtersButton'} color={'primary'} round variant="outlined" endIcon={<SendIcon />}
                          onClick={() => {
                            setOpenModalLoading(true);
                            getUsers();
                          }} >
                          {'Aplicar filtros'}
                        </Button>

                      </div>
                    </Card>
                  </div>
                  : null
              }
            </CardHeader>
            <CardBody>
              {
                !userList.length ?
                  <h2 style={{ textAlign: 'center' }}>No se encontraron usuarios en la base de datos</h2>
                  :
                  <Table
                    tableHeaderColor="success"
                    tableHead={[
                      'Correo',
                      'Nombre',
                      'Fecha de creación',
                      'Fecha ultima actualización',
                      'Acciones'
                    ]}
                    tableData={userList}
                  />
              }
            </CardBody>
          </Card>

          <Card className={classes.centerContent}>
            <TablePagination page={pagePagination} count={10} onChangePage={onChangePage} totalData={totalUsers} />
          </Card>

        </GridItem>
      </GridContainer>
      <div className={classes.containerFloatButton}>
        <Tooltip id='addTooltip' title="Crear nuevo usuario" placement='left' classes={{ tooltip: classes.tooltip }}>
          <div>
            <Button key={'searchButton'} color={'primary'} round justIcon startIcon={<AddIcon />}
              onClick={() => {
                setOpenModal(!openModal);
                setUserObject({
                  _id: '',
                  name: '',
                  email: '',
                  role: { id: 0, title: '' },
                  password: '',
                  passwordConfirm: '',
                })
                getProgramas()
              }} />
          </div>
        </Tooltip>
      </div>

      {/* Modal de creación y edicion */}
      <Modal
        open={openModal}
        className={classes.modalForm}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={classes.centerContent}>
          <GridItem xs={12} sm={8} md={8} >
            <Card className={classes.container}>
              <CardHeader color="success">
                <div className={classes.TitleFilterContainer}>
                  <h4 className={classes.cardTitleWhite}>{userObject._id ? 'Editar': 'Crear'} usuario</h4>
                  <div className={classes.headerActions}>
                    <Tooltip id='filterTooltip' title="Cerrar" placement='top' classes={{ tooltip: classes.tooltip }}>
                      <div className={classes.buttonHeaderContainer}>
                        <Button key={'filtersButton'} color={'primary'} size='sm' round variant="outlined" justIcon startIcon={<CloseIcon />}
                          onClick={() => { setOpenModal(false) }} />
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </CardHeader >
              <div className={classes.containerFormModal} >
                <GridContainer>

                  <GridItem xs={12} sm={12} md={6} >
                    <TextField
                      id="outlined-name"
                      label="Nombre"
                      variant="outlined"
                      margin="dense"
                      inputProps={{ maxLength: 150 }}
                      className={classes.CustomTextField}
                      value={userObject.name}
                      defaultValue={''}
                      error={!userObject.name ? true : false}
                      onChange={(event) => {
                        setUserObject({ ...userObject, name: event.target.value })
                      }}
                    />
                  </GridItem>

                  <GridItem xs={12} sm={12} md={6} >
                    <TextField
                      id="outlined-email"
                      label="Correo electrónico"
                      variant="outlined"
                      margin="dense"
                      inputProps={{ maxLength: 150 }}
                      inputMode='email'
                      error={!userObject.email ? true : false}
                      className={classes.CustomTextField}
                      value={userObject.email}
                      onChange={(event) => setUserObject({ ...userObject, email: event.target.value })}
                    />
                  </GridItem>

                  <GridItem xs={12} sm={12} md={6} >
                    <Autocomplete
                      id="tags-outlined"
                      options={userProfilesArray}
                      getOptionLabel={(option) => option.title}
                      filterSelectedOptions
                      onChange={(e, option) => setUserObject({ ...userObject, role: option || {} })}
                      value={userObject.role}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          id="outlined-rol"
                          label="Rol"
                          variant="outlined"
                          margin="dense"
                          error={userObject.role && !userObject.role.id ? true : false}
                          className={classes.CustomTextField}
                        />
                      )}
                    />
                  </GridItem>
                  {
                    userObject._id ?
                      <GridItem xs={12} sm={12} md={6} >
                        <Checkbox
                          checked={updatePassword}
                          onClick={() => { setUpdatePassword(!updatePassword) }}
                          checkedIcon={<CheckIcon className={classes.checkedIcon} />}
                          icon={<CheckIcon className={classes.uncheckedIcon} />}
                          classes={{
                            checked: classes.checked
                          }}
                        />
                        <span> Actualizar contaseña </span>
                      </GridItem>
                      : null
                  }

                  {
                    !userObject._id || updatePassword ?
                      <>
                        <GridItem xs={12} sm={12} md={6} >
                          <TextField
                            id="outlined-password"
                            label="Contraseña"
                            variant="outlined"
                            margin="dense"
                            inputProps={{ maxLength: 150 }}
                            className={classes.CustomTextField}
                            type="password"
                            error={!userObject.password ? true : false}
                            value={userObject.password}
                            onChange={(event) => setUserObject({ ...userObject, password: event.target.value })}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6} >
                          <TextField
                            id="outlined-confirm-password"
                            label="Confirmar contraseña"
                            variant="outlined"
                            margin="dense"
                            inputProps={{ maxLength: 150 }}
                            className={classes.CustomTextField}
                            error={!userObject.passwordConfirm ? true : false}
                            type="password"
                            value={userObject.passwordConfirm}
                            onChange={(event) => setUserObject({ ...userObject, passwordConfirm: event.target.value })}
                          />
                        </GridItem>
                      </>
                      : null
                  }

                  {
                    userObject.role.id === 4 ?
                    <>
                        <GridItem xs={12} sm={12} md={6} >
                          <TextField
                            id="outlined-password"
                            label="Identificacion del estudiante"
                            variant="outlined"
                            margin="dense"
                            inputProps={{ maxLength: 150 }}
                            className={classes.CustomTextField}
                            type="password"
                            error={!userObject.identificacionEstudiante ? true : false}
                            value={userObject.identificacionEstudiante}
                            onChange={(event) => setUserObject({ ...userObject, identificacionEstudiante: event.target.value })}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6} >
                          <TextField
                            id="outlined-password"
                            label="Universidad del estudiante"
                            variant="outlined"
                            margin="dense"
                            inputProps={{ maxLength: 150 }}
                            className={classes.CustomTextField}
                            type="password"
                            error={!userObject.identificacionEstudiante ? true : false}
                            value={userObject.identificacionEstudiante}
                            onChange={(event) => setUserObject({ ...userObject, identificacionEstudiante: event.target.value })}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6} >
                    <Autocomplete
                      id="tags-outlined"
                      options={programasList}
                      getOptionLabel={(option: any) => option._id ? `${option.codigo} - ${option.nombre}` : ''}
                      filterSelectedOptions
                      onChange={(e, option) => {
                        setProgramaSelected(option || {})
                      }}
                      value={programaSelected}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          id="outlined-rol"
                          label="Programa"
                          variant="outlined"
                          margin="dense"
                          error={programaSelected && !programaSelected._id ? true : false}
                          className={classes.CustomTextField}
                          helperText={!programaSelected._id ? 'Primero seleccione un programa.':''}
                        />
                      )}
                    />
                  </GridItem>
                    </>
                    : null
                  }

                </GridContainer>
              </div>
              <div className={classes.containerFooterModal} >
                <Button key={'filtersButton'} color={'primary'} round variant="outlined" endIcon={<SendIcon />}
                  onClick={() => { handleSaveUser(); }}>
                  {'Guardar'}
                </Button>

              </div>

            </Card>
          </GridItem>
        </div>
      </Modal>
      <ModalLoading showModal={openModalLoading} />
    </div>
  );
}

export default withStyles(styles)(Usuarios);
