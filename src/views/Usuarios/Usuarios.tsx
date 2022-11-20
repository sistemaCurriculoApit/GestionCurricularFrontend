// importacion de dependencias y servicios
import React, { useEffect, useState } from 'react';
import MomentUtils from '@date-io/moment';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import Modal from '@material-ui/core/Modal';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import Tooltip from '@material-ui/core/Tooltip';
import Search from '@material-ui/icons/Search';
import FilterList from '@material-ui/icons/FilterList';
import Checkbox from '@material-ui/core/Checkbox';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import SendIcon from '@material-ui/icons/Send';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';
import CheckIcon from '@material-ui/icons/Check';
import moment from 'moment';
import 'moment/locale/es';

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
import AlertComponent from '../../components/Alert/AlertComponent';

// jss
import { CustomSearchTextField, CustomTextField } from '../../assets/jss/material-dashboard-react/components/customInputStyle';
import cardTabletCustomStyle from '../../assets/jss/material-dashboard-react/components/cardTabletCustomStyle';
import { containerFloatButton } from '../../assets/jss/material-dashboard-react/components/buttonStyle';
import tooltipStyle from '../../assets/jss/material-dashboard-react/tooltipStyle';
import { container, containerFormModal, containerFooterModal, modalForm } from '../../assets/jss/material-dashboard-react';
import checkboxAdnRadioStyle from '../../assets/jss/material-dashboard-react/checkboxAdnRadioStyle';

import { userProfilesArray, AnythingObject, userProfilesObject, emailDomainRegexValidation } from '../../constants/generalConstants';
import { getEstudianteByEmail } from '../../services/estudiantesServices';
import { getUserPaginated, createUser, updateUser } from '../../services/usersServices';

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

