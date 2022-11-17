import React, { useState, useEffect } from 'react';
import MomentUtils from '@date-io/moment';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import Modal from '@material-ui/core/Modal';
import Autocomplete from '@material-ui/lab/Autocomplete';
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

import { AnythingObject } from '../../constants/generalConstants';
import { getAreasPaginated, createArea, updateArea } from '../../services/areasServices';
import { getAllAsignaturas } from '../../services/asignaturasServices';

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

function Areas(props: any) {
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
  const [isEdit, setIsEdit] = useState<boolean>();
  const [areasList, setAreasList] = useState([]);
  const [asignaturasList, setAsignaturasList] = useState([]);
  const [totalAreas, setTotalAreas] = useState(0);
  const [pagePagination, setPagePagination] = useState(1);
  const [areaObject, setAreaObject] = useState<AnythingObject>({
    _id: '',
    nombre: '',
    codigo: '',
    descripcion: '',
    asignatura: [],
  });

  const validateFields = () => (areaObject.codigo && areaObject.nombre);

  const getAsignaturas = async (isEdit?: boolean, areaToEdit?: any) => {
    let response: any = await getAllAsignaturas({
      search: '',
    });
    let asignaturasSelected = [];
    if (response && response.asignaturas) {
      setAsignaturasList(response.asignaturas);
      if (isEdit && areaToEdit.asignatura && areaToEdit.asignatura.length) {
        for (let i = 0; i < areaToEdit.asignatura.length; i++) {
          let findAsignatura = response.asignaturas.find((asignatura: any) => asignatura._id === areaToEdit.asignatura[i]._id);
          if (findAsignatura) {
            asignaturasSelected.push(findAsignatura);
          }
        }
      }
    }
    setAreaObject({ ...areaToEdit, asignatura: asignaturasSelected });
    setOpenModalLoading(false);
  };

  const handleOpenModal = (isEdit?: boolean, areaToEdit?: any) => {
    try {
      setOpenModal(true);
      setOpenModalLoading(true);
      getAsignaturas(isEdit, areaToEdit);
    } catch (error) {
      setOpenModalLoading(false);
    }
  };

  const setDataEditArea = (data: any) => {
    try {
      handleOpenModal(true, data);
    } catch (error) {
      setOpenModalLoading(false);
    }
  };

  const getAreas = async (page?: any) => {
    let response: any = await getAreasPaginated({
      page: page ? page : 0,
      search: searchField,
      dateCreationFrom: dateCreationFrom ? dateCreationFrom.toDate() : '',
      dateCreationTo: dateCreationTo ? dateCreationTo.toDate() : '',
    });
    setPagePagination(page ? page + 1 : 1);
    if (response.areas && response.areas.length) {
      // Se recorre respuesta con los datos obtenidos para generar un arreglo en el orden que se muestran los datos en la tabla
      let areas = response.areas.map((data: any) => {
        let arrayData = [
          data.codigo,
          data.nombre,
          data.descripcion,
          moment(data.fechaCreacion).format('D/MM/YYYY, h:mm:ss a'),
          moment(data.fechaActualizacion).format('D/MM/YYYY, h:mm:ss a'),
          (
            <Tooltip id="filterTooltip" title="Ver áreas" placement="top" classes={{ tooltip: classes.tooltip }}>
            <div className={classes.buttonHeaderContainer}>
              <Button key={'filtersButton'} color={'primary'} size="sm" round={true} variant="outlined" justIcon={true} startIcon={<VisibilityIcon />}
                onClick={() => {
                  setIsEdit(false);
                  setDataEditArea(data);
                }} />
            </div>
          </Tooltip>
          ),
          (
            <Tooltip id="filterTooltip" title="Editar" placement="top" classes={{ tooltip: classes.tooltip }}>
              <div className={classes.buttonHeaderContainer}>
                <Button key={'filtersButton'} color={'primary'} size="sm" round={true} variant="outlined" justIcon={true} startIcon={<EditIcon />}
                  onClick={() => {
                    setIsEdit(true);
                    setDataEditArea(data);
                  }} />
              </div>
            </Tooltip>
          )
        ];
        return arrayData;
      });
      setTotalAreas(response.totalAreas);
      setAreasList(areas);
    } else {
      setTotalAreas(0);
      setAreasList([]);

    }
    setOpenModalLoading(false);
  };

  useEffect(() => {
    setOpenModalLoading(true);
    getAreas();
  }, []);

  useEffect(() => {
    if (!searchField) {
      setOpenModalLoading(true);
      getAreas();
    }
  }, [searchField]);

  const onChangePage = (page: number) => {
    setOpenModalLoading(true);
    getAreas(page);
  };

  const handleCreateArea = async () => {
    let areaToSave = {
      ...areaObject,
      asignatura: areaObject.asignatura.map((asignatura: any) => ({ _id: asignatura._id })),
    };
    let response: any = await createArea(areaToSave);
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
      setMessagesAlert('Area creada satisfactoriamente');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
      setOpenModal(false);
      getAreas();
    }
  };

  const handleEditArea = async () => {
    let areaToSave = {
      ...areaObject,
      asignatura: areaObject.asignatura.map((asignatura: any) => ({ _id: asignatura._id })),
    };
    let response: any = await updateArea(areaToSave, areaObject._id);
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
      setMessagesAlert('Area editada satisfactoriamente');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
      setOpenModal(false);
      getAreas();
    }
  };

  const handleSaveAarea = () => {
    setOpenModalLoading(true);
    let isValid = validateFields();
    if (isValid) {
      if (areaObject._id) {
        // EDITAR
        handleEditArea();
      } else {
        // CREAR
        handleCreateArea();
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
    <div >
      <AlertComponent severity={severityAlert} message={messageAlert} visible={showAlert} />
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="success">
              <div className={classes.TitleFilterContainer}>
                <h4 className={classes.cardTitleWhite}>Áreas</h4>
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
                          getAreas();
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
                              />
                            </GridItem>

                            <GridItem xs={12} sm={12} md={6}>
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
                              />
                            </GridItem>
                          </GridContainer>
                        </MuiPickersUtilsProvider>
                      </div>
                      <div className={classes.containerFooterCard} >
                        <Button key={'filtersButton'} color={'primary'} round={true} variant="outlined" endIcon={<SendIcon />}
                          onClick={() => {
                            setOpenModalLoading(true);
                            getAreas();
                          }}
                        >
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
                !areasList.length ?
                  <h2 style={{ textAlign: 'center' }}>No se encontraron áreas en la base de datos</h2>
                  :
                  <Table
                    tableHeaderColor="success"
                    tableHead={[
                      'Código',
                      'Nombre',
                      'Descripcion',
                      'Fecha de creación',
                      'Fecha ultima actualización',
                      'Ver áreas',
                      'Acciones'
                    ]}
                    tableData={areasList}
                  />
              }
            </CardBody>
          </Card>

          <Card className={classes.centerContent}>
            <TablePagination page={pagePagination} onChangePage={onChangePage} totalData={totalAreas} />
          </Card>

        </GridItem>
      </GridContainer>
      <div className={classes.containerFloatButton}>
        <Tooltip id="addTooltip" title="Crear nueva área" placement="left" classes={{ tooltip: classes.tooltip }}>
          <div>
            <Button key={'searchButton'} color={'primary'} round={true} justIcon={true} startIcon={<AddIcon />}
              onClick={() => {
                handleOpenModal(false,
                  {
                    _id: '',
                    nombre: '',
                    codigo: '',
                    descripcion: '',
                    asignatura: [],
                  }
                );
                setIsEdit(true);
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
                  {
                    isEdit ?
                    <h4 className={classes.cardTitleWhite}>{areaObject._id ? 'Editar' : 'Crear'} área</h4>
                    :
                    <h4 className={classes.cardTitleWhite}>Detalles del área</h4>
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
                      id="outlined-email"
                      label="Código"
                      variant="outlined"
                      margin="dense"
                      className={classes.CustomTextField}
                      error={!areaObject.codigo ? true : false}
                      disabled={!isEdit}
                      value={areaObject.codigo}
                      onChange={(event) => {
                        setAreaObject({ ...areaObject, codigo: event.target.value });
                      }}
                    />
                  </GridItem>

                  <GridItem xs={12} sm={12} md={6} >
                    <TextField
                      id="outlined-email"
                      label="Nombre"
                      variant="outlined"
                      margin="dense"
                      className={classes.CustomTextField}
                      error={!areaObject.nombre ? true : false}
                      value={areaObject.nombre}
                      disabled={!isEdit}
                      onChange={(event) => {
                        setAreaObject({ ...areaObject, nombre: event.target.value });
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12} >
                    <TextField
                      id="outlined-email"
                      label="Descripción"
                      variant="outlined"
                      margin="dense"
                      className={classes.CustomTextField}
                      minRows={4}
                      maxRows={10}
                      multiline={true}
                      value={areaObject.descripcion}
                      disabled={!isEdit}
                      onChange={(event) => {
                        setAreaObject({ ...areaObject, descripcion: event.target.value });
                      }}
                    // value={email}
                    // onChange={(event) => setEmail(event.target.value)}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12} >
                    <Autocomplete
                      multiple={true}
                      id="tags-outlined"
                      options={asignaturasList}
                      getOptionLabel={(option) => `${option.codigo} - ${option.nombre}`}
                      filterSelectedOptions={true}
                      value={areaObject.asignatura}
                      disabled={!isEdit}
                      onChange={(event, value) => {
                        setAreaObject({ ...areaObject, asignatura: value });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          id="outlined-email"
                          label="Asignaturas"
                          variant="outlined"
                          margin="dense"
                          className={classes.CustomTextField}
                        />
                      )}
                    />

                  </GridItem>
                </GridContainer>
              </div>
              { isEdit ? (
                <div className={classes.containerFooterModal} >
                  <Button key={'filtersButton'} color={'primary'} round={true} variant="outlined" endIcon={<SendIcon />}
                    onClick={() => { handleSaveAarea(); }} >
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

export default withStyles(styles)(Areas);
