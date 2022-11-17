import React, { useState, useEffect } from 'react';
import MomentUtils from '@date-io/moment';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import Modal from '@material-ui/core/Modal';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import Tooltip from '@material-ui/core/Tooltip';
import Search from '@material-ui/icons/Search';
import FilterList from '@material-ui/icons/FilterList';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import SendIcon from '@material-ui/icons/Send';
import ClearIcon from '@material-ui/icons/Clear';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import moment from 'moment';
import 'moment/locale/es';

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

import { AnythingObject, tiposAsignatura, emailDomainRegexValidation } from '../../constants/generalConstants';

import { getDocentePaginated, createDocente, updateDocente } from '../../services/docentesServices';
import { getAsignaturasByDocente } from '../../services/asignaturasServices';

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
});

function Docentes(props: any) {
  const { classes } = props;
  const openModalCreate = props.history.location.state ? props.history.location.state.openModalCreate : false;

  const [showAlert, setShowAlert] = useState(false);
  const [severityAlert, setSeverityAlert] = useState('');
  const [messageAlert, setMessagesAlert] = useState('');
  const [openMoreFilters, setOpenMoreFilters] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [searchField, setSearchField] = useState('');
  const [openModalLoading, setOpenModalLoading] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(true);
  const [dateCreationFrom, setDateCreationFrom] = useState<any>();
  const [dateCreationTo, setDateCreationTo] = useState<any>();
  const [docentesList, setDocentesList] = useState([]);
  const [totalDocentes, setTotalDocentes] = useState(0);
  const [pagePagination, setPagePagination] = useState(1);
  const [asignaturasList, setAsignaturasList] = useState([]);
  const [errorEmail, setErrorEmail] = useState<any>({ error: false, mensaje: '' });

  const [docenteObject, setDocenteObject] = useState<AnythingObject>({
    _id: '',
    name: '',
    email: '',
    document: '',
  });

  const validateFields = () =>  (docenteObject.name && docenteObject.email && docenteObject.email.match(emailDomainRegexValidation));

  const getAsignaturas = async (data: any) => {
    let asignaturas: any = await getAsignaturasByDocente(data);
    if (asignaturas.asignaturas) {
      let AsignaturasList = asignaturas.asignaturas.map((asignatura: any) => {
        const tipoAsignatura = tiposAsignatura.find((subject: any) => subject.id === asignatura.asignaturaTipo);
        let arr = [
          asignatura.codigo,
          asignatura.nombre,
          asignatura.cantidadCredito,
          tipoAsignatura ? tipoAsignatura.title : '',
          asignatura.intensidadHoraria
        ];
        return arr;
      });
      setAsignaturasList(AsignaturasList);
    }
  };

  const setDataEditDocente = (data: any) => {
    setOpenModal(true);
    getAsignaturas({ docenteId: data._id });
    setDocenteObject({
      _id: data._id,
      name: data.nombre,
      email: data.correo,
      document: data.documento,
    });
  };

  const getDocentes = async (page?: any) => {
    let response: any = await getDocentePaginated({
      page: page ? page : 0,
      search: searchField,
      dateCreationFrom: dateCreationFrom ? dateCreationFrom.toDate() : '',
      dateCreationTo: dateCreationTo ? dateCreationTo.toDate() : '',
    });
    setPagePagination(page ? page + 1 : 1);
    if (response.docentes && response.docentes.length) {
      let docentes = response.docentes.map((data: any) => {
        let arrayData = [
          data.nombre,
          data.correo,
          data.documento,
          moment(data.fechaCreacion).format('D/MM/YYYY, h:mm:ss a'),
          moment(data.fechaActualizacion).format('D/MM/YYYY, h:mm:ss a'),
          <Tooltip id="filterTooltip" title="Ver docentes" placement="top" classes={{ tooltip: classes.tooltip }}>
            <div className={classes.buttonHeaderContainer}>
              <Button key={'filtersButton'} color={'primary'} size="sm" round={true} variant="outlined" justIcon={true} startIcon={<VisibilityIcon />}
                onClick={() => {
                  setIsEdit(false);
                  setDataEditDocente(data);
                }} />
            </div>
          </Tooltip>,
          <Tooltip id="filterTooltip" title="Editar" placement="top" classes={{ tooltip: classes.tooltip }}>
            <div className={classes.buttonHeaderContainer}>
              <Button key={'filtersButton'} color={'primary'} size="sm" round={true} variant="outlined" justIcon={true} startIcon={<EditIcon />}
                onClick={() => {
                  setIsEdit(true);
                  setDataEditDocente(data);

                }} />
            </div>
          </Tooltip>
        ];
        return arrayData;
      });
      setTotalDocentes(response.totalDocentes);
      setDocentesList(docentes);
    } else {
      setTotalDocentes(0);
      setDocentesList([]);

    }
    setOpenModalLoading(false);
  };
  
  const onChangePage = (page: number) => {
    setOpenModalLoading(true);
    getDocentes(page);
  };

  const handleCreateDocente = async () => {
    let docenteToSave = {
      nombre: docenteObject.name,
      correo: docenteObject.email,
      documento: docenteObject.document,
    };
    let response: any = await createDocente(docenteToSave);
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
      setMessagesAlert('Docente creado satisfactoriamente');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
      setOpenModal(false);
      getDocentes();
    }
  };

  const handleEditDocente = async () => {
    let docenteToSave = {
      nombre: docenteObject.name,
      correo: docenteObject.email,
      documento: docenteObject.document,
    };
    let response: any = await updateDocente(docenteToSave, docenteObject._id);
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
      setMessagesAlert('Docente editado satisfactoriamente');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
      setOpenModal(false);
      getDocentes();
    }
  };

  const handleSaveDocente = () => {
    setOpenModalLoading(true);
    let isValid = validateFields();
    if (isValid) {

      if (docenteObject._id) {
        // EDITAR DOCENTE
        handleEditDocente();
      } else {
        // CREAR DOCENTE
        handleCreateDocente();
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

  useEffect(() => {
    setOpenModalLoading(true);
    getDocentes();
    if (openModalCreate) {
      setOpenModal(true);
    }
  }, []);

  useEffect(() => {
    if (!searchField) {
      setOpenModalLoading(true);
      getDocentes();
    }
  }, [searchField]);

  return (
    <div>
      <AlertComponent severity={severityAlert} message={messageAlert} visible={showAlert} />
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="success">
              <div className={classes.TitleFilterContainer}>
                <h4 className={classes.cardTitleWhite}>Docentes</h4>
                <div className={classes.headerActions}>
                  <TextField
                    id="outlined-email"
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
                          }}
                        />
                    }}
                  // value={email}
                  // onChange={(event) => setEmail(event.target.value)}
                  />

                  <Tooltip id="searchTooltip" title="Buscar" placement="top" classes={{ tooltip: classes.tooltip }}>
                    <div className={classes.buttonHeaderContainer}>
                      <Button key={'searchButton'} color={'primary'} round={true} variant="outlined" justIcon={true} startIcon={<Search />}
                        onClick={() => {
                          setOpenModalLoading(true);
                          getDocentes();
                        }}
                      />
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
                            getDocentes();
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
                !docentesList.length ?
                  <h2 style={{ textAlign: 'center' }}>No se encontraron docentes en la base de datos</h2>
                  :
                  <Table
                    tableHeaderColor="success"
                    tableHead={[
                      'Nombre',
                      'Correo',
                      'Numero de documento',
                      'Fecha de creación',
                      'Fecha ultima actualización',
                      'Ver docentes',
                      'Acciones'
                    ]}
                    tableData={docentesList}
                  />
              }
            </CardBody>
          </Card>

          <Card className={classes.centerContent}>
            <TablePagination page={pagePagination} count={10} onChangePage={onChangePage} totalData={totalDocentes} />
          </Card>

        </GridItem>
      </GridContainer>
      <div className={classes.containerFloatButton}>
        <Tooltip id="addTooltip" title="Crear nuevo docente" placement="left" classes={{ tooltip: classes.tooltip }}>
          <div>
            <Button key={'searchButton'} color={'primary'} round={true} justIcon={true} startIcon={<AddIcon />}
              onClick={() => {
                setOpenModal(!openModal);
                setAsignaturasList([]);
                setDocenteObject({
                  _id: '',
                  name: '',
                  email: '',
                  document: ''
                });
                setIsEdit(true);
              }} />
          </div>
        </Tooltip>
      </div>

      {/* Modal de creación y edicion de docentes */}
      <Modal
        open={openModal}
        className={classes.modalForm}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={classes.centerContent}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12} >
              <Card className={classes.container}>
                <CardHeader color="success">
                  <div className={classes.TitleFilterContainer}>
                    {
                      isEdit ?
                        <h4 className={classes.cardTitleWhite}>{docenteObject._id ? 'Editar' : 'Crear'} docente</h4>
                        :
                        <h4 className={classes.cardTitleWhite}>Detalles del docente</h4>
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

                  <GridItem xs={12} sm={12} md={12}>
                    <h5 className={classes.cardTitleBlack}>Información del docente</h5>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12} >
                    <hr />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12} >
                    <br />
                  </GridItem>

                  <TextField
                    id="outlined-email"
                    label="Nombre"
                    variant="outlined"
                    margin="dense"
                    className={classes.CustomTextField}
                    error={!docenteObject.name ? true : false}
                    value={docenteObject.name}
                    disabled={!isEdit}
                    onChange={(event) => {
                      setDocenteObject({ ...docenteObject, name: event.target.value });
                    }}
                  />
                  <TextField
                    id="outlined-email"
                    label="Correo Electrónico"
                    variant="outlined"
                    margin="dense"
                    className={classes.CustomTextField}
                    error={errorEmail.error}
                    helperText={errorEmail.mensaje}
                    value={docenteObject.email}
                    disabled={!isEdit}
                    onChange={(event) => {
                      if (!event.target.value.match(emailDomainRegexValidation)) {
                        setErrorEmail({ error: true, mensaje: 'El formato del correo no es válido' });
                      } else {
                        setErrorEmail({ error: false, mensaje: '' });
                      }
                      setDocenteObject({ ...docenteObject, email: event.target.value });

                    }}
                  />
                  <TextField
                    id="outlined-email"
                    label="Número de documento"
                    variant="outlined"
                    margin="dense"
                    className={classes.CustomTextField}
                    value={docenteObject.document}
                    disabled={!isEdit}
                    onChange={(event) => {
                      setDocenteObject({ ...docenteObject, document: event.target.value });
                    }}
                  />
                </div>

                <GridItem xs={12} sm={12} md={12} >
                  <br />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <h5 className={classes.cardTitleBlack}>Asignaturas del docente</h5>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} >
                  <hr />
                </GridItem>
                <GridItem xs={12} sm={12} md={12} >
                  <br />
                </GridItem>

                {
                  !asignaturasList.length ?
                    <h6 style={{ textAlign: 'center' }}>No se encontraron asignaturas para el docente seleccionado</h6>
                    :
                    <Table
                      tableHeaderColor="success"
                      tableHead={[
                        'Código',
                        'Nombre',
                        'Créditos',
                        'Tipo de asignatura',
                        'Horas semanales'
                      ]}
                      tableData={asignaturasList}
                    />
                }

                <GridItem xs={12} sm={12} md={12} >
                  <br />
                </GridItem>
               {
                isEdit ? (
                  <div className={classes.containerFooterModal} >
                    <Button key={'filtersButton'} color={'primary'} round={true} variant="outlined" endIcon={<SendIcon />}
                      onClick={() => { handleSaveDocente(); }} >
                      {'Guardar'}
                    </Button>
                  </div>
                ) : null
               }
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      </Modal>
      <ModalLoading showModal={openModalLoading} />
    </div>
  );
}

export default withStyles(styles)(Docentes);