function Usuarios(props: any) {
  const { classes } = props;
  const openModalCreate = props.history.location.state ? props.history.location.state.openModalCreate : false;

  const [showAlert, setShowAlert] = useState(false);
  const [severityAlert, setSeverityAlert] = useState('');
  const [messageAlert, setMessagesAlert] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [openModalLoading, setOpenModalLoading] = useState(false);
  const [updatePassword, setUpdatePassword] = useState(false);
  const [openMoreFilters, setOpenMoreFilters] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(true);
  const [searchField, setSearchField] = useState('');
  const [dateCreationFrom, setDateCreationFrom] = useState<any>();
  const [dateCreationTo, setDateCreationTo] = useState<any>();
  const [userList, setUserList] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pagePagination, setPagePagination] = useState(1);
  const [errorEmail, setErrorEmail] = useState<any>({ error: false, mensaje: '' });
  const [userObject, setUserObject] = useState<AnythingObject>({
    _id: '',
    name: '',
    email: '',
    role: { id: 0, title: '' },
    passwordConfirm: '',
    identificacion: '',
    universidadEstudiante: '',
    programaEstudiante: '',
    planEstudiante: '',
    universidadEstudianteOrigen: '',
    programaEstudianteOrigen: '',
    planEstudianteOrigen: ''
  });

  const setDataEditUser = async (data: any) => {
    setOpenModal(true);
    let roleItem = userProfilesArray.find((item) => item.id === data.rolId);
    if (roleItem && roleItem.id === userProfilesObject.est.id) {
      let estudiante: any = await getEstudianteByEmail({
        correo: data.correo
      });
      if (estudiante) {
        setUserObject({
          _id: data._id,
          name: data.nombreUsuario,
          email: data.correo,
          role: roleItem ? roleItem : { id: 0, title: '' },
          universidadEstudiante: estudiante.universidad ? estudiante.universidad : '',
          programaEstudiante: estudiante.programa ? estudiante.programa : '',
          identificacion: data.identificacion ? data.identificacion : '',
          planEstudiante: estudiante.plan ? estudiante.plan : '',
          universidadEstudianteOrigen: estudiante.universidadOrigen ? estudiante.universidadOrigen : '',
          programaEstudianteOrigen: estudiante.programaOrigen ? estudiante.programaOrigen : '',
          planEstudianteOrigen: estudiante.planOrigen ? estudiante.planOrigen : '',
        });
      } else {
        setUserObject({
          _id: data._id,
          name: data.nombreUsuario,
          email: data.correo,
          role: roleItem ? roleItem : { id: 0, title: '' },
          identificacion: data.identificacion ? data.identificacion : '',
          universidadEstudiante: '',
          programaEstudiante: '',
          planEstudiante: '',
          universidadEstudianteOrigen: '',
          programaEstudianteOrigen: '',
          planEstudianteOrigen: '',
        });
      }
    } else {
      setUserObject({
        _id: data._id,
        name: data.nombreUsuario,
        email: data.correo,
        role: roleItem ? roleItem : { id: 0, title: '' },
        identificacion: data.identificacion,
        universidadEstudiante: '',
        programaEstudiante: '',
        planEstudiante: '',
        universidadEstudianteOrigen: '',
        programaEstudianteOrigen: '',
        planEstudianteOrigen: '',
      });
    }
  };

  const getUsers = async (page?: any) => {
    // Llamado al backend y construcción de los parametros de consulta
    let response: any = await getUserPaginated({
      page: page ? page : 0,
      search: searchField,
      dateCreationFrom: dateCreationFrom ? dateCreationFrom.toDate() : '',
      dateCreationTo: dateCreationTo ? dateCreationTo.toDate() : '',
    });
    setPagePagination(page ? page + 1 : 1);
    if (response.users && response.users.length) {
      // Se recorre respuesta con los datos obtenidos para generar un arreglo en el orden que se muestran los datos en la tabla
      let users = response.users.map((data: any) => {
        let arrayData = [
          data.correo,
          data.nombreUsuario,
          data.identificacion,
          moment(data.fechaCreacion).format('D/MM/YYYY, h:mm:ss a'),
          moment(data.fechaActualizacion).format('D/MM/YYYY, h:mm:ss a'),
          (
            <Tooltip id="filterTooltip" title="Ver usuarios" placement="top" classes={{ tooltip: classes.tooltip }}>
              <div className={classes.buttonHeaderContainer}>
                <Button key={'filtersButton'} color={'primary'} size="sm" round={true} variant="outlined" justIcon={true} startIcon={<VisibilityIcon />}
                  onClick={() => {
                    setIsEdit(false);
                    setDataEditUser(data);
                  }} />
              </div>
            </Tooltip>
          ),
          (
            <Tooltip id="filterTooltip" title="Editar" placement="top" classes={{ tooltip: classes.tooltip }}>
              <div className={classes.buttonHeaderContainer}>
                <Button
                  key={'filtersButton'}
                  color={'primary'}
                  size="sm"
                  round={true}
                  justIcon={true}
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => {
                    setIsEdit(true);
                    setDataEditUser(data);
                  }} />
              </div>
            </Tooltip>
          )
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
  };

  useEffect(() => {
    setOpenModalLoading(true);
    getUsers();
    if (openModalCreate) {
      setOpenModal(true);
    }
  }, []);

  useEffect(() => {
    if (!searchField) {
      setOpenModalLoading(true);
      getUsers();
    }
  }, [searchField]);

  const setUserRoleData = async (roleSelected: any) => {
    if (roleSelected.id === userProfilesObject.est.id) {
      let estudiante: any = await getEstudianteByEmail({
        correo: userObject.email
      });
      if (estudiante) {
        setUserObject({
          ...userObject,
          role: roleSelected,
          universidadEstudiante: estudiante.universidad,
          programaEstudiante: estudiante.programa,
          planEstudiante: estudiante.plan,
          universidadEstudianteOrigen: estudiante.universidadOrigen,
          programaEstudianteOrigen: estudiante.programaOrigen,
          planEstudianteOrigen: estudiante.planOrigen
        });
      }
    } else {
      setUserObject({ ...userObject, role: roleSelected });
    }
  };

  const onChangePage = (page: number) => {
    setOpenModalLoading(true);
    getUsers(page);

  };

  const validateFields = () => {
    if (userObject._id) {
      if (userObject.name && userObject.email && userObject.role.id && userObject.email.match(emailDomainRegexValidation) && userObject.identificacion) {
        return true;
      } else {
        return false;
      }
    } else {
      if (userObject.name &&
        userObject.email &&
        userObject.role.id &&
        userObject.identificacion &&
        userObject.email.match(emailDomainRegexValidation)) {
        return true;
      } else {
        return false;
      }
    }
  };

  const handleCreateUser = async () => {
    let userToSave = {
      nombreUsuario: userObject.name,
      correo: userObject.email,
      rolId: userObject.role.id,
      identificacion: userObject.identificacion,
      universidadEstudiante: userObject.universidadEstudiante,
      programa: userObject.programaEstudiante,
      plan: userObject.planEstudiante,
      universidadEstudianteOrigen: userObject.universidadEstudianteOrigen,
      programaOrigen: userObject.programaEstudianteOrigen,
      planOrigen: userObject.planEstudianteOrigen,
    };
    let response: any = await createUser(userToSave);
    if (response && response.error) {
      setSeverityAlert('error');
      setShowAlert(true);
      setMessagesAlert(response && response.descripcion ? response.descripcion : 'Ha ocurrido un error intentando crear, por favor intentelo de nuevo');
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
  };

  const handleEditUser = async () => {
    let userToSave = {
      nombreUsuario: userObject.name,
      correo: userObject.email,
      rolId: userObject.role.id,
      identificacion: userObject.identificacion,
      universidadEstudiante: userObject.universidadEstudiante,
      programa: userObject.programaEstudiante,
      plan: userObject.planEstudiante,
      universidadEstudianteOrigen: userObject.universidadEstudianteOrigen,
      programaOrigen: userObject.programaEstudianteOrigen,
      planOrigen: userObject.planEstudianteOrigen,
    };
    let response: any = await updateUser(userToSave, userObject._id);
    if (response && response.error) {
      setSeverityAlert('error');
      setShowAlert(true);
      setMessagesAlert(response && response.descripcion ? response.descripcion : 'Ha ocurrido un error intentando actualizar, por favor intentelo de nuevo');
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
  };

  const handleSaveUser = () => {
    setOpenModalLoading(true);
    let isValid = validateFields();
    if (isValid) {
      if (userObject._id) {
        let isValidPassword = true;
        if (isValidPassword) {
          // EDITAR USUARIO
          handleEditUser();
        } else {
          setOpenModalLoading(false);
        }
      } else {
        if (isValid) {
          // CREAR USUARIO
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
                        <Button key={'searchButton'} color={'primary'} round={true} variant="outlined" size="sm" justIcon={true} startIcon={<ClearIcon />}
                          onClick={() => {
                            setSearchField('');
                          }} />
                    }}
                  />

                  <Tooltip id="searchTooltip" title="Buscar" placement="top" classes={{ tooltip: classes.tooltip }}>
                    <div className={classes.buttonHeaderContainer}>
                      <Button key={'searchButton'} color={'primary'} round={true} variant="outlined" justIcon={true} startIcon={<Search />}
                        onClick={() => {
                          setOpenModalLoading(true);
                          getUsers();
                        }} />
                    </div>
                  </Tooltip>
                  <Tooltip id="filterTooltip" title="Más filtros" placement="top" classes={{ tooltip: classes.tooltip }}>
                    <div className={classes.buttonHeaderContainer}>
                      <Button key={'filtersButton'} color={'primary'} round={true} variant="outlined" justIcon={true} startIcon={<FilterList />}
                        onClick={() => { setOpenMoreFilters(!openMoreFilters); }} />
                    </div>
                  </Tooltip>
                </div>
              </div>
              {
                openMoreFilters ?
                  <div>
                    <Card className={classes.cardFilters}>
                      <div >
                        <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={'sw'} >
                          <GridContainer>
                            <GridItem xs={12} sm={12} md={12}>
                              <h4 className={classes.cardTitleBlack}>Fecha de creación</h4>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={6}>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <DatePicker
                                  label="Fecha desde"
                                  inputVariant="outlined"
                                  margin="dense"
                                  className={classes.CustomTextField}
                                  format="DD/MM/YYYY"
                                  value={dateCreationFrom}
                                  onChange={(newValue: any) => {
                                    setDateCreationFrom(newValue);
                                  }}
                                  clearable={true}
                                  clearLabel="Limpiar"
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
                                  inputVariant="outlined"
                                  margin="dense"
                                  className={classes.CustomTextField}
                                  format="DD/MM/YYYY"
                                  value={dateCreationTo}
                                  onChange={(newValue: any) => {
                                    setDateCreationTo(newValue);
                                  }}
                                  clearable={true}
                                  clearLabel="Limpiar"
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
                        <Button key={'filtersButton'} color={'primary'} round={true} variant="outlined" endIcon={<SendIcon />}
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
                      'Identificación',
                      'Fecha de creación',
                      'Fecha ultima actualización',
                      'Ver usuarios',
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
        <Tooltip id="addTooltip" title="Crear nuevo usuario" placement="left" classes={{ tooltip: classes.tooltip }}>
          <div>
            <Button key={'searchButton'} color={'primary'} round={true} justIcon={true} startIcon={<AddIcon />}
              onClick={() => {
                setOpenModal(!openModal);
                setUserObject({
                  _id: '',
                  name: '',
                  email: '',
                  role: { id: 0, title: '' },
                  passwordConfirm: '',
                });
                setIsEdit(true);
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
                  {
                    isEdit ?
                      <h4 className={classes.cardTitleWhite}>{userObject._id ? 'Editar' : 'Crear'} usuario</h4>
                      :
                      <h4 className={classes.cardTitleWhite}>Detalles del usuario</h4>
                  }
                  <div className={classes.headerActions}>
                    <Tooltip id="filterTooltip" title="Cerrar" placement="top" classes={{ tooltip: classes.tooltip }}>
                      <div className={classes.buttonHeaderContainer}>
                        <Button key={'filtersButton'} color={'primary'} size="sm" round={true} variant="outlined" justIcon={true} startIcon={<CloseIcon />}
                          onClick={() => { setOpenModal(false); }} />
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
                      disabled={!isEdit}
                      onChange={(event) => {
                        setUserObject({ ...userObject, name: event.target.value });
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} >
                    <TextField
                      id="outlined-name"
                      label="Identificación"
                      variant="outlined"
                      margin="dense"
                      inputProps={{ maxLength: 150 }}
                      className={classes.CustomTextField}
                      error={!userObject.identificacion ? true : false}
                      value={userObject.identificacion}
                      disabled={!isEdit}
                      onChange={(event) => setUserObject({ ...userObject, identificacion: event.target.value })}
                    />
                  </GridItem>

                  <GridItem xs={12} sm={12} md={6} >
                    <TextField
                      id="outlined-email"
                      label="Correo electrónico"
                      variant="outlined"
                      margin="dense"
                      inputProps={{ maxLength: 150 }}
                      inputMode="email"
                      error={errorEmail.error}
                      helperText={errorEmail.mensaje}
                      className={classes.CustomTextField}
                      value={userObject.email}
                      disabled={!isEdit}
                      onChange={(event) => {
                        if (!event.target.value.match(emailDomainRegexValidation)) {
                          setErrorEmail({ error: true, mensaje: 'El formato del correo no es válido' });
                        } else {
                          setErrorEmail({ error: false, mensaje: '' });
                        }
                        setUserObject({ ...userObject, email: event.target.value });
                      }}
                    />
                  </GridItem>

                  <GridItem xs={12} sm={12} md={6} >
                    <Autocomplete
                      id="tags-outlined"
                      options={userProfilesArray}
                      getOptionLabel={(option) => option.title}
                      filterSelectedOptions={true}
                      onChange={(e, option) => { setUserRoleData(option || {}); }}
                      value={userObject.role}
                      disabled={!isEdit}
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
                    userObject.role.id === userProfilesObject.est.id ?
                      <>
                        <GridItem xs={12} sm={12} md={6} >
                          <TextField
                            id="outlined-name"
                            label="Universidad del estudiante"
                            variant="outlined"
                            margin="dense"
                            inputProps={{ maxLength: 150 }}
                            className={classes.CustomTextField}
                            value={userObject.universidadEstudiante}
                            onChange={(event) => setUserObject({ ...userObject, universidadEstudiante: event.target.value })}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6} >
                          <TextField
                            id="outlined-name"
                            label="Programa del estudiante"
                            variant="outlined"
                            margin="dense"
                            inputProps={{ maxLength: 150 }}
                            className={classes.CustomTextField}
                            value={userObject.programaEstudiante}
                            onChange={(event) => setUserObject({ ...userObject, programaEstudiante: event.target.value })}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6} >
                          <TextField
                            id="outlined-name"
                            label="Plan del estudiante"
                            variant="outlined"
                            margin="dense"
                            inputProps={{ maxLength: 150 }}
                            className={classes.CustomTextField}
                            value={userObject.planEstudiante}
                            onChange={(event) => setUserObject({ ...userObject, planEstudiante: event.target.value })}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6} >
                          <TextField
                            id="outlined-name"
                            label="Universidad origen del estudiante"
                            variant="outlined"
                            margin="dense"
                            inputProps={{ maxLength: 150 }}
                            className={classes.CustomTextField}
                            error={!userObject.universidadEstudianteOrigen ? true : false}
                            value={userObject.universidadEstudianteOrigen}
                            onChange={(event) => setUserObject({ ...userObject, universidadEstudianteOrigen: event.target.value })}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6} >
                          <TextField
                            id="outlined-name"
                            label="Programa origen del estudiante"
                            variant="outlined"
                            margin="dense"
                            inputProps={{ maxLength: 150 }}
                            className={classes.CustomTextField}
                            error={!userObject.programaEstudianteOrigen ? true : false}
                            value={userObject.programaEstudianteOrigen}
                            onChange={(event) => setUserObject({ ...userObject, programaEstudianteOrigen: event.target.value })}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6} >
                          <TextField
                            id="outlined-name"
                            label="Plan origen del estudiante"
                            variant="outlined"
                            margin="dense"
                            inputProps={{ maxLength: 150 }}
                            className={classes.CustomTextField}
                            error={!userObject.planEstudianteOrigen ? true : false}
                            value={userObject.planEstudianteOrigen}
                            onChange={(event) => setUserObject({ ...userObject, planEstudianteOrigen: event.target.value })}
                          />
                        </GridItem>
                      </>
                      : null
                  }

                </GridContainer>
              </div>
              {
                isEdit ? (
                  <div className={classes.containerFooterModal} >
                    <Button key={'filtersButton'} color={'primary'} round={true} variant="outlined" endIcon={<SendIcon />}
                    onClick={() => { handleSaveUser(); }}>
                      {'Guardar'}
                    </Button>
                  </div>
                ) : null
              }
            </Card>
          </GridItem>
        </div>
      </Modal>
      <ModalLoading showModal={openModalLoading} />
    </div>
  );
}

export default withStyles(styles)(Usuarios);
