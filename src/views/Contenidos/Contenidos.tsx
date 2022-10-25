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
import {
  container,
  containerFormModal,
  containerFooterModal,
  modalForm
} from '../../assets/jss/material-dashboard-react';

import { AnythingObject } from '../../constants/generalConstants';
import { getContenidosPaginated, createContenido, updateContenido } from '../../services/contenidosServices';

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

function Contenidos(props: any) {
  const { classes } = props;

  const [showAlert, setShowAlert] = useState(false);
  const [severityAlert, setSeverityAlert] = useState('');
  const [messageAlert, setMessagesAlert] = useState('');
  const [searchField, setSearchField] = useState('');
  const [openMoreFilters, setOpenMoreFilters] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModalLoading, setOpenModalLoading] = useState(false);
  const [dateCreationFrom, setDateCreationFrom] = useState<any>(null);
  const [dateCreationTo, setDateCreationTo] = useState<any>(null);

  const [contenidoList, setContenidosList] = useState([]);
  const [totalContenidos, setTotalContenidos] = useState(0);
  const [pagePagination, setPagePagination] = useState(1);
  const [contenidoObject, setContenidoObject] = useState<AnythingObject>({
    _id: '',
    codigo: '',
    nombre: '',
    descripcion: '',
    contenidoSemana: '',
  });

  const setDataEditContenido = (data: any) => {
    setOpenModal(true);
    setContenidoObject({
      _id: data._id,
      codigo: data.codigo,
      nombre: data.nombre,
      descripcion: data.descripcion,
      contenidoSemana: data.contenidoSemana
    });
  };

  const validateFields = () => (contenidoObject.codigo &&
    contenidoObject.nombre
  );

  const getContenidos = async (page?: any) => {
    let response: any = await getContenidosPaginated({
      page: page ? page : 0,
      search: searchField,
      dateCreationFrom: dateCreationFrom ? dateCreationFrom.toDate() : '',
      dateCreationTo: dateCreationTo ? dateCreationTo.toDate() : '',
    });
    setPagePagination(page ? page + 1 : 1);
    if (response.contenidos && response.contenidos.length) {
      // Se recorre respuesta con los datos obtenidos para generar un arreglo en el orden que se muestran los datos en la tabla
      let contenidos = response.contenidos.map((data: any) => {
        let arrayData = [
          data.codigo,
          data.nombre,
          data.descripcion,
          moment(data.fechaCreacion).format('D/MM/YYYY, h:mm:ss a'),
          moment(data.fechaActualizacion).format('D/MM/YYYY, h:mm:ss a'),
          <Tooltip id="filterTooltip" title="Editar" placement="top" classes={{ tooltip: classes.tooltip }}>
            <div className={classes.buttonHeaderContainer}>
              <Button key={'filtersButton'} color={'primary'} size="sm" round={true} variant="outlined" justIcon={true} startIcon={<EditIcon />}
                onClick={() => {
                  setDataEditContenido(data);
                }} />
            </div>
          </Tooltip>
        ];
        return arrayData;
      });
      setTotalContenidos(response.totalContenidos);
      setContenidosList(contenidos);
    } else {
      setTotalContenidos(0);
      setContenidosList([]);

    }
    setOpenModalLoading(false);
  };

  const onChangePage = (page: number) => {
    setOpenModalLoading(true);
    getContenidos(page);

  };

  const handleCreateContenido = async () => {
    let contenidoToSave = {
      codigo: contenidoObject.codigo,
      nombre: contenidoObject.nombre,
      descripcion: contenidoObject.descripcion,
      contenidoSemana: contenidoObject.contenidoSemana
    };
    let response: any = await createContenido(contenidoToSave);
    if (response && response.error) {
      setSeverityAlert('error');
      setShowAlert(true);
      setMessagesAlert(response.descripcion || 'Ha ocurrido un error intentando crear, por favor intentelo de nuevo');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
      setOpenModalLoading(false);
    } else {
      setSeverityAlert('success');
      setShowAlert(true);
      setMessagesAlert('Contenido creado satisfactoriamente');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
      setOpenModal(false);
      getContenidos();
    }
  };

  const handleEditContenido = async () => {
    let contenidoToSave = {
      codigo: contenidoObject.codigo,
      nombre: contenidoObject.nombre,
      descripcion: contenidoObject.descripcion,
      contenidoSemana: contenidoObject.contenidoSemana
    };
    let response: any = await updateContenido(contenidoToSave, contenidoObject._id);
    if (response && response.error) {
      setSeverityAlert('warning');
      setShowAlert(true);
      setMessagesAlert(response.descripcion || 'Ha ocurrido un error intentando actualizar, por favor intentelo de nuevo');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
      setOpenModalLoading(false);
    } else {
      setSeverityAlert('success');
      setShowAlert(true);
      setMessagesAlert('Contenido editado satisfactoriamente');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
      setOpenModal(false);
      getContenidos();
    }
  };

  const handleSaveContenido = () => {
    setOpenModalLoading(true);
    let isValid = validateFields();
    if (isValid) {
      if (contenidoObject._id) {
        // EDITAR
        handleEditContenido();
      } else {
        // CREAR
        handleCreateContenido();
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
    getContenidos();
  }, []);

  useEffect(() => {
    if (!searchField) {
      setOpenModalLoading(true);
      getContenidos();
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
                <h4 className={classes.cardTitleWhite}>Contenidos</h4>
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
                          }} />
                    }}
                  />

                  <Tooltip id="searchTooltip" title="Buscar" placement="top" classes={{ tooltip: classes.tooltip }}>
                    <div className={classes.buttonHeaderContainer}>
                      <Button key={'searchButton'} color={'primary'} round={true} variant="outlined" justIcon={true} startIcon={<Search />}
                        onClick={() => {
                          setOpenModalLoading(true);
                          getContenidos();
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
                            getContenidos();
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
                !contenidoList.length ?
                  <h2 style={{ textAlign: 'center' }}>No se encontraron contenidos en la base de datos</h2>
                  :
                  <Table
                    tableHeaderColor="success"
                    tableHead={[
                      'Código',
                      'Nombre',
                      'Descripción',
                      'Fecha de creación',
                      'Fecha ultima actualización',
                      'Acciones'
                    ]}
                    tableData={contenidoList}
                  />
              }
            </CardBody>
          </Card>

          <Card className={classes.centerContent}>
            <TablePagination page={pagePagination} count={10} onChangePage={onChangePage} totalData={totalContenidos} />
          </Card>

        </GridItem>
      </GridContainer>
      <div className={classes.containerFloatButton}>
        <Tooltip id="addTooltip" title="Crear nuevo contenido" placement="left" classes={{ tooltip: classes.tooltip }}>
          <div>
            <Button key={'searchButton'} color={'primary'} round={true} justIcon={true} startIcon={<AddIcon />}
              onClick={() => {
                setOpenModal(true);
                setContenidoObject(
                  {
                    _id: '',
                    codigo: '',
                    nombre: '',
                    descripcion: '',
                    contenidoSemana: '',
                  }
                );
              }} />
          </div>
        </Tooltip>
      </div>

      {/* Modal de creación y edicion de contenidos */}

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
                  <h4 className={classes.cardTitleWhite}>{contenidoObject._id ? 'Editar' : 'Crear'} contenido</h4>
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
                <TextField
                  id="outlined-email"
                  label="Código"
                  variant="outlined"
                  margin="dense"
                  className={classes.CustomTextField}
                  error={!contenidoObject.codigo ? true : false}
                  value={contenidoObject.codigo}
                  onChange={(event) => {
                    setContenidoObject({ ...contenidoObject, codigo: event.target.value });
                  }}
                />
                <TextField
                  id="outlined-email"
                  label="Nombre"
                  variant="outlined"
                  margin="dense"
                  className={classes.CustomTextField}
                  error={!contenidoObject.nombre ? true : false}
                  value={contenidoObject.nombre}
                  onChange={(event) => {
                    setContenidoObject({ ...contenidoObject, nombre: event.target.value });
                  }}
                />
                <TextField
                  id="outlined-email"
                  label="Descripcion"
                  variant="outlined"
                  margin="dense"
                  minRows={4}
                  maxRows={10}
                  multiline={true}
                  className={classes.CustomTextField}
                  value={contenidoObject.descripcion}
                  onChange={(event) => {
                    setContenidoObject({ ...contenidoObject, descripcion: event.target.value });
                  }}
                />
                <TextField
                  id="outlined-email"
                  label="Semana"
                  variant="outlined"
                  margin="dense"
                  className={classes.CustomTextField}
                  value={contenidoObject.contenidoSemana}
                  onChange={(event) => {
                    setContenidoObject({ ...contenidoObject, contenidoSemana: event.target.value });
                  }}
                />

              </div>
              <div className={classes.containerFooterModal} >
                <Button key={'filtersButton'} color={'primary'} round={true} variant="outlined" endIcon={<SendIcon />}
                  onClick={() => { handleSaveContenido(); }} >
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

export default withStyles(styles)(Contenidos);
