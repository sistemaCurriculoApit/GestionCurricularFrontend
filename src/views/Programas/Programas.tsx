// importacion de dependencias y servicios
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
import EditIcon from '@material-ui/icons/Edit';
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

import { AnythingObject } from '../../constants/generalConstants';
import { getProgramasPaginated, createPrograma, updatePrograma } from '../../services/programasServices';
import { getAllPlanes } from '../../services/planesServices';

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

function Programas(props: any) {
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

  const [programasList, setProgramasList] = useState([]);
  const [planesList, setPlanesList] = useState([]);
  const [totalProgramas, setTotalProgramas] = useState(0);
  const [pagePagination, setPagePagination] = useState(1);
  const [programaObject, setProgramaObject] = useState<AnythingObject>({
    _id: '',
    nombre: '',
    codigo: '',
    descripcion: '',
    plan: [],
  });

  const getPlanes = async (isEdit?: boolean, programaToEdit?: any) => {
    const response: any = await getAllPlanes({
      search: '',
    });
    const planesSelected = [];
    if (response && response.planes) {
      setPlanesList(response.planes);
      if (isEdit && programaToEdit.plan && programaToEdit.plan.length) {
        for (let i = 0; i < programaToEdit.plan.length; i++) {
          const findPlan = response.planes.find((plan: any) => plan._id === programaToEdit.plan[i]._id);
          if (findPlan) {
            planesSelected.push(findPlan);
          }
        }
      }
    }
    setProgramaObject({ ...programaToEdit, plan: planesSelected });
    setOpenModalLoading(false);
  };

  const handleOpenModal = (isEdit?: boolean, programaToEdit?: any) => {
    try {
      setOpenModal(true);
      setOpenModalLoading(true);
      getPlanes(isEdit, programaToEdit);
    } catch (error) {
      setOpenModalLoading(false);
    }
  };

  const setDataEditPrograma = (data: any) => {
    try {
      handleOpenModal(true, data);
    } catch (error) {
      setOpenModalLoading(false);
    }
  };

  const getProgramas = async (page?: any) => {
    const response: any = await getProgramasPaginated({
      page: page ? page : 0,
      search: searchField,
      dateCreationFrom: dateCreationFrom ? dateCreationFrom.toDate() : '',
      dateCreationTo: dateCreationTo ? dateCreationTo.toDate() : '',
    });
    setPagePagination(page ? page + 1 : 1);
    if (response.programas && response.programas.length) {
      const programas = response.programas.map((data: any) => ([
        data.codigo,
        data.nombre,
        data.descripcion,
        moment(data.fechaCreacion).format('D/MM/YYYY, h:mm:ss a'),
        moment(data.fechaActualizacion).format('D/MM/YYYY, h:mm:ss a'),
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
                onClick={() => setDataEditPrograma(data)} />
            </div>
          </Tooltip>
        )
      ]));
      setTotalProgramas(response.totalProgramas);
      setProgramasList(programas);
    } else {
      setTotalProgramas(0);
      setProgramasList([]);

    }
    setOpenModalLoading(false);
  };

  useEffect(() => {
    setOpenModalLoading(true);
    getProgramas();
  }, []);

  useEffect(() => {
    if (!searchField) {
      setOpenModalLoading(true);
      getProgramas();
    }
  }, [searchField]);

  const onChangePage = (page: number) => {
    setOpenModalLoading(true);
    getProgramas(page);
  };

  const validateFields = () => programaObject.codigo && programaObject.nombre;

  const handleEditPrograma = async () => {
    let programaToSave = {
      ...programaObject,
      plan: programaObject.plan.map((plan: any) => ({ _id: plan._id })),
    };
    let response: any = await updatePrograma(programaToSave, programaObject._id);
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
      setMessagesAlert('Programa editado satisfactoriamente');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
      setOpenModal(false);
      getProgramas();
    }
  };

  const handleCreatePrograma = async () => {
    let programaToSave = {
      ...programaObject,
      plan: programaObject.plan.map((plan: any) => ({ _id: plan._id })),
    };
    let response: any = await createPrograma(programaToSave);
    if (response && response.error) {
      setSeverityAlert('error');
      setShowAlert(true);
      setMessagesAlert(response.descripcion || 'Ha ocurrido un error intentando crear, por favor intentelo de nuevo');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
      setOpenModalLoading(false);
    } else {
      setShowAlert(true);
      setSeverityAlert('success');
      setMessagesAlert('Programa creado satisfactoriamente');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
      setOpenModal(false);
      getProgramas();
    }
  };

  const handleSavePrograma = () => {
    setOpenModalLoading(true);
    let isValid = validateFields();
    if (isValid) {
      if (programaObject._id) {
        handleEditPrograma();
      } else {
        handleCreatePrograma();
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
                <h4 className={classes.cardTitleWhite}>Programas</h4>
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
                          getPlanes();
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
                            getPlanes();
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
                !programasList.length ?
                  <h2 style={{ textAlign: 'center' }}>No se encontraron programas en la base de datos</h2>
                  :
                  <Table
                    tableHeaderColor="success"
                    tableHead={[
                      'Código',
                      'Nombre',
                      'Descripcion',
                      'Fecha de creación',
                      'Fecha ultima actualización',
                      'Acciones'
                    ]}
                    tableData={programasList}
                  />
              }
            </CardBody>
          </Card>

          <Card className={classes.centerContent}>
            <TablePagination page={pagePagination} onChangePage={onChangePage} totalData={totalProgramas} />
          </Card>

        </GridItem>
      </GridContainer>
      <div className={classes.containerFloatButton}>
        <Tooltip id="addTooltip" title="Crear nuevo programa" placement="left" classes={{ tooltip: classes.tooltip }}>
          <div>
            <Button key={'searchButton'} color={'primary'} round={true} justIcon={true} startIcon={<AddIcon />}
              onClick={() => {
                handleOpenModal(false,
                  {
                    _id: '',
                    nombre: '',
                    codigo: '',
                    descripcion: '',
                    plan: [],
                  }
                );
              }}
            />
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
                  <h4 className={classes.cardTitleWhite}>{programaObject._id ? 'Editar' : 'Crear'} programa</h4>
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
                      error={!programaObject.codigo ? true : false}
                      value={programaObject.codigo}
                      onChange={(event) => {
                        setProgramaObject({ ...programaObject, codigo: event.target.value });
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
                      error={!programaObject.nombre ? true : false}
                      value={programaObject.nombre}
                      onChange={(event) => {
                        setProgramaObject({ ...programaObject, nombre: event.target.value });
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
                      value={programaObject.descripcion}
                      onChange={(event) => {
                        setProgramaObject({ ...programaObject, descripcion: event.target.value });
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12} >
                    <Autocomplete
                      multiple={true}
                      id="tags-outlined"
                      options={planesList}
                      getOptionLabel={(option) => `${option.codigo} - ${option.nombre}`}
                      filterSelectedOptions={true}
                      value={programaObject.plan}
                      onChange={(event, value) => {
                        setProgramaObject({ ...programaObject, plan: value });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          id="outlined-email"
                          label="Planes"
                          variant="outlined"
                          margin="dense"
                          className={classes.CustomTextField}
                        />
                      )}
                    />

                  </GridItem>
                </GridContainer>
              </div>
              <div className={classes.containerFooterModal} >
                <Button key={'filtersButton'} color={'primary'} round={true} variant="outlined" endIcon={<SendIcon />}
                  onClick={() => { handleSavePrograma(); }} >
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

export default withStyles(styles)(Programas);
