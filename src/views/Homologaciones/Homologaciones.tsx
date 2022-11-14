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
import Chip from '@material-ui/core/Chip';
import Search from '@material-ui/icons/Search';
import FilterList from '@material-ui/icons/FilterList';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import SendIcon from '@material-ui/icons/Send';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Delete from '@material-ui/icons/Delete';
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

import { AnythingObject, estadosHomologacion } from '../../constants/generalConstants';
import { getAllProgramas } from '../../services/programasServices';
import { getPlanesByListIds } from '../../services/planesServices';
import { getAllAsignaturasByPlan } from '../../services/asignaturasServices';
import { getAllContenidoByAsignatura } from '../../services/contenidosServices';
import { getAllEquivalenciaByAsignatura } from '../../services/equivalenciasServices';
import { getHomologations, createHomologation, updateHomologations, HomologationsResponse, removeHomologations } from '../../services/homologacionesServices';
import { getAllEstudiantes } from '../../services/estudiantesServices';
import { userProfilesObject } from '../../constants/generalConstants';
import { Homologation } from '../../models';
import { homologationAdapter } from '../../util/homologationAdapter';

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
function Homologaciones(props: any) {

  // Declaración de variables y estados del componente
  const { classes } = props;
  const openModalCreate = props.history.location.state ? props.history.location.state.openModalCreate : false;

  const [showAlert, setShowAlert] = useState(false);
  const [severityAlert, setSeverityAlert] = useState('');
  const [messageAlert, setMessagesAlert] = useState('');
  const [searchField, setSearchField] = useState('');
  const [openMoreFilters, setOpenMoreFilters] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalLoading, setOpenModalLoading] = useState(false);
  const [dateCreationFrom, setDateCreationFrom] = useState<any>(null);
  const [dateCreationTo, setDateCreationTo] = useState<any>(null);

  const [programasList, setProgramasList] = useState([]);
  const [programaSelected, setProgramaSelected] = useState<AnythingObject>({});
  const [planesList, setPlanesList] = useState([]);
  const [planSelected, setPlanSelected] = useState<AnythingObject>({});
  const [asignaturasList, setAsignaturasList] = useState([]);
  const [asignaturaSelected, setAsignaturaSelected] = useState<AnythingObject>({});
  const [estudianteSelected, setEstudianteSelected] = useState<AnythingObject>({});
  const [estadoHomologacionSelected, setEstadoHomologacionSelected] = useState<AnythingObject>({});
  const [contenidosList, setContenidosList] = useState([]);
  const [equivalenciasList, setEquivalenciasList] = useState([]);
  const [estudiantesList, setEstudiantesList] = useState([]);
  const [blockEstudienteSelected, setBlockEstudianteSelected] = useState<boolean>(false);
  const [blockAdminPermissions, setBlockAdministradorPermissions] = useState<boolean>();
  const [blockCoordPermissions, setBlockCoordPermissions] = useState<boolean>();
  const [edit, setEdit] = useState<boolean>(true);
  const [isBlockEditByPermissions, setIsBlockEditByPermissions] = useState<boolean>();
  const [homologacionList, setHomologacionesList] = useState([]);
  const [totalHomologaciones, setTotalHomologaciones] = useState(0);
  const [pagePagination, setPagePagination] = useState(1);
  const [firstLoading, setFirstLoading] = useState<boolean>(true);
  const [homologacionObject, setHomologacionObject] = useState<AnythingObject>({
    _id: '',
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

  const blockStudentPermission = () => {
    const idProfile = localStorage.getItem('idProfileLoggedUser');
    if (isBlockEditByPermissions !== false && isBlockEditByPermissions !== true) {
      if (!idProfile || idProfile === userProfilesObject.est.id.toString()) {
        setIsBlockEditByPermissions(true);
        return true;
      } else {
        setIsBlockEditByPermissions(false);
        return false;
      }
    } else {
      return isBlockEditByPermissions;
    }

  };

  const cleanAndCloseModal = () => {
    setHomologacionObject({
      _id: '',
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
    setEquivalenciasList([]);
    setOpenModal(false);
  };

  const setDescription = async () => {
    let PlanCodeList = equivalenciasList.map((equivalencia: any) => equivalencia.codigoPlan);
    setHomologacionObject({
      ...homologacionObject,
      descripcion: homologacionObject.descripcion
    });
    for (var i = 0; i < PlanCodeList.length; i++) {
      if (!homologacionObject.descripcion.includes(PlanCodeList[i])) {
        if (homologacionObject.descripcion.length > 0 || i > 0) {
          setHomologacionObject({
            ...homologacionObject,
            descripcion: homologacionObject.descripcion
              + equivalenciasList.map((equivalencia: any) => `\n ${equivalencia.codigoPlan}: ${equivalencia.equivalencia.codigo} - ${equivalencia.equivalencia.nombre} `)
          });
        } else {
          setHomologacionObject({
            ...homologacionObject,
            descripcion: homologacionObject.descripcion
              + equivalenciasList.map((equivalencia: any) => `${equivalencia.codigoPlan}: ${equivalencia.equivalencia.codigo} - ${equivalencia.equivalencia.nombre} `)
          });
        }
      }
    }
  };

  const getEstudiantes = async (isEdit?: boolean, homologacionToEdit?: any) => {
    let estudiantes: any = await getAllEstudiantes();
    if (estudiantes) {
      // let programas = await getProgramas(true)
      setEstudiantesList(estudiantes.estudiantes);
      setBlockEstudianteSelected(false);
    } else {
      setEstudiantesList([]);
    }
    if (isEdit && homologacionToEdit.estudiante) {
      let findEstudiante = estudiantes.estudiantes.find((estudiante: any) => estudiante.identificacion === homologacionToEdit.estudiante.identificacion);
      if (findEstudiante) {
        setEstudianteSelected({ ...findEstudiante });
        setBlockEstudianteSelected(true);
      }
    }
    return estudiantes.estudiantes;
  };

  

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
  };

  const blockAdminPermission = () => {
    if (localStorage.getItem('idProfileLoggedUser') === userProfilesObject.admin.id.toString()) {
      setBlockAdministradorPermissions(true);
      return true;
    } else {
      setBlockAdministradorPermissions(false);
      return false;
    }
  };

  const blockCoorAreaPermission = () => {
    if (localStorage.getItem('idProfileLoggedUser') === userProfilesObject.coorArea.id.toString()) {
      setBlockCoordPermissions(true);
      return true;
    } else {
      setBlockCoordPermissions(false);
      return false;
    }
  };

  const viewTable = () => {
    let table;
    if(!isBlockEditByPermissions){
      table =[
        'Identificacion del solicitante',
        'Nombre del solicitante',
        'Asignatura del solicitante',
        'Descripcion',
        'Fecha de creación',
        'Fecha ultima actualización',
        'Ver detalles',
        'Acciones',
        'Eliminar'
      ]
    } else {
      table = [
        'Identificacion del solicitante',
        'Nombre del solicitante',
        'Asignatura del solicitante',
        'Descripcion',
        'Fecha de creación',
        'Fecha ultima actualización',
        '',
        'Acciones',
        ''
      ]
    }
    if(blockAdminPermissions || blockCoordPermissions){
      table =[
        'Identificacion del solicitante',
        'Nombre del solicitante',
        'Asignatura del solicitante',
        'Descripcion',
        'Fecha de creación',
        'Fecha ultima actualización',
        'Ver detalles',
        'Acciones',
        ''
      ]
    }
    return table;
  }
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
        setEstudianteSelected([]);
        const estado = estadosHomologacion.find((status: any) => status.id === 2);
        setEstadoHomologacionSelected(estado || {});
        setHomologacionObject(homologacionToEdit);
        setHomologacionObject({
          ...homologacionToEdit,
          añoHomologacion: moment(new Date()),
          fechaDecision: null
        });
        getEstudiantes(isEdit, homologacionToEdit);
        getProgramas(isEdit, homologacionToEdit);
      } else {
        setEstudianteSelected([]);
        setHomologacionObject({
          ...homologacionToEdit,
          añoHomologacion: moment(new Date(homologacionToEdit.añoHomologacion)),
          fechaDecision: homologacionToEdit.fechaDecision ? moment(new Date(homologacionToEdit.fechaDecision)) : null
        });
        const estado = estadosHomologacion.find((status: any) => status.id === homologacionToEdit.estadoHomologacion || status.id === 2);
        setEstadoHomologacionSelected(estado || {});
        getEstudiantes(isEdit, homologacionToEdit);
      }
    } catch (error) {
      setOpenModalLoading(false);
    }
  };

  const setDataEditHomologacion = (data: any) => {
    try {
      handleOpenModal(edit, data);
    } catch (error) {
      setOpenModalLoading(false);
    }
  };

  const setDataDeleteHomologacion = (data: any) => {
    setOpenModalDelete(true);
    setHomologacionObject({
      _id: data._id,
      actividad: data.actividad,
      lugar: data.lugar,
      tema: data.tema,
      conclusion: data.conclusion,
      fechaActa: moment(data.fechaActa),
    });
  };

  const getHomologaciones = async (page?: any) => {
    const response: any = await getHomologations({
      paginated: true,
      page: page ? page : 0,
      search: searchField,
      dateCreationFrom: dateCreationFrom ? dateCreationFrom.toDate() : '',
      dateCreationTo: dateCreationTo ? dateCreationTo.toDate() : '',
    });
    let estudiantes: any = await getEstudiantes();
    setPagePagination(page ? page + 1 : 1);
    if (response.homologations && response.homologations.length) {
      response.homologations.forEach((homologation: any) => {
        homologation.estudiante = estudiantes.find((estudiante: any) => estudiante.homologacion.find(((homologacionEst: any) => homologacionEst._id === homologation._id)));
      });
      let idProfile: any = localStorage.getItem('idProfileLoggedUser');
      let emailUser: any = localStorage.getItem('userEmail');
      let homologacionesNew: any = [];
      if (idProfile === userProfilesObject.est.id.toString()) {
        homologacionesNew = response.homologations.filter((homologacion: any) => homologacion.estudiante && homologacion.estudiante.correo === emailUser);
      } else {
        homologacionesNew = response.homologations;
      }

      // Se recorre respuesta con los datos obtenidos para generar un arreglo en el orden que se muestran los datos en la tabla

      const homologaciones = homologacionesNew.map((data: any) => [
        data.estudiante ? data.estudiante.identificacion : '',
        data.estudiante ? data.estudiante.nombre : '',
        data.asignaturaSolicitante,
        data.descripcion,
        moment(data.fechaCreacion).format('D/MM/YYYY, h:mm:ss a'),
        moment(data.fechaActualizacion).format('D/MM/YYYY, h:mm:ss a'),
        (    
          blockStudentPermission() ?  null :  
          <Tooltip 
            id="filterTooltip" 
            title="Ver Detalle de Homologacion" 
            placement="top" classes={{ tooltip: classes.tooltip }}
          >
            <div className={classes.buttonHeaderContainer}>
              <Button 
                key={'filtersButton'} 
                color={'primary'} 
                size="sm" 
                round={true} 
                variant="outlined" 
                justIcon={true} 
                startIcon={<VisibilityIcon />}
                onClick={() => {setEdit(false);
                  setDataEditHomologacion(data)}}
              />
            </div>
          </Tooltip>  
        ),
        (
          <Tooltip
            id="filterTooltip"
            title={!blockStudentPermission() ? 'Editar' : 'Ver'}
            placement="top"
            classes={{ tooltip: classes.tooltip }}>
            <div className={classes.buttonHeaderContainer}>
              <Button
                key={'filtersButton'}
                color={'primary'}
                size="sm"
                round={true}
                variant="outlined"
                justIcon={true}
                startIcon={!blockStudentPermission() ? <EditIcon /> : <VisibilityIcon />}
                onClick={() => {blockStudentPermission() ? setEdit(false) : setEdit(true);
                  setDataEditHomologacion(data)}} />
            </div>
          </Tooltip>
        ),
        (    
          blockStudentPermission() || blockAdminPermission() || blockCoorAreaPermission() ?  null :  
          <Tooltip 
            id="filterTooltip" 
            title="Eliminar homologación" 
            placement="top" classes={{ tooltip: classes.tooltip }}
          >
            <div className={classes.buttonHeaderContainer}>
              <Button 
                key={'filtersButton'} 
                color={'primary'} 
                size="sm" 
                round={true} 
                variant="outlined" 
                justIcon={true} 
                startIcon={<Delete />}
                onClick={() => setDataDeleteHomologacion(data)}
              />
            </div>
          </Tooltip>  
        )
      ]);
      setTotalHomologaciones(response.homologationsCount);
      setHomologacionesList(homologaciones);
    } else {
      setTotalHomologaciones(0);
      setHomologacionesList([]);

    }
    setOpenModalLoading(false);
  };

  const getPlanes = async (isEdit?: boolean, homologacionToEdit?: any) => {
    const planIds = programaSelected.plan.map((option: any) => option._id);
    let response: any = await getPlanesByListIds({
      search: '',
      planIds
    });
    if (response && response.planes) {
      setPlanesList(response.planes);
      if (isEdit && homologacionToEdit.planId) {
        let findPlan = response.planes.find((plan: any) => plan._id === homologacionToEdit.planId);
        if (findPlan) {
          setPlanSelected({ ...findPlan });
        }
      }
    }
    if (!isEdit) {
      setOpenModalLoading(false);
    }
  };

  const getAsignaturas = async (isEdit?: boolean, homologacionToEdit?: any) => {
    const areasIds = planSelected.area.map((option: any) => option._id);
    let response: any = await getAllAsignaturasByPlan({
      search: '',
      areasIds
    });
    if (response && response.asignaturas) {
      setAsignaturasList(response.asignaturas);
      if (isEdit && homologacionToEdit.asignaturaId) {
        let findAsignatura = response.asignaturas.find((plan: any) => plan._id === homologacionToEdit.asignaturaId);
        if (findAsignatura) {
          setAsignaturaSelected({ ...findAsignatura });
        }
      }
    }
    if (isEdit) {
      setOpenModalLoading(false);
    }
  };

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
  };

  const getEquivalencias = async (isEdit?: boolean, homologacionToEdit?: any) => {
    const equivalenciasIds = asignaturaSelected.equivalencia.map((option: any) => option._id);
    let response: any = await getAllEquivalenciaByAsignatura({
      search: '',
      equivalenciasIds
    });
    if (response && response.equivalencias) {
      setEquivalenciasList(response.equivalencias);
      setHomologacionObject({
        ...homologacionObject,
        descripcion: homologacionObject.descripcion
          + equivalenciasList.map((equivalencia: any) => `\n ${equivalencia.codigoPlan}: ${equivalencia.equivalencia.codigo} - ${equivalencia.equivalencia.nombre} `)
      });
    }
    if (isEdit) {
      setHomologacionObject({ ...homologacionObject, programaId: '', planId: '', asignaturaId: '' });
      setOpenModalLoading(false);
    }
  };

  const onChangePage = (page: number) => {
    setOpenModalLoading(true);
    getHomologaciones(page);
  };

  const validateFields = () => (programaSelected._id &&
    planSelected._id &&
    asignaturaSelected._id &&
    homologacionObject.asignaturaSolicitante &&
    homologacionObject.añoHomologacion &&
    homologacionObject.periodo &&
    estadoHomologacionSelected.title
  );

  const handleCreateHomologacion = async () => {
    const homologation: Homologation = homologationAdapter({
      ...homologacionObject,
      programaId: programaSelected._id,
      planId: planSelected._id,
      asignaturaId: asignaturaSelected._id,
      estadoHomologacion: estadoHomologacionSelected.id,
      añoHomologacion: homologacionObject.añoHomologacion.toDate(),
      fechaDecision: estadoHomologacionSelected.id !== 2 ? moment(new Date()) : null,
      identificacionSolicitante: estudianteSelected.identificacion,
      estudianteId: estudianteSelected._id
    });
    const response: any = await createHomologation(homologation);
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
      setMessagesAlert('Homologación creada satisfactoriamente');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
      cleanAndCloseModal();
      getHomologaciones();
    }
  };

  const handleEditHomologacion = async () => {
    const fechaDecisionNew = homologacionObject.fechaDecision ? homologacionObject.fechaDecision.toDate() : moment(new Date());
    const homologation: Homologation = homologationAdapter({
      ...homologacionObject,
      programaId: programaSelected._id,
      planId: planSelected._id,
      asignaturaId: asignaturaSelected._id,
      estadoHomologacion: estadoHomologacionSelected.id,
      añoHomologacion: homologacionObject.añoHomologacion.toDate(),
      fechaDecision: estadoHomologacionSelected.id !== 2 ? fechaDecisionNew : null,
      identificacionSolicitante: estudianteSelected.identificacion,
      estudianteId: estudianteSelected._id
    });
    const response: HomologationsResponse = await updateHomologations(homologacionObject._id, homologation);
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
      setMessagesAlert('Homologación editada satisfactoriamente');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
      cleanAndCloseModal();
      getHomologaciones();
    }
  };

  const handleSaveHomologacion = () => {
    setOpenModalLoading(true);
    let isValid = validateFields();
    if (isValid) {
      if (homologacionObject._id) {
        // EDITAR
        handleEditHomologacion();
      } else {
        // CREAR
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

  const handleDeleteHomologacion = async () => {
    setOpenModalLoading(true);
    const response: any = await removeHomologations(homologacionObject._id);
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
      setMessagesAlert('Homologación eliminada satisfactoriamente');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
      cleanAndCloseModal();
      setOpenModalDelete(false);
      getHomologaciones();
    }
  };

  useEffect(() => {
    blockStudentPermission();
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
          estudianteId: '',
          asignaturaSolicitante: '',
          añoHomologacion: moment(new Date()),
          fechaDecision: estadoHomologacionSelected.id !== 2 ? moment(new Date()) : null,
          periodo: '1',
          estadoHomologacion: {},
          descripcion: ''
        }
      );

      // Bloquear permisos de estudiante programa
      if (localStorage.getItem('idProfileLoggedUser') === userProfilesObject.est.id.toString()) {
        setBlockEstudianteSelected(true);
      } else {
        setBlockEstudianteSelected(false);
      }
    
      // Bloquear permisos de admin programa
      if (localStorage.getItem('idProfileLoggedUser') === userProfilesObject.admin.id.toString()) {
        setBlockAdministradorPermissions(true);
      } else {
        setBlockAdministradorPermissions(false);
      }

      // Bloquear permisos de coordinador de area programa
      if (localStorage.getItem('idProfileLoggedUser') === userProfilesObject.coorArea.id.toString()) {
        setBlockCoordPermissions(true);
      } else {
        setBlockCoordPermissions(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!searchField) {
      setOpenModalLoading(true);
      getHomologaciones();
    }
  }, [searchField]);

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

  useEffect(() => {
    if (equivalenciasList.length > 0 && firstLoading === true) {
      setDescription();
      setFirstLoading(false);
    }
  });

  useEffect(() => {
    if (homologacionObject._id) {
      getProgramas(true, homologacionObject);
    }
  }, [homologacionObject]);

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
                          if (searchField.length > 2 || dateCreationFrom || dateCreationTo) {
                            setOpenModalLoading(true);
                            getHomologaciones();
                          }
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
                    tableHead={viewTable()}
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

      {!blockStudentPermission() ?
        <div className={classes.containerFloatButton}>
          <Tooltip id="addTooltip" title="Crear nueva homologación" placement="left" classes={{ tooltip: classes.tooltip }}>
            <div>
              <Button key={'searchButton'} color={'primary'} disabled={blockStudentPermission()} round={true} justIcon={true} startIcon={<AddIcon />}
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
                    fechaDecision: estadoHomologacionSelected.id !== 2 ? moment(new Date()) : null,
                    periodo: '1',
                    estadoHomologacion: {},
                    descripcion: ''
                  });setEdit(true)
                }} />
            </div>
          </Tooltip>
        </div> : null}

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
                    isBlockEditByPermissions || !edit ?
                      <h4 className={classes.cardTitleWhite}>Ver detalles de homologación</h4>
                      :
                      <h4 className={classes.cardTitleWhite}>{homologacionObject._id ? 'Editar' : 'Crear'} homologación</h4>
                  }

                  <div className={classes.headerActions}>
                    <Tooltip id="filterTooltip" title="Cerrar" placement="top" classes={{ tooltip: classes.tooltip }}>
                      <div className={classes.buttonHeaderContainer}>
                        <Button key={'filtersButton'} color={'primary'} size="sm" round={true} variant="outlined" justIcon={true} startIcon={<CloseIcon />}
                          onClick={() => { cleanAndCloseModal(); }} />
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </CardHeader >
              <div className={classes.containerFormModal} >
                <GridContainer>

                  <GridItem xs={12} sm={12} md={12}>
                    <h4 className={classes.cardTitleBlack}>Información del solicitante</h4>
                  </GridItem>

                  <GridItem xs={12} sm={12} md={6} >
                    <Autocomplete
                      id="tags-outlined"
                      options={estudiantesList}
                      getOptionLabel={(option: any) => option._id ? `${option.identificacion} - ${option.nombre}` : ''}
                      filterSelectedOptions={true}
                      onChange={(e, option) => { setEstudianteSelected(option || {}); }}
                      value={estudianteSelected}
                      disabled={blockEstudienteSelected || isBlockEditByPermissions || !edit}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          id="outlined-rol"
                          label="Estudiante"
                          variant="outlined"
                          margin="dense"
                          error={estudianteSelected && !estudianteSelected._id ? true : false}
                          className={classes.CustomTextField}
                          helperText={!estudianteSelected._id ? 'Primero seleccione un estudiante.' : ''}
                        />
                      )}
                    />
                  </GridItem>

                  <GridItem xs={12} sm={12} md={6} >
                    <TextField
                      id="outlined-email"
                      label="Correo del estudiante"
                      variant="outlined"
                      margin="dense"
                      disabled={true}
                      className={classes.CustomTextField}
                      error={!estudianteSelected.correo ? true : false}
                      value={estudianteSelected.correo || ''}
                      onChange={(event) => {
                        setHomologacionObject({ ...homologacionObject, correoSolicitante: event.target.value });
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4} >
                    <TextField
                      id="outlined-email"
                      label="Universidad origen del estudiante"
                      variant="outlined"
                      margin="dense"
                      disabled={true}
                      className={classes.CustomTextField}
                      error={!estudianteSelected.universidadOrigen ? true : false}
                      value={estudianteSelected.universidadOrigen || ''}
                      onChange={(event) => {
                        setHomologacionObject({ ...homologacionObject, universidadSolicitante: event.target.value });
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4} >
                    <TextField
                      id="outlined-email"
                      label="Programa origen del estudiante"
                      variant="outlined"
                      margin="dense"
                      disabled={true}
                      className={classes.CustomTextField}
                      error={!estudianteSelected.programaOrigen ? true : false}
                      value={estudianteSelected.programaOrigen || ''}
                      onChange={(event) => {
                        setHomologacionObject({ ...homologacionObject, programaEstudiante: event.target.value });
                      }}
                    />
                  </GridItem>

                  <GridItem xs={12} sm={12} md={4} >
                    <TextField
                      id="outlined-email"
                      label="Plan origen del estudiante"
                      variant="outlined"
                      margin="dense"
                      disabled={true}
                      className={classes.CustomTextField}
                      error={!estudianteSelected.planOrigen ? true : false}
                      value={estudianteSelected.planOrigen || ''}
                      onChange={(event) => {
                        setHomologacionObject({ ...homologacionObject, planEstudiante: event.target.value });
                      }}
                    />
                  </GridItem>

                  <GridItem xs={12} sm={12} md={12} >
                    <br />
                  </GridItem>

                  <GridItem xs={12} sm={12} md={12} >
                    <hr />
                  </GridItem>

                  <GridItem xs={12} sm={12} md={12}>
                    <h4 className={classes.cardTitleBlack}>Información de asignatura</h4>
                  </GridItem>

                  <GridItem xs={12} sm={12} md={4} >
                    <Autocomplete
                      id="tags-outlined"
                      options={programasList}
                      getOptionLabel={(option: any) => option._id ? `${option.codigo} - ${option.nombre}` : ''}
                      filterSelectedOptions={true}
                      disabled={isBlockEditByPermissions || !edit}
                      onChange={(e, option) => {
                        setProgramaSelected(option || {});
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
                      disabled={isBlockEditByPermissions || !edit}
                      onChange={(e, option) => {
                        setPlanSelected(option || {});
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
                          helperText={!programaSelected._id ? 'Debe seleccionar un programa.' : ''}

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
                      disabled={isBlockEditByPermissions || !edit}
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
                          helperText={!planSelected._id ? 'Debe seleccionar un plan.' : ''}
                        />
                      )}
                    />
                  </GridItem>

                  {/* Visualizacion de contenidos */}
                  {
                    contenidosList.length ?
                      <GridItem xs={12} sm={12} md={12}>
                        <h5 className={classes.cardTitleBlack}>Contenidos</h5>
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
                        <h5 className={classes.cardTitleBlack}>Equivalencias</h5>
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
                    <h4 className={classes.cardTitleBlack}>Detalle de solicitud</h4>
                  </GridItem>

                  <GridItem xs={12} sm={12} md={6} >
                    <TextField
                      id="outlined-email"
                      label="Asignatura origen de solicitud"
                      variant="outlined"
                      margin="dense"
                      disabled={isBlockEditByPermissions || !edit}
                      className={classes.CustomTextField}
                      error={!homologacionObject.asignaturaSolicitante ? true : false}
                      value={homologacionObject.asignaturaSolicitante}
                      onChange={(event) => {
                        setHomologacionObject({ ...homologacionObject, asignaturaSolicitante: event.target.value });
                      }}
                    />
                  </GridItem>
                  <GridItem xs={6} sm={6} md={3}>
                    <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={'sw'} >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <DatePicker
                          views={['year']}
                          label="Fecha de la solicitud"
                          inputVariant="outlined"
                          margin="dense"
                          className={classes.CustomTextField}
                          format="MMM DD, YYYY"
                          disabled={isBlockEditByPermissions || !edit}
                          value={homologacionObject.añoHomologacion}
                          onChange={(newValue: any) => {
                            setHomologacionObject({ ...homologacionObject, añoHomologacion: newValue });
                          }}
                          clearable={true}
                          clearLabel="Limpiar"
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
                    <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={'sw'} >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <DatePicker
                          views={['year']}
                          label="Fecha de la decisión"
                          inputVariant="outlined"
                          disabled={true}
                          margin="dense"
                          className={classes.CustomTextField}
                          format="MMM DD, YYYY"
                          value={homologacionObject.fechaDecision}
                          onChange={(newValue: any) => {
                            setHomologacionObject({ ...homologacionObject, fechaDecision: newValue });
                          }}
                          clearable={true}
                          clearLabel="Limpiar"
                        />

                      </div>
                    </MuiPickersUtilsProvider>
                  </GridItem>

                  <GridItem xs={12} sm={12} md={6}>
                    <Autocomplete
                      id="tags-outlined"
                      options={['1', '2']}
                      getOptionLabel={(option) => option}
                      filterSelectedOptions={true}
                      disabled={isBlockEditByPermissions || !edit}
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
                      filterSelectedOptions={true}
                      disabled={isBlockEditByPermissions || !edit}
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
                      multiline={true}
                      disabled={isBlockEditByPermissions || !edit}
                      value={homologacionObject.descripcion}
                      onChange={(event) => {
                        setHomologacionObject({ ...homologacionObject, descripcion: event.target.value });
                      }}
                    />
                  </GridItem>

                </GridContainer>
              </div>

              {edit ?
                 <div className={classes.containerFooterModal} >
                  <Button key={'filtersButton'} color={'primary'} round={true} variant="outlined" endIcon={<SendIcon />}
                    onClick={() => { handleSaveHomologacion(); }} >
                    {'Guardar'}
                  </Button>
                </div>
                : null}
            </Card>
          </GridItem>
        </div>
      </Modal>
      <Modal
        open={openModalDelete}
        className={classes.modalForm}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={classes.centerContent}>
          <GridItem xs={6} sm={4} md={4} >
            <Card className={classes.container}>
            <CardHeader color="success">
                <div className={classes.TitleFilterContainer}>
                  <h4 className={classes.cardTitleWhite}>Eliminar homologación</h4>
                  <div className={classes.headerActions}>
                    <Tooltip id="filterTooltip" title="Cerrar" placement="top" classes={{ tooltip: classes.tooltip }}>
                      <div className={classes.buttonHeaderContainer}>
                        <Button key={'filtersButton'} color={'primary'} size="sm" round={true} variant="outlined" justIcon={true} startIcon={<CloseIcon />}
                          onClick={() => { setOpenModalDelete(false); }} />
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </CardHeader >
              <h4>¿Está seguro de que desea eliminar la siguiente homologación?</h4>
              <div>
                <Button
                  key={'filtersButton'}
                  color={'primary'}
                  round={true}
                  variant="outlined"
                  onClick={() => handleDeleteHomologacion()} >
                  {'Si'}
                </Button>
              </div>
              <div>
                <Button
                  key={'filtersButton'}
                  color={'primary'}
                  round={true}
                  variant="outlined"
                  onClick={() => setOpenModalDelete(false)} >
                  {'No'}
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
