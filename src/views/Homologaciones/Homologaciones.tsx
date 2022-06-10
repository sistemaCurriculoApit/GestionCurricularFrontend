//importacion de dependencias y servicios
import React, { useState, useEffect } from 'react';
import MomentUtils from "@date-io/moment";
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import Modal from '@material-ui/core/Modal';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';
import Search from '@material-ui/icons/Search';
import FilterList from '@material-ui/icons/FilterList';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import SendIcon from '@material-ui/icons/Send';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
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

import { AnythingObject, estadosHomologacion } from '../../constants/generalConstants'
import { getAllProgramas } from "../../services/programasServices"
import { getPlanesByListIds } from "../../services/planesServices"
import { getAllAsignaturasByPlan } from "../../services/asignaturasServices"
import { getAllContenidoByAsignatura } from "../../services/contenidosServices"
import { getAllEquivalenciaByAsignatura } from "../../services/equivalenciasServices"
import { getHomologacionesPaginated, createHomologacion, updateHomologacion } from "../../services/homologacionesServices"


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
});

//Inicio componente funcional con sus rescpectivas propiedades si las hubiere
function Homologaciones(props: any) {
  
  //Declaración de variables y estados del componente
  const { classes } = props;
  const openModalCreate = props.history.location.state ? props.history.location.state.openModalCreate : false;


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
  const [programaSelected, setProgramaSelected] = useState<AnythingObject>({});
  const [planesList, setPlanesList] = useState([]);
  const [planSelected, setPlanSelected] = useState<AnythingObject>({});
  const [asignaturasList, setAsignaturasList] = useState([]);
  const [asignaturaSelected, setAsignaturaSelected] = useState<AnythingObject>({});
  const [estadoHomologacionSelected, setEstadoHomologacionSelected] = useState<AnythingObject>({});
  const [contenidosList, setContenidosList] = useState([]);
  const [equivalenciasList, setEquivalenciasList] = useState([]);

  const [homologacionList, setHomologacionesList] = useState([]);
  const [totalHomologaciones, setTotalHomologaciones] = useState(0);
  const [pagePagination, setPagePagination] = useState(1);
  const [homologacionObject, setHomologacionObject] = useState<AnythingObject>({
    programaId: '',
    planId: '',
    asignaturaId: '',
    identificacionSolicitante: '',
    nombreSolicitante: '',
    universidadSolicitante: '',
    programaSolicitante: '',
    asignaturaSolicitante: '',
    añoHomologacion: moment(new Date()),
    fechaDecision: estadoHomologacionSelected.id !== 2 ? moment(new Date()) : null,
    periodo: '1',
    estadoHomologacion: {},
    descripcion: '',
  });

  //Al iniciar el componente se obtienen las homologaciones y si tiene redireccion del dashboard se abre la modal de creacion
  useEffect(() => {
    setOpenModalLoading(true);
    getHomologaciones();
    if (openModalCreate) {
      handleOpenModal(
        false,
        {
          programaId: '',
          planId: '',
          asignaturaId: '',
          identificacionSolicitante: '',
          nombreSolicitante: '',
          universidadSolicitante: '',
          programaSolicitante: '',
          asignaturaSolicitante: '',
          añoHomologacion: moment(new Date()),
          fechaDecision: estadoHomologacionSelected.id !== 2 ? moment(new Date()) : null,
          periodo: '1',
          estadoHomologacion: {},
          descripcion: ''
        }
      );
    }
  }, []);

  //Actualizacion de la lista de asingaturas si el componente de busqueda es modificado
  useEffect(() => {
    if (!searchField) {
      setOpenModalLoading(true);
      getHomologaciones();
    }
  }, [searchField]);

  //Accion al seleccionar un programa dentro de la modal de creacion y edicion
  useEffect(() => {
    if (programaSelected._id) {
      if (homologacionObject._id) {
        getPlanes(homologacionObject._id ? true : false, homologacionObject);
      } else {
        getPlanes();
      }
    } else {
      setPlanSelected({});
      setAsignaturaSelected({});
      setPlanesList([]);
      setAsignaturasList([]);
      setContenidosList([]);
      setEquivalenciasList([]);
    }
  }, [programaSelected]);

  //Accion al seleccionar un plan dentro de la modal de creacion y edicion
  useEffect(() => {
    if (planSelected._id) {
      if (homologacionObject._id) {
        getAsignaturas(homologacionObject._id ? true : false, homologacionObject);
      } else {
        getAsignaturas();
      }
    } else {
      setAsignaturaSelected({});
      setAsignaturasList([]);
      setContenidosList([]);
      setEquivalenciasList([]);
    }
  }, [planSelected]);

  //Accion al seleccionar una asignatura dentro de la modal de creacion y edicion
  useEffect(() => {
    if (asignaturaSelected._id) {
      if (homologacionObject._id) {
        getContenidos(homologacionObject._id ? true : false, homologacionObject);
      } else {
        getContenidos();
      }
    } else {
      setContenidosList([]);
    }
  }, [asignaturaSelected]);

  //Accion para obtener equivalencias en el moda de creacion y edicion
  useEffect(() => {
    if (asignaturaSelected._id) {
      if (homologacionObject._id) {
        getEquivalencias(homologacionObject._id ? true : false, homologacionObject);
      } else {
        getEquivalencias();
      }
    } else {
      setEquivalenciasList([]);
    }
  }, [asignaturaSelected]);


  useEffect(()=> {
    if (equivalenciasList.length > 0){
      setDescription()
    }
  })

  //Accion al seleccionar una homologacion para ser editada, carga programas planes, asginaturas y equivalencias
  useEffect(() => {
    if (homologacionObject._id) {
      getProgramas(true, homologacionObject)
    }
  }, [homologacionObject]);


  //Metodo para asignar las equivalencias por default a la descripcion de la homologacion. 
  const setDescription = async () => {
    let PlanCodeList = equivalenciasList.map((equivalencia:any) => equivalencia.codigoPlan)
    for (var i=0; i < PlanCodeList.length; i++){
      if (!homologacionObject.descripcion.includes(PlanCodeList[i])){
        if (homologacionObject.descripcion.length > 0 || i > 0){
          setHomologacionObject({ ...homologacionObject, 
            descripcion: homologacionObject.descripcion 
            + equivalenciasList.map((equivalencia:any) => `\n ${equivalencia.codigoPlan}: ${equivalencia.equivalencia.codigo} - ${equivalencia.equivalencia.nombre} `)
          });
        }else{
          setHomologacionObject({ ...homologacionObject, 
            descripcion: homologacionObject.descripcion 
            + equivalenciasList.map((equivalencia:any) => `${equivalencia.codigoPlan}: ${equivalencia.equivalencia.codigo} - ${equivalencia.equivalencia.nombre} `)
          });
        }
      } 
    }
  }

  //Metodo de obtencion de homologaciones
  const getHomologaciones = async (page?: any) => {
    //Llamado al backend y construcción de los parametros de consulta
    let response: any = await getHomologacionesPaginated({
      page: page ? page : 0,
      search: searchField,
      dateCreationFrom: dateCreationFrom ? dateCreationFrom.toDate() : '',
      dateCreationTo: dateCreationTo ? dateCreationTo.toDate() : '',
    });
    setPagePagination(page ? page + 1 : 1);
    if (response.homologaciones && response.homologaciones.length) {
      //Se recorre respuesta con los datos obtenidos para generar un arreglo en el orden que se muestran los datos en la tabla
      let homologaciones = response.homologaciones.map((data: any) => {
        let arrayData = [
          data.identificacionSolicitante,
          data.nombreSolicitante,
          data.asignaturaSolicitante,
          data.descripcion,
          moment(data.fechaCreacion).format('D/MM/YYYY, h:mm:ss a'),
          moment(data.fechaActualizacion).format('D/MM/YYYY, h:mm:ss a'),
          <Tooltip id='filterTooltip' title="Editar" placement='top' classes={{ tooltip: classes.tooltip }}>
            <div className={classes.buttonHeaderContainer}>
              <Button key={'filtersButton'} color={'primary'} size='sm' round variant="outlined" justIcon startIcon={<EditIcon />}
                onClick={() => {
                  setDataEditHomologacion(data);
                }} />
            </div>
          </Tooltip>
        ];
        return arrayData;
      });
      setTotalHomologaciones(response.totalHomologaciones);
      setHomologacionesList(homologaciones);
    } else {
      setTotalHomologaciones(0);
      setHomologacionesList([]);

    }
    setOpenModalLoading(false);
  }

  //Obtencion de los programas para la modal, cuando se crea o se edita una homologacion
  const getProgramas = async (isEdit?: boolean, homologacionToEdit?: any) => {
    let response: any = await getAllProgramas({
      search: '',
    });
    if (response && response.programas) {
      setProgramasList(response.programas);
      if (isEdit && homologacionToEdit.programaId) {
        let findPrograma = response.programas.find((plan: any) => plan._id === homologacionToEdit.programaId);
        if (findPrograma) {
          setProgramaSelected({ ...findPrograma });
        }
      }
    }
    if (!isEdit) {
      setOpenModalLoading(false);
    }
  }

  //Obtencion de los planes para la modal, cuando se crea o se edita una homologacion
  const getPlanes = async (isEdit?: boolean, homologacionToEdit?: any) => {
    const planIds = programaSelected.plan.map((option: any) => option._id);
    let response: any = await getPlanesByListIds({
      search: '',
      planIds
    });
    if (response && response.planes) {
      setPlanesList(response.planes);
      if (isEdit && homologacionToEdit.planId) {
        let findPlan = response.planes.find((plan: any) => plan._id === homologacionToEdit.planId)
        if (findPlan) {
          setPlanSelected({ ...findPlan })
        }
      }
    }
    if (!isEdit) {
      setOpenModalLoading(false);
    }
  }

  //Obtencion de las asignaturas para la modal, cuando se crea o se edita una homologacion
  const getAsignaturas = async (isEdit?: boolean, homologacionToEdit?: any) => {
    const areasIds = planSelected.area.map((option: any) => option._id);
    let response: any = await getAllAsignaturasByPlan({
      search: '',
      areasIds
    });
    if (response && response.asignaturas) {
      setAsignaturasList(response.asignaturas);
      if (isEdit && homologacionToEdit.asignaturaId) {
        let findAsignatura = response.asignaturas.find((plan: any) => plan._id === homologacionToEdit.asignaturaId)
        if (findAsignatura) {
          setAsignaturaSelected({ ...findAsignatura });
        }
      }
    }
    if (isEdit) {
      setOpenModalLoading(false);
    }
  }

  //Obtencion de los contenidos para la modal, cuando se crea o se edita una homologacion
  const getContenidos = async (isEdit?: boolean, homologacionToEdit?: any) => {
    const contenidosIds = asignaturaSelected.contenido.map((option: any) => option._id);
    let response: any = await getAllContenidoByAsignatura({
      search: '',
      contenidosIds
    });
    if (response && response.contenidos) {
      setContenidosList(response.contenidos);
    }
    if (isEdit) {
      setHomologacionObject({ ...homologacionObject, programaId: '', planId: '', asignaturaId: '' });
      setOpenModalLoading(false);
    }
  }

  //Metodo para obtener el listado de equivalencias.
  const getEquivalencias = async (isEdit?: boolean, homologacionToEdit?: any) => {
    const equivalenciasIds = asignaturaSelected.equivalencia.map((option: any) => option._id);
    let response: any = await getAllEquivalenciaByAsignatura({
      search: '',
      equivalenciasIds
    });
    if (response && response.equivalencias) {
      setEquivalenciasList(response.equivalencias);
      setHomologacionObject({ ...homologacionObject, 
        descripcion: homologacionObject.descripcion 
        + equivalenciasList.map((equivalencia:any) => `\n ${equivalencia.codigoPlan}: ${equivalencia.equivalencia.codigo} - ${equivalencia.equivalencia.nombre} `)
      });
    }
    if (isEdit) {
      setHomologacionObject({ ...homologacionObject, programaId: '', planId: '', asignaturaId: '' });
      setOpenModalLoading(false);
    }
  }

  //Cuando se cambia de pagina se ejecuta el metodo getHomologaciones con la pagina solicitada
  const onChangePage = (page: number) => {
    setOpenModalLoading(true);
    getHomologaciones(page);
  };

  //Se establecen los datos de una homologacion a editar en la modal
  const setDataEditHomologacion = (data: any) => {
    try {
      handleOpenModal(true, data);
    } catch (error) {
      setOpenModalLoading(false);
    }
  };

  //Metodo que controla la apertura de la modal con el fin de obtener toda la informacion
  const handleOpenModal = (isEdit?: boolean, homologacionToEdit?: any) => {
    try {
      setOpenModal(true);
      setOpenModalLoading(true);
      if (!isEdit) {
        setProgramaSelected({});
        setPlanSelected({});
        setAsignaturaSelected({});
        setPlanesList([]);
        setAsignaturasList([]);
        setContenidosList([]);
        setEquivalenciasList([]);
        const estado = estadosHomologacion.find((estado: any) => estado.id === 2) ;
        setEstadoHomologacionSelected(estado || {});
        setHomologacionObject(homologacionToEdit);
        setHomologacionObject({...homologacionToEdit, 
          añoHomologacion: moment(new Date()),
          fechaDecision: null });
        getProgramas(isEdit, homologacionToEdit);
      } else {
        setHomologacionObject({ ...homologacionToEdit, 
            añoHomologacion: moment(new Date(homologacionToEdit.añoHomologacion)),
            fechaDecision: homologacionToEdit.fechaDecision ? moment(new Date(homologacionToEdit.fechaDecision)) : null });
        const estado = estadosHomologacion.find((estado: any) => estado.id === homologacionToEdit.estadoHomologacion || estado.id === 2);
        setEstadoHomologacionSelected(estado || {});
      }
    } catch (error) {
      setOpenModalLoading(false);
    }
  }

  //Manejador de la accion guardar de la modal, se encarga de crear o editar
  const handleSaveHomologacion = () => {
    setOpenModalLoading(true);
    let isValid = validateFields();
    if (isValid) {
      if (homologacionObject._id) {
        //EDITAR
        handleEditHomologacion();
      } else {
        //CREAR
        handleCreateHomologacion();
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

  //Metodo para crear una Homologacion
  const handleCreateHomologacion = async () => {
    let homologacionToSave = {
      ...homologacionObject,
      programaId: programaSelected._id,
      planId: planSelected._id,
      asignaturaId: asignaturaSelected._id,
      estadoHomologacion: estadoHomologacionSelected.id,
      añoHomologacion: homologacionObject.añoHomologacion.toDate(),
      fechaDecision: estadoHomologacionSelected.id !== 2 ? moment(new Date()) : null

    };
    let response: any = await createHomologacion(homologacionToSave);
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
      setMessagesAlert('Homologación creado satisfactoriamente');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
      setOpenModal(false);
      getHomologaciones();
    }
  }

  //Metodo para editar una Homologacion
  const handleEditHomologacion = async () => {
    let fechaDecisionNew = homologacionObject.fechaDecision ? homologacionObject.fechaDecision.toDate() : moment(new Date());
    let homologacionToSave = {
      ...homologacionObject,
      programaId: programaSelected._id,
      planId: planSelected._id,
      asignaturaId: asignaturaSelected._id,
      estadoHomologacion: estadoHomologacionSelected.id,
      añoHomologacion: homologacionObject.añoHomologacion.toDate(),
      fechaDecision: estadoHomologacionSelected.id !== 2 ? fechaDecisionNew : null
    };
    let response: any = await updateHomologacion(homologacionToSave, homologacionObject._id);
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
      setMessagesAlert('Homologación editado satisfactoriamente');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
      setOpenModal(false);
      getHomologaciones();
    }
  }

  //Validacion de campos obligatorios para la creacion y edicion
  const validateFields = () => {
    if (programaSelected._id &&
      planSelected._id &&
      asignaturaSelected._id &&
      homologacionObject.identificacionSolicitante &&
      homologacionObject.nombreSolicitante &&
      homologacionObject.universidadSolicitante &&
      homologacionObject.programaSolicitante &&
      homologacionObject.asignaturaSolicitante &&
      homologacionObject.añoHomologacion &&
      homologacionObject.periodo &&
      estadoHomologacionSelected.title
    ) {
      return true;
    } else {
      return false;
    }
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
                <h4 className={classes.cardTitleWhite}>Homologaciones</h4>
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
                        <Button key={'searchButton'} color={'primary'} round variant="outlined" size='sm' justIcon startIcon={<ClearIcon />}
                          onClick={() => {
                            setSearchField('')
                          }} />
                    }}
                  />

                  <Tooltip id='searchTooltip' title="Buscar" placement='top' classes={{ tooltip: classes.tooltip }}>
                    <div className={classes.buttonHeaderContainer}>
                      <Button key={'searchButton'} color={'primary'} round variant="outlined" justIcon startIcon={<Search />}
                        onClick={() => {
                          if (searchField.length > 2 || dateCreationFrom || dateCreationTo) {
                            setOpenModalLoading(true);
                            getHomologaciones();
                          }
                        }}
                      />
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
                            if (searchField.length > 2 || dateCreationFrom || dateCreationTo) {
                              setOpenModalLoading(true);
                              getHomologaciones();
                            }
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
                !homologacionList.length ?
                  <h2 style={{ textAlign: 'center' }}>No se encontraron homologaciones en la base de datos</h2>
                  :
                  <Table
                    tableHeaderColor="success"
                    tableHead={[
                      'Identificacion del solicitante',
                      'Nombre del solicitante',
                      'Asignatura del solicitante',
                      'Descripcion',
                      'Fecha de creación',
                      'Fecha ultima actualización',
                      'Acciones'
                    ]}
                    tableData={homologacionList}
                  />
              }
            </CardBody>
          </Card>

          <Card className={classes.centerContent}>
            <TablePagination page={pagePagination} onChangePage={onChangePage} totalData={totalHomologaciones} />
          </Card>

        </GridItem>
      </GridContainer>
      <div className={classes.containerFloatButton}>
        <Tooltip id='addTooltip' title="Crear nueva homologación" placement='left' classes={{ tooltip: classes.tooltip }}>
          <div>
            <Button key={'searchButton'} color={'primary'} round justIcon startIcon={<AddIcon />}
              onClick={() => {
                handleOpenModal(false, {
                  programaId: '',
                  planId: '',
                  asignaturaId: '',
                  identificacionSolicitante: '',
                  nombreSolicitante: '',
                  universidadSolicitante: '',
                  programaSolicitante: '',
                  asignaturaSolicitante: '',
                  añoHomologacion: moment(new Date()),
                  fechaDecision: estadoHomologacionSelected.id !== 2 ? moment(new Date()) : null ,
                  periodo: '1',
                  estadoHomologacion: {},
                  descripcion: ''
                })
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
                  <h4 className={classes.cardTitleWhite}>{homologacionObject._id ? 'Editar': 'Crear'} homologación</h4>
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

                  <GridItem xs={12} sm={12} md={4} >
                    <Autocomplete
                      id="tags-outlined"
                      options={programasList}
                      getOptionLabel={(option: any) => option._id ? `${option.codigo} - ${option.nombre}` : ''}
                      filterSelectedOptions
                      onChange={(e, option) => {
                        setProgramaSelected(option || {})
                        setPlanSelected({});
                        setAsignaturaSelected({});
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
                  <GridItem xs={12} sm={12} md={4} >
                    <Autocomplete
                      id="tags-outlined"
                      options={planesList}
                      getOptionLabel={(option: any) => option._id ? `${option.codigo} - ${option.nombre}` : ''}
                      filterSelectedOptions
                      onChange={(e, option) => {
                        setPlanSelected(option || {})
                        setAsignaturaSelected({});
                      }}
                      value={planSelected}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          id="outlined-rol"
                          label="Plan"
                          variant="outlined"
                          margin="dense"
                          error={planSelected && !planSelected._id ? true : false}
                          className={classes.CustomTextField}
                          helperText={!programaSelected._id ? 'Debe seleccionar un programa.':''}

                        />
                      )}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4} >
                    <Autocomplete
                      id="tags-outlined"
                      options={asignaturasList}
                      getOptionLabel={(option: any) => option._id ? `${option.codigo} - ${option.nombre}` : ''}
                      filterSelectedOptions
                      onChange={(e, option) => setAsignaturaSelected(option || {})}
                      value={asignaturaSelected}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          id="outlined-rol"
                          label="Asignatura"
                          variant="outlined"
                          margin="dense"
                          error={asignaturaSelected && !asignaturaSelected._id ? true : false}
                          className={classes.CustomTextField}
                          helperText={!planSelected._id ? 'Debe seleccionar un plan.':''}
                        />
                      )}
                    />
                  </GridItem>

                    {/* Visualizacion de contenidos */}
                    {
                      contenidosList.length ?
                        <GridItem xs={12} sm={12} md={12}>
                          <h4 className={classes.cardTitleBlack}>Contenidos</h4>
                          {
                            contenidosList.map((contenido: any, index) => <Chip
                              key={index}
                              color={'primary'}
                              label={`${contenido.codigo} - ${contenido.nombre}`}
                            />)
                          }
                        </GridItem>
                        : null
                    }
                    <GridItem xs={12} sm={12} md={12} >
                      <br />
                    </GridItem>
                    {/* Visualizacion de equivalencias */}
                    {
                      equivalenciasList.length ?
                        <GridItem xs={12} sm={12} md={12}>
                          <h4 className={classes.cardTitleBlack}>Equivalencias</h4>
                          {
                            equivalenciasList.map((equivalencia: any, index) => 
                            <Chip
                              key={index}
                              color={'primary'}
                              label={`${equivalencia.codigoPlan}: ${equivalencia.equivalencia.codigo} - ${equivalencia.equivalencia.nombre}`}
                            />)
                          }
                        </GridItem>
                        : null
                    }
            
                  <GridItem xs={12} sm={12} md={12} >
                    <br />
                  </GridItem>

                  <GridItem xs={12} sm={12} md={12} >
                    <hr />
                  </GridItem>

                  <GridItem xs={12} sm={12} md={12}>
                    <h4 className={classes.cardTitleBlack}>Información del solicitante</h4>
                  </GridItem>

                  <GridItem xs={12} sm={12} md={6} >
                    <TextField
                      id="outlined-email"
                      label="Identificación del solicitante"
                      variant="outlined"
                      margin="dense"
                      className={classes.CustomTextField}
                      error={!homologacionObject.identificacionSolicitante ? true : false}
                      value={homologacionObject.identificacionSolicitante}
                      onChange={(event) => {
                        setHomologacionObject({ ...homologacionObject, identificacionSolicitante: event.target.value })
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} >
                    <TextField
                      id="outlined-email"
                      label="Nombre del solicitante"
                      variant="outlined"
                      margin="dense"
                      className={classes.CustomTextField}
                      error={!homologacionObject.nombreSolicitante ? true : false}
                      value={homologacionObject.nombreSolicitante}
                      onChange={(event) => {
                        setHomologacionObject({ ...homologacionObject, nombreSolicitante: event.target.value })
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} >
                    <TextField
                      id="outlined-email"
                      label="Universidad del solicitante"
                      variant="outlined"
                      margin="dense"
                      className={classes.CustomTextField}
                      error={!homologacionObject.universidadSolicitante ? true : false}
                      value={homologacionObject.universidadSolicitante}
                      onChange={(event) => {
                        setHomologacionObject({ ...homologacionObject, universidadSolicitante: event.target.value })
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} >
                    <TextField
                      id="outlined-email"
                      label="Programa del solicitante"
                      variant="outlined"
                      margin="dense"
                      className={classes.CustomTextField}
                      error={!homologacionObject.programaSolicitante ? true : false}
                      value={homologacionObject.programaSolicitante}
                      onChange={(event) => {
                        setHomologacionObject({ ...homologacionObject, programaSolicitante: event.target.value })
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} >
                    <TextField
                      id="outlined-email"
                      label="Asignatura del solicitante"
                      variant="outlined"
                      margin="dense"
                      className={classes.CustomTextField}
                      error={!homologacionObject.asignaturaSolicitante ? true : false}
                      value={homologacionObject.asignaturaSolicitante}
                      onChange={(event) => {
                        setHomologacionObject({ ...homologacionObject, asignaturaSolicitante: event.target.value })
                      }}
                    />
                  </GridItem>
                  <GridItem xs={6} sm={6} md={3}>
                    <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={"sw"} >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <DatePicker
                          views={["year"]}
                          label="Fecha de la solicitud"
                          inputVariant='outlined'
                          margin='dense'
                          className={classes.CustomTextField}
                          format="MMM DD, YYYY"
                          value={homologacionObject.añoHomologacion}
                          onChange={(newValue: any) => {
                            setHomologacionObject({ ...homologacionObject, añoHomologacion: newValue })
                          }}
                          clearable
                          clearLabel='Limpiar'
                        />
                        {
                          homologacionObject.añoHomologacion ? (
                            <CloseIcon onClick={(e) => setHomologacionObject({ ...homologacionObject, añoHomologacion: null })} />
                          ) : null
                        }

                      </div>
                    </MuiPickersUtilsProvider>
                  </GridItem>

                  <GridItem xs={6} sm={6} md={3}>
                    <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={"sw"} >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <DatePicker
                          views={["year"]}
                          label="Fecha de la decisión"
                          inputVariant='outlined'
                          disabled={true}
                          margin='dense'
                          className={classes.CustomTextField}
                          format="MMM DD, YYYY"
                          value={homologacionObject.fechaDecision}
                          onChange={(newValue: any) => {
                            setHomologacionObject({ ...homologacionObject, fechaDecision: newValue })
                          }}
                          clearable
                          clearLabel='Limpiar'
                        />

                      </div>
                    </MuiPickersUtilsProvider>
                  </GridItem>

                  <GridItem xs={12} sm={12} md={6}>
                    <Autocomplete
                      id="tags-outlined"
                      options={["1", "2"]}
                      getOptionLabel={(option) => option}
                      filterSelectedOptions
                      onChange={(e, option) => setHomologacionObject({ ...homologacionObject, periodo: option })}
                      value={homologacionObject.periodo}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          id="outlined-estado-solicitud"
                          label="Periodo"
                          variant="outlined"
                          margin="dense"
                          className={classes.CustomTextField}
                          error={homologacionObject && !homologacionObject.periodo ? true : false}
                        />
                      )}
                    />
                  </GridItem>

                  <GridItem xs={12} sm={12} md={6} >
                    <Autocomplete
                      id="tags-outlined"
                      options={estadosHomologacion}
                      getOptionLabel={(option) => option.title}
                      filterSelectedOptions
                      onChange={(e, option) => setEstadoHomologacionSelected(option || {})}
                      value={estadoHomologacionSelected}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          id="outlined-estado-solicitud"
                          label="Estado de la solicitud"
                          variant="outlined"
                          margin="dense"
                          className={classes.CustomTextField}
                          error={estadoHomologacionSelected && !estadoHomologacionSelected.title ? true : false}
                        />
                      )}
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
                      multiline
                      value={homologacionObject.descripcion}
                      onChange={(event) => {
                        setHomologacionObject({ ...homologacionObject, descripcion: event.target.value })
                      }}
                    />
                  </GridItem>

                </GridContainer>
              </div>


              <div className={classes.containerFooterModal} >
                <Button key={'filtersButton'} color={'primary'} round variant="outlined" endIcon={<SendIcon />}
                  onClick={() => { handleSaveHomologacion() }} >
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

export default withStyles(styles)(Homologaciones);
