// importacion de dependencias y servicios
import React, { useState, useEffect } from 'react';
import MomentUtils from '@date-io/moment';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import Modal from '@material-ui/core/Modal';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import Tooltip from '@material-ui/core/Tooltip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Search from '@material-ui/icons/Search';
import FilterList from '@material-ui/icons/FilterList';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import SendIcon from '@material-ui/icons/Send';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
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

import { AnythingObject, userProfilesObject } from '../../constants/generalConstants';
import { getAllProgramas } from '../../services/programasServices';
import { getPlanesByListIds } from '../../services/planesServices';
import { getAreasByListIds } from '../../services/areasServices';
import { getAsignaturaByListIds } from '../../services/asignaturasServices';
import { getDocentesByListIds } from '../../services/docentesServices';
import { getAllContenidoByAsignatura } from '../../services/contenidosServices';
import { getAdvancements, createAdvancement, updateAdvancement, getAdvancementsByProfessorsEmail } from '../../services/avancesServices';

// Estilos generales usados en el modulo
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

// Inicio componente funcional con sus rescpectivas propiedades si las hubiere
function AvancesAsignaturas(props: any) {

  // Declaración de variables y estados del componente
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
  const [areasList, setAreasList] = useState([]);
  const [areaSelected, setAreaSelected] = useState<AnythingObject>({});
  const [asignaturasList, setAsignaturasList] = useState([]);
  const [asignaturaSelected, setAsignaturaSelected] = useState<AnythingObject>({});
  const [docentesList, setDocentesList] = useState([]);
  const [docenteSelected, setDocenteSelected] = useState<AnythingObject>({});
  const [contenidosList, setContenidosList] = useState([]);
  const [contenidoChecked, setContenidoChecked] = useState<any[]>([]);
  const [blockByEditAvance, setBlockByEditAvance] = useState<boolean>(false);
  const [blockCoordinatorPermissions, setBlockCoordinatorPermissions] = useState<boolean>();
  const [blockDocentePermissions, setBlockDocentePermissions] = useState<boolean>();
  const [isFirstLoading, setIsFirstLoading] = useState<boolean>(true);
  const [idProfile, setIdProfile] = useState<any>();
  const [emailUser, setEmailUser] = useState<any>();
  const [avancesList, setAvancesList] = useState([]);
  const [totalAvances, setTotalAvances] = useState(0);
  const [pagePagination, setPagePagination] = useState(1);
  const [avanceObject, setAvanceObject] = useState<AnythingObject>({
    programaId: '',
    planId: '',
    asignaturaId: '',
    docenteId: '',
    contenido: [],
    añoAvance: moment(new Date(new Date().getFullYear(), 0, 1)),
    periodo: '1',
    porcentajeAvance: null,
    descripcion: '',
  });

  const validateFields = () => (
    programaSelected._id &&
    planSelected._id &&
    areaSelected._id &&
    asignaturaSelected._id &&
    docenteSelected._id &&
    contenidoChecked.length &&
    avanceObject.añoAvance &&
    avanceObject.periodo &&
    (avanceObject.porcentajeAvance && avanceObject.porcentajeAvance > 0 && avanceObject.porcentajeAvance <= 100)
  );

  const blockCoordinatorPermission = (idProf?: any) => {
    if (!idProf) { idProf = localStorage.getItem('idProfileLoggedUser'); }

    if (blockCoordinatorPermissions !== false && blockCoordinatorPermissions !== true) {
      if (!idProf || idProfile === userProfilesObject.coor.id.toString()) {
        setBlockCoordinatorPermissions(true);
        return true;
      } else {
        setBlockCoordinatorPermissions(false);
        return false;
      }
    } else {
      return blockCoordinatorPermissions;
    }
  };

  const getProgramas = async (isEdit?: boolean, avanceToEdit?: any) => {
    let response: any = await getAllProgramas({
      search: '',
    });
    if (response && response.programas) {
      setProgramasList(response.programas);
      if (isEdit && avanceToEdit.programaId) {
        let findPrograma = response.programas.find((plan: any) => plan._id === avanceToEdit.programaId);
        if (findPrograma) {
          setProgramaSelected({ ...findPrograma });
        }
      }
    }
    if (!isEdit) {
      setOpenModalLoading(false);
      setBlockByEditAvance(false);
    }
  };

  const handleOpenModal = (isEdit?: boolean, avanceToEdit?: any) => {
    try {
      setOpenModal(true);
      setOpenModalLoading(true);
      if (!isEdit) {
        // Inicializacion de objetos
        setProgramaSelected({});
        setPlanSelected({});
        setAreaSelected({});
        setAsignaturaSelected({});
        setDocenteSelected({});
        // inicializacion de listas
        setPlanesList([]);
        setAreasList([]);
        setAsignaturasList([]);
        setDocentesList([]);
        setContenidosList([]);
        setAvanceObject(avanceToEdit);
        getProgramas(isEdit, avanceToEdit);
      } else {
        setAvanceObject(
          {
            ...avanceToEdit,
            añoAvance: moment(avanceToEdit.añoAvance)
          }
        );
        // setAvanceObject(avanceToEdit);
      }
    } catch (error) {
      setOpenModalLoading(false);
    }
  };

  const setDataEditAvance = (data: any) => {
    try {
      handleOpenModal(true, data);
    } catch (error) {
      setOpenModalLoading(false);
    }
  };

  const getAvances = async (page?: any, byEmailDocente?: boolean, emailDocente?: any) => {
    let response: any;
    if (byEmailDocente) {
      response = await getAdvancementsByProfessorsEmail({
        page: page ? page : 0,
        search: searchField,
        email: emailDocente,
        dateCreationFrom: dateCreationFrom ? dateCreationFrom.toDate() : '',
        dateCreationTo: dateCreationTo ? dateCreationTo.toDate() : '',
      });
    } else {
      response = await getAdvancements({
        paginated: true,
        page: page ? page : 0,
        search: searchField,
        dateCreationFrom: dateCreationFrom ? dateCreationFrom.toDate() : '',
        dateCreationTo: dateCreationTo ? dateCreationTo.toDate() : '',
      });
    }
    setPagePagination(page ? page + 1 : 1);
    if (response.advancements && response.advancements.length) {
      setAvancesList([]);
      // Se recorre respuesta con los datos obtenidos para generar un arreglo en el orden que se muestran los datos en la tabla
      let avances = response.advancements.map((data: any) => [
        moment(data.añoAvance).format('YYYY'),
        data.periodo,
        data.porcentajeAvance,
        data.descripcion,
        moment(data.fechaCreacion).format('D/MM/YYYY, h:mm:ss a'),
        moment(data.fechaActualizacion).format('D/MM/YYYY, h:mm:ss a'),
        (
          <Tooltip
            id="filterTooltip"
            title={!blockCoordinatorPermission() ? 'Editar' : 'Ver detalles'}
            placement="top"
            classes={{ tooltip: classes.tooltip }}
          >
            <div className={classes.buttonHeaderContainer}>
              <Button
                key={'filtersButton'}
                color={'primary'}
                size="sm"
                round={true}
                variant="outlined"
                justIcon={true}
                startIcon={!blockCoordinatorPermission() ? <EditIcon /> : <VisibilityIcon />}
                onClick={() => setDataEditAvance(data)}
              />
            </div>
          </Tooltip>
        )
      ]);
      setTotalAvances(response.totalAvances);
      setAvancesList(avances);
    } else {
      setTotalAvances(0);
      setAvancesList([]);

    }
    setOpenModalLoading(false);
  };

  const getPlanes = async (isEdit?: boolean, avanceToEdit?: any) => {
    const planIds = programaSelected.plan.map((option: any) => option._id);
    let response: any = await getPlanesByListIds({
      search: '',
      planIds
    });
    if (response && response.planes) {
      setPlanesList(response.planes);
      if (isEdit && avanceToEdit.planId) {
        let findPlan = response.planes.find((plan: any) => plan._id === avanceToEdit.planId);
        if (findPlan) {
          setPlanSelected({ ...findPlan });
        }
      }
    }
    if (!isEdit) {
      setOpenModalLoading(false);
      setBlockByEditAvance(false);
    }
  };

  const getAreas = async (isEdit?: boolean, avanceToEdit?: any) => {
    const areaIds = planSelected.area.map((option: any) => option._id);
    let response: any = await getAreasByListIds({
      search: '',
      areaIds
    });
    if (response && response.areas) {
      setAreasList(response.areas);
      if (isEdit && avanceToEdit.areaId) {
        let findArea = response.areas.find((area: any) => area._id === avanceToEdit.areaId);
        if (findArea) {
          setAreaSelected({ ...findArea });
        }
      }
    }
    if (isEdit) {
      setBlockByEditAvance(true);
      setOpenModalLoading(false);
    } else if (!isEdit) {
      setBlockByEditAvance(false);
    }
  };

  const getAsignaturas = async (isEdit?: boolean, avanceToEdit?: any) => {
    const asignaturaIds = areaSelected.asignatura.map((option: any) => option._id);
    let response: any = await getAsignaturaByListIds({
      search: '',
      asignaturaIds
    });
    if (response && response.asignaturas) {
      setAsignaturasList(response.asignaturas);
      if (isEdit && avanceToEdit.asignaturaId) {
        let findAsignatura = response.asignaturas.find((plan: any) => plan._id === avanceToEdit.asignaturaId);
        if (findAsignatura) {
          setAsignaturaSelected({ ...findAsignatura });
        }
      }
    }
    if (isEdit) {
      setBlockByEditAvance(true);
      setOpenModalLoading(false);
    } else if (!isEdit) {
      setBlockByEditAvance(false);
    }
  };

  const getDocentes = async (isEdit?: boolean, avanceToEdit?: any) => {
    const docenteIds = asignaturaSelected.docente.map((option: any) => option._id);
    let response: any = await getDocentesByListIds({
      search: '',
      docenteIds
    });
    if (response && response.docentes) {
      setDocentesList(response.docentes);
      if (isEdit && avanceToEdit.docenteId) {
        let findDocente = response.docentes.find((docente: any) => docente._id === avanceToEdit.docenteId);
        if (findDocente) {
          setDocenteSelected({ ...findDocente });
        }
      }
    }
    if (isEdit) {
      setBlockByEditAvance(true);
      setOpenModalLoading(false);
    } else if (!isEdit) {
      setBlockByEditAvance(false);
    }
  };

  const getContenidos = async (isEdit?: boolean, avanceToEdit?: any) => {
    const contenidosIds = asignaturaSelected.contenido.map((option: any) => option._id);
    let response: any = await getAllContenidoByAsignatura({
      search: '',
      contenidosIds
    });
    let contenidosSelected = [];
    if (response && response.contenidos) {
      setContenidosList(response.contenidos);
      if (isEdit && avanceToEdit.contenido && avanceToEdit.contenido.length) {
        for (let i = 0; i < avanceToEdit.contenido.length; i++) {
          let findContenido = response.contenidos.find((contenido: any) => contenido._id === avanceToEdit.contenido[i]._id);
          if (findContenido) {
            contenidosSelected.push(findContenido);
          }
        }
      }
    }
    if (isEdit) {
      setAvanceObject({ ...avanceObject, programaId: '', planId: '', areaId: '', asignaturaId: '', docenteId: '' });
      setContenidoChecked(contenidosSelected);
      setOpenModalLoading(false);
    }
  };

  const onChangePage = (page: number) => {
    setOpenModalLoading(true);
    if (idProfile === userProfilesObject.doc.id.toString()) {
      setAvancesList([]);
      getAvances(page, true, emailUser);
      setBlockDocentePermissions(true);
      setIsFirstLoading(true);
    } else {
      getAvances(page, false, null);
    }
  };

  const handleCreateAvance = async () => {
    const advancement = {
      ...avanceObject,
      programaId: programaSelected._id,
      planId: planSelected._id,
      areaId: areaSelected._id,
      asignaturaId: asignaturaSelected._id,
      docenteId: docenteSelected._id,
      contenido: contenidoChecked.map((contenido: any) => ({ _id: contenido._id })),
      añoAvance: avanceObject.añoAvance.toDate()
    };
    const response: any = await createAdvancement(advancement);
    if (!response) {
      setSeverityAlert('error');
      setShowAlert(true);
      setMessagesAlert('Ha ocurrido un error intentando crear, por favor intentelo de nuevo');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
      setOpenModalLoading(false);
    } else {
      setSeverityAlert('success');
      setShowAlert(true);
      setMessagesAlert('Avance de asignatura creado satisfactoriamente');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
      const idProf = localStorage.getItem('idProfileLoggedUser');
      const emailDocente = localStorage.getItem('userEmail');
      if (idProf === userProfilesObject.doc.id.toString()) {
        setAvancesList([]);
        getAvances(0, true, emailDocente);
        setBlockDocentePermissions(true);
        setIsFirstLoading(true);
      } else {
        getAvances(0, false, null);
      }
      setOpenModal(false);
    }
  };

  const handleEditAvance = async () => {
    const advancement = {
      ...avanceObject,
      programaId: programaSelected._id,
      planId: planSelected._id,
      areaId: areaSelected._id,
      asignaturaId: asignaturaSelected._id,
      docenteId: docenteSelected._id,
      contenido: contenidoChecked.map((contenido: any) => ({ _id: contenido._id })),
      añoAvance: avanceObject.añoAvance.toDate()
    };
    const response: any = await updateAdvancement(avanceObject._id, advancement);
    if (!response) {
      setSeverityAlert('warning');
      setShowAlert(true);
      setMessagesAlert('Ha ocurrido un error intentando actualizar, por favor intentelo de nuevo');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
      setOpenModalLoading(false);
    } else {
      setSeverityAlert('success');
      setShowAlert(true);
      setMessagesAlert('Avance de asignatura editado satisfactoriamente');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
      const idProf = localStorage.getItem('idProfileLoggedUser');
      const emailDocente = localStorage.getItem('userEmail');
      if (idProf === userProfilesObject.doc.id.toString()) {
        setAvancesList([]);
        getAvances(0, true, emailDocente);
        setBlockDocentePermissions(true);
        setIsFirstLoading(true);
      } else {
        getAvances(0, false, null);
      }
      setOpenModal(false);
    }
  };

  const handleSaveAvance = () => {
    setOpenModalLoading(true);
    let isValid = validateFields();
    if (isValid) {
      if (avanceObject._id) {
        handleEditAvance();
      } else {
        handleCreateAvance();
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
    setTotalAvances(0);
    setAvancesList([]);
    const idProf = localStorage.getItem('idProfileLoggedUser');
    setIdProfile(idProf);
    var emailDocente = localStorage.getItem('userEmail');
    setEmailUser(emailDocente);
    setOpenModalLoading(true);

    // Bloquear permisos de coordinador
    if (idProf === userProfilesObject.coor.id.toString()) {
      setBlockCoordinatorPermissions(true);
    } else {
      setBlockCoordinatorPermissions(false);
    }

    if (idProf === userProfilesObject.doc.id.toString()) {
      setAvancesList([]);
      getAvances(0, true, emailDocente);
      setBlockDocentePermissions(true);
      setIsFirstLoading(true);
    } else {
      getAvances(0, false, null);
    }
    if (openModalCreate) {
      handleOpenModal(
        false,
        {
          programaId: '',
          planId: '',
          asignaturaId: '',
          docenteId: '',
          contenido: [],
          añoAvance: moment(new Date(new Date().getFullYear(), 0, 1)),
          periodo: '1',
          porcentajeAvance: null,
          descripcion: '',
        }
      );
    }
  }, []);

  useEffect(() => {
    if (blockDocentePermissions === true && isFirstLoading === true) {
      const emailDocente = localStorage.getItem('userEmail');
      getAvances(0, true, emailDocente);
      setIsFirstLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!searchField) {
      setOpenModalLoading(true);
      getAvances();
    }
  }, [searchField]);

  useEffect(() => {
    if (programaSelected._id) {
      if (avanceObject._id) {
        getPlanes(avanceObject._id ? true : false, avanceObject);
      } else {
        getPlanes();
      }
    } else {
      // Inicializacion de objetos
      setPlanSelected({});
      setAreaSelected({});
      setAsignaturaSelected({});
      setDocenteSelected({});

      // inicializacion de listas
      setPlanesList([]);
      setAreasList([]);
      setAsignaturasList([]);
      setDocentesList([]);
      setContenidosList([]);
      setContenidoChecked([]);

    }
  }, [programaSelected]);

  useEffect(() => {
    if (planSelected._id) {
      if (avanceObject._id) {
        getAreas(avanceObject._id ? true : false, avanceObject);
      } else {
        getAreas();
      }
    } else {
      // Inicializacion de objetos
      setAreaSelected({});
      setAsignaturaSelected({});
      setDocenteSelected({});

      // inicializacion de listas
      setAreasList([]);
      setAsignaturasList([]);
      setDocentesList([]);
      setContenidosList([]);
      setContenidoChecked([]);
      setContenidoChecked([]);
    }
  }, [planSelected]);

  useEffect(() => {
    if (areaSelected._id) {
      if (avanceObject._id) {
        getAsignaturas(avanceObject._id ? true : false, avanceObject);
      } else {
        getAsignaturas();
      }
    } else {
      setAsignaturaSelected({});
      setDocenteSelected({});

      setAsignaturasList([]);
      setDocentesList([]);
      setContenidosList([]);
      setContenidoChecked([]);
    }
  }, [areaSelected]);

  useEffect(() => {
    if (asignaturaSelected._id) {
      if (avanceObject._id) {
        getDocentes(avanceObject._id ? true : false, avanceObject);
        getContenidos(avanceObject._id ? true : false, avanceObject);
      } else {
        getDocentes();
        getContenidos();
      }
    } else {
      setDocenteSelected({});

      setDocentesList([]);
      setContenidosList([]);
      setContenidoChecked([]);

    }
  }, [asignaturaSelected]);

  useEffect(() => {
    if (avanceObject._id) {
      getProgramas(true, avanceObject);
    }
  }, [avanceObject]);

  const handleToggleCheck = (value: any) => () => {
    const currentIndex = contenidoChecked.findIndex((contenido: any) => (value._id === contenido._id));
    const newChecked: any = [...contenidoChecked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setContenidoChecked(newChecked);
  };

  return (
    <div>
      <AlertComponent severity={severityAlert} message={messageAlert} visible={showAlert} />
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="success">
              <div className={classes.TitleFilterContainer}>
                <h4 className={classes.cardTitleWhite}>Avances de asignaturas</h4>
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
                          if (idProfile === userProfilesObject.doc.id.toString()) {
                            setAvancesList([]);
                            getAvances(0, true, emailUser);
                            setBlockDocentePermissions(true);
                            setIsFirstLoading(true);
                          } else {
                            getAvances(0, false, null);
                          }
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
                            if (idProfile === userProfilesObject.doc.id.toString()) {
                              setAvancesList([]);
                              getAvances(0, true, emailUser);
                              setBlockDocentePermissions(true);
                              setIsFirstLoading(true);
                            } else {
                              getAvances(0, false, null);
                            }
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
                !avancesList.length ?
                  <h2 style={{ textAlign: 'center' }}>No se encontraron avances en la base de datos</h2>
                  :
                  <Table
                    tableHeaderColor="success"
                    tableHead={[
                      'Año del avance',
                      'Periodo',
                      'Porcentaje de avance',
                      'Descripción',
                      'Fecha de creación',
                      'Fecha ultima actualización',
                      'Acciones'
                    ]}
                    tableData={avancesList}
                  />
              }
            </CardBody>
          </Card>

          <Card className={classes.centerContent}>
            <TablePagination page={pagePagination} onChangePage={onChangePage} totalData={totalAvances} />
          </Card>

        </GridItem>
      </GridContainer>
      {
        blockCoordinatorPermissions ? null :
          <div className={classes.containerFloatButton}>
            <Tooltip id="addTooltip" title="Crear nuevo avance" placement="left" classes={{ tooltip: classes.tooltip }}>
              <div>
                <Button key={'searchButton'} color={'primary'} round={true} justIcon={true} startIcon={<AddIcon />}
                  onClick={() => {
                    handleOpenModal(
                      false,
                      {
                        programaId: '',
                        planId: '',
                        asignaturaId: '',
                        docenteId: '',
                        contenido: [],
                        añoAvance: moment(new Date(new Date().getFullYear(), 0, 1)),
                        periodo: '1',
                        porcentajeAvance: null,
                        descripcion: '',
                      }
                    );
                  }}
                />
              </div>
            </Tooltip>
          </div>
      }

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
                    blockCoordinatorPermissions ?
                      <h4 className={classes.cardTitleWhite}>Detalles de avance</h4>
                      :
                      <h4 className={classes.cardTitleWhite}>{avanceObject._id ? 'Editar' : 'Crear'} avance</h4>
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

                  <GridItem xs={12} sm={12} md={4} >
                    <Autocomplete
                      id="tags-outlined"
                      options={programasList}
                      getOptionLabel={(option: any) => option._id ? `${option.codigo} - ${option.nombre}` : ''}
                      filterSelectedOptions={true}
                      disabled={(blockByEditAvance && programaSelected._id) || blockCoordinatorPermissions}
                      onChange={(e, option) => {
                        setProgramaSelected(option || {});
                        // Inicializacion de objetos
                        setPlanSelected({});
                        setAreaSelected({});
                        setAsignaturaSelected({});
                        setDocenteSelected({});

                        // inicializacion de listas
                        setPlanesList([]);
                        setAreasList([]);
                        setAsignaturasList([]);
                        setDocentesList([]);
                        setContenidosList([]);
                        setContenidoChecked([]);
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
                          helperText={!programaSelected._id ? 'Primero seleccione un programa.' : ''}
                        />
                      )}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4} >
                    <Autocomplete
                      id="tags-outlined"
                      options={planesList}
                      getOptionLabel={(option: any) => option._id ? `${option.codigo} - ${option.nombre}` : ''}
                      filterSelectedOptions={true}
                      disabled={(blockByEditAvance && planSelected._id) || blockCoordinatorPermissions}
                      onChange={(e, option) => {
                        setPlanSelected(option || {});
                        // Inicializacion de objetos
                        setAreaSelected({});
                        setAsignaturaSelected({});
                        setDocenteSelected({});

                        // inicializacion de listas
                        setAreasList([]);
                        setAsignaturasList([]);
                        setDocentesList([]);
                        setContenidosList([]);
                        setContenidoChecked([]);
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
                          helperText={!programaSelected._id ? 'Debe seleccionar un programa.' : ''}

                        />
                      )}
                    />
                  </GridItem>

                  <GridItem xs={12} sm={12} md={4} >
                    <Autocomplete
                      id="tags-outlined"
                      options={areasList}
                      getOptionLabel={(option) => option._id ? `${option.codigo} - ${option.nombre}` : ''}
                      filterSelectedOptions={true}
                      disabled={(blockByEditAvance && areaSelected._id) || blockCoordinatorPermissions}
                      onChange={(e, option) => {
                        setAreaSelected(option || {});
                        // Inicializacion de objetos
                        setAsignaturaSelected({});
                        setDocenteSelected({});

                        // inicializacion de listas
                        setAsignaturasList([]);
                        setDocentesList([]);
                        setContenidosList([]);
                        setContenidoChecked([]);

                      }}
                      value={areaSelected}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          id="outlined-rol"
                          label="Área"
                          variant="outlined"
                          margin="dense"
                          error={areaSelected && !areaSelected._id ? true : false}
                          className={classes.CustomTextField}
                          helperText={!planSelected._id ? 'Debe seleccionar un plan.' : ''}
                        />
                      )}
                    />
                  </GridItem>

                  <GridItem xs={12} sm={12} md={4} >
                    <Autocomplete
                      id="tags-outlined"
                      options={asignaturasList}
                      getOptionLabel={(option: any) => option._id ? `${option.codigo} - ${option.nombre}` : ''}
                      filterSelectedOptions={true}
                      disabled={(blockByEditAvance && asignaturaSelected._id) || blockCoordinatorPermissions}
                      onChange={(e, option) => {
                        setAsignaturaSelected(option || {});
                        // Inicializacion de objetos
                        setDocenteSelected({});

                        // inicializacion de listas
                        setDocentesList([]);
                        setContenidosList([]);
                        setContenidoChecked([]);
                      }}
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
                          helperText={!areaSelected._id ? 'Debe seleccionar una área.' : ''}
                        />
                      )}
                    />
                  </GridItem>

                  <GridItem xs={12} sm={12} md={4} >
                    <Autocomplete
                      id="tags-outlined"
                      options={docentesList}
                      getOptionLabel={(option) => option._id ? `${option.nombre} - ${option.documento}` : ''}
                      filterSelectedOptions={true}
                      disabled={(blockByEditAvance && docenteSelected._id) || blockCoordinatorPermissions}
                      onChange={(e, option) => setDocenteSelected(option || {})}
                      value={docenteSelected}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          id="outlined-rol"
                          label="Docente"
                          variant="outlined"
                          margin="dense"
                          error={docenteSelected && !docenteSelected._id ? true : false}
                          className={classes.CustomTextField}
                          helperText={!asignaturaSelected._id ? 'Debe seleccionar una asignatura.' : ''}
                        />
                      )}
                    />
                  </GridItem>

                  {
                    contenidosList.length ?
                      <>
                        <GridItem xs={12} sm={12} md={12} >
                          <hr />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={12}>
                          <h4 className={classes.cardTitleBlack}>Contenido</h4>
                          <span>A continuación seleccione los contenidos finalizados</span>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={12} >
                          <List dense={true}>
                            {contenidosList.map((contenido: any, index) => {
                              const labelId = `checkbox-list-secondary-label-${index}`;
                              return (
                                <ListItem key={index} >
                                  <ListItemText>
                                    {`${contenido.codigo} - ${contenido.nombre}`}
                                  </ListItemText>
                                  <ListItemSecondaryAction>
                                    <Checkbox
                                      edge="end"
                                      disabled={blockCoordinatorPermissions}
                                      onChange={handleToggleCheck(contenido)}
                                      checked={contenidoChecked.findIndex((check: any) => (check._id === contenido._id)) !== -1}
                                      inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                  </ListItemSecondaryAction>
                                </ListItem>
                              );
                            })}
                          </List>
                        </GridItem>
                      </>

                      : null

                  }

                  {
                    contenidoChecked.length ?
                      <>
                        <GridItem xs={12} sm={12} md={12} >
                          <hr />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                          <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={'sw'} >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <DatePicker
                                views={['year']}
                                label="Año del avance"
                                inputVariant="outlined"
                                margin="dense"
                                disabled={blockCoordinatorPermissions}
                                className={classes.CustomTextField}
                                format="YYYY"
                                value={avanceObject.añoAvance}
                                onChange={(newValue: any) => {
                                  setAvanceObject({ ...avanceObject, añoAvance: newValue });
                                }}
                                clearable={true}
                                clearLabel="Limpiar"
                              />
                              {
                                avanceObject.añoAvance && !blockCoordinatorPermissions ? (
                                  <CloseIcon onClick={(e) => setAvanceObject({ ...avanceObject, añoAvance: null })} />
                                ) : null
                              }

                            </div>
                          </MuiPickersUtilsProvider>
                        </GridItem>

                        <GridItem xs={12} sm={12} md={6}>
                          <Autocomplete
                            id="tags-outlined"
                            options={['1', '2']}
                            getOptionLabel={(option) => option}
                            disabled={blockCoordinatorPermissions}
                            filterSelectedOptions={true}
                            onChange={(e, option) => setAvanceObject({ ...avanceObject, periodo: option })}
                            value={avanceObject.periodo}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                id="outlined-estado-solicitud"
                                label="Periodo"
                                variant="outlined"
                                margin="dense"
                                className={classes.CustomTextField}
                                error={avanceObject && !avanceObject.periodo ? true : false}
                              />
                            )}
                          />
                        </GridItem>

                        <GridItem xs={12} sm={12} md={12} >
                          <TextField
                            id="outlined-email"
                            label="Porcentaje aproximado"
                            variant="outlined"
                            margin="dense"
                            disabled={blockCoordinatorPermissions}
                            type={'number'}
                            className={classes.CustomTextField}
                            error={!avanceObject.porcentajeAvance || avanceObject.porcentajeAvance < 0 || avanceObject.porcentajeAvance > 100 ? true : false}
                            helperText={'Debe ser mayor a 0 y menor o igual 100.'}
                            value={avanceObject.porcentajeAvance}
                            onChange={(event) => {
                              setAvanceObject({ ...avanceObject, porcentajeAvance: event.target.value });
                            }}
                          />
                        </GridItem>

                        <GridItem xs={12} sm={12} md={12} >
                          <TextField
                            id="outlined-email"
                            label="Descripción"
                            disabled={blockCoordinatorPermissions}
                            variant="outlined"
                            margin="dense"
                            className={classes.CustomTextField}
                            minRows={4}
                            maxRows={10}
                            multiline={true}
                            value={avanceObject.descripcion}
                            onChange={(event) => {
                              setAvanceObject({ ...avanceObject, descripcion: event.target.value });
                            }}
                          />
                        </GridItem>
                      </>
                      : null
                  }

                </GridContainer>

              </div>
              {blockCoordinatorPermissions ?
                null :
                <div className={classes.containerFooterModal} >
                  <Button key={'filtersButton'} color={'primary'} round={true} variant="outlined" disabled={blockCoordinatorPermissions} endIcon={<SendIcon />}
                    onClick={() => { handleSaveAvance(); }} >
                    {'Guardar'}
                  </Button>

                </div>
              }
            </Card>
          </GridItem>
        </div>
      </Modal>
      <ModalLoading showModal={openModalLoading} />
    </div>
  );
}

export default withStyles(styles)(AvancesAsignaturas);
