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
import Search from '@material-ui/icons/Search';
import FilterList from '@material-ui/icons/FilterList';
import CloseIcon from '@material-ui/icons/Close';
import GetApp from '@material-ui/icons/GetApp';
import SendIcon from '@material-ui/icons/Send';
import VisibilityIcon from '@material-ui/icons/Visibility';
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

import { AnythingObject, tiposAsignatura } from '../../constants/generalConstants'
import { getAllProgramasNoToken } from "../../services/programasServices"
import { getPlanesByListIdsNoToken } from "../../services/planesServices"
import { getAreasByListIdsNoToken } from "../../services/areasServices"
import { getAllContenidoByAsignaturaNoToken } from "../../services/contenidosServices"
import { getAsignaturaByListIdsPaginatedNoToken, GetFileAsignatura, getAllAsignaturasWithPlanCode } from "../../services/asignaturasServices" //TODO no token
import { getAllDocentes } from "../../services/docentesServices"  //TODO no token

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
function Micrositios(props: any) {
  
  //Declaración de variables y estados del componente
  const { classes } = props;

  const [showAlert, setShowAlert] = useState(false);
  const [severityAlert, setSeverityAlert] = useState('');
  const [messageAlert, setMessagesAlert] = useState('');
  const [openModalLoading, setOpenModalLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);


  const [programasList, setProgramasList] = useState([]);
  const [programaSelected, setProgramaSelected] = useState<AnythingObject>({});
  const [planesList, setPlanesList] = useState([]);
  const [planSelected, setPlanSelected] = useState<AnythingObject>({});
  const [areasList, setAreasList] = useState([]);
  const [areaSelected, setAreaSelected] = useState<AnythingObject>({});
  const [contenidosList, setContenidosList] = useState([]);
  const [docenteList, setDocenteList] = useState([]);
  const [equivalenciaList, setEquivalenciaList] = useState([]);
  const [tipoAsignaturaSelected, setTipoAsignaturaSelected] = useState<AnythingObject>({});

  const [asignaturasList, setAsignaturasList] = useState([]);
  const [totalAsignaturas, setTotalAsignaturas] = useState(0);
  const [pagePagination, setPagePagination] = useState(1);
  const [asignaturaObject, setAsignaturaObject] = useState<AnythingObject>({
    _id: '',
    nombre: '',
    codigo: '',
    semestre: '',
    cantidadCredito: 1,
    asignaturaTipo: {},
    intensidadHorariaPractica: 0,
    intensidadHorariaTeorica: 0,
    intensidadHorariaIndependiente: 0,
    intensidadHoraria: 0,
    prerrequisitos:'',
    correquisitos:'',
    presentacionAsignatura:'',
    justificacionAsignatura:'',
    objetivoGeneral:'',
    objetivosEspecificos:'',
    competencias:'',
    mediosEducativos:'',
    evaluacion:'',
    bibliografia:'',
    cibergrafia:'',
    contenido: [],
    docente: [],
    equivalencia: []
  });

  //Al iniciar el modulo se obtienen los programas para el filtro inicial
  useEffect(() => {
    setOpenModalLoading(true);
    getProgramas(true);
  }, []);

  //Al seleccionar un programa se obtienen los planes
  useEffect(() => {
    if (programaSelected._id) {
      setOpenModalLoading(true);
      getPlanes();
    } else {
      //Inicializacion de objetos
      setPlanSelected({});
      setAreaSelected({});

      //inicializacion de listas
      setPlanesList([]);
      setAreasList([]);
      setAsignaturasList([]);
      setTotalAsignaturas(0);

    }
  }, [programaSelected]);

  //Al seleccionar un plan se obtienen las areas
  useEffect(() => {
    if (planSelected._id) {
      setOpenModalLoading(true);
      getAreas();
    } else {
      //Inicializacion de objetos
      setAreaSelected({});

      //inicializacion de listas
      setAreasList([]);
      setAsignaturasList([]);
      setTotalAsignaturas(0);
    }
  }, [planSelected]);

  //Al seleccionar una area se obtienen las asignaturas
  useEffect(() => {
    if (areaSelected._id) {
      setOpenModalLoading(true);
      getAsignaturas();
    }
  }, [areaSelected]);


  const downloadCourseFormat = async(asignaturaToDownload?:any, fromObject?:boolean) => {
    setOpenModalLoading(true);
    let asignaturaToGetFile:any
    if (fromObject){
      asignaturaToGetFile = {
        ...asignaturaObject,
        asignaturaTipo: '',
        docente: asignaturaObject.docente ? asignaturaObject.docente.map((docente: any) => ({ _id: docente._id })) : null,
        contenido: asignaturaObject.contenido ? asignaturaObject.contenido.map((contenido: any) => ({ _id: contenido._id, nombre: contenido.nombre, descripcion: contenido.descripcion })) : null,
        equivalencia: asignaturaObject.equivalencia ? asignaturaObject.equivalencia.map((equivalencia: any) => ({_id: equivalencia.asignatura._id})) : null
      };
    }else{
      asignaturaToGetFile = {
        ...asignaturaToDownload,
        asignaturaTipo: '',
        docente: asignaturaToDownload.docente ? asignaturaToDownload.docente.map((docente: any) => ({ _id: docente._id })) : null,
        contenido:  asignaturaToDownload.contenido ? asignaturaToDownload.contenido.map((contenido: any) => ({ _id: contenido._id, nombre: contenido.nombre, descripcion: contenido.descripcion })) : null,
        equivalencia: asignaturaToDownload.equivalencia ? asignaturaToDownload.equivalencia.map((equivalencia: any) => ({_id: equivalencia.asignatura._id})) : null
      };
    }
    let response: any = await GetFileAsignatura(asignaturaToGetFile)
    if (!response){
      setSeverityAlert('error');
      setShowAlert(true);
      setMessagesAlert('Ocurrio un error generando el archivo PDF.');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
    }
    else{
      setSeverityAlert('success');
      setShowAlert(true);
      setMessagesAlert('archivo PDF generado satisfactoriamente.');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
    }
    setOpenModalLoading(false);
  }


  const getDataToDownloadFormat = async (asignaturaToDownload?: any) =>{
    try {
      cleanAsignaturaObjectAndSetOpenModal()
      setOpenModalLoading(true);
      setTipoAsignaturaSelected(tiposAsignatura.find((tipoAsignatura: any) => tipoAsignatura.id === asignaturaToDownload.asignaturaTipo) || {});
      let asignaturaData = await getDocentes(asignaturaToDownload);
      downloadCourseFormat(asignaturaData, false)
    } catch (error) {
      setOpenModalLoading(false);
    }
  }

  const getDocentes = async (asignaturaSelected?: any) => {
    let response: any = await getAllDocentes({
      search: '',
    });
    let docentesSelected = [];
    if (response && response.docentes) {
      setDocenteList(response.docentes);
      if (asignaturaSelected.docente && asignaturaSelected.docente.length) {
        for (let i = 0; i < asignaturaSelected.docente.length; i++) {
          let findDocente = response.docentes.find((docente: any) => docente._id === asignaturaSelected.docente[i]._id)
          if (findDocente) {
            docentesSelected.push(findDocente);
          }
        }
      }
    }
    const result = await getContenidos({ ...asignaturaSelected, docente: docentesSelected });
    return result;
  }

  const cleanAsignaturaObjectAndSetOpenModal = () => {
    setAsignaturaObject({
      _id: '',
      nombre: '',
      codigo: '',
      semestre: '',
      cantidadCredito: 1,
      asignaturaTipo: {},
      intensidadHorariaPractica: 0,
      intensidadHorariaTeorica: 0,
      intensidadHorariaIndependiente: 0,
      intensidadHoraria: 0,
      prerrequisitos:'',
      correquisitos:'',
      presentacionAsignatura:'',
      justificacionAsignatura:'',
      objetivoGeneral:'',
      objetivosEspecificos:'',
      competencias:'',
      mediosEducativos:'',
      evaluacion:'',
      bibliografia:'',
      cibergrafia:'',
      contenido: [],
      docente: [],
      equivalencia: []
    })
    setOpenModal(false)
  }


  //Metodo para la obtencion de programas
  const getProgramas = async (setByDefault?:boolean) => {
    let response: any = await getAllProgramasNoToken({
      search: '',
    });
    if (response && response.programas) {
      setProgramasList(response.programas);
      if (setByDefault){
        var findIngeniriaProgram = response.programas.find((programa:any) => programa.codigo==="1")
        if (findIngeniriaProgram){
          setProgramaSelected(findIngeniriaProgram)
          getPlanes(setByDefault, findIngeniriaProgram)
        }
      }
    }
    setOpenModalLoading(false);
  }

  //Metodo para la obtencion de planes
  const getPlanes = async (setByDefault?:boolean, programa?:any) => {
    var planIds : any 
    if (!setByDefault){
      planIds = programaSelected.plan.map((option: any) => option._id);
    }else{
      planIds = programa.plan.map((option: any) => option._id);
    }
    
    let response: any = await getPlanesByListIdsNoToken({
      search: '',
      planIds
    });
    if (response && response.planes) {
      setPlanesList(response.planes);
      if (setByDefault){
        var find8210Plan = response.planes.find((plan:any)=> plan.codigo === "8210")
        if (find8210Plan){
          setPlanSelected(find8210Plan)
          getAreas(setByDefault, find8210Plan)
        }
      }
    }
    setOpenModalLoading(false);
  }

  //Metodo para la obtencion de areas
  const getAreas = async (setByDefault?:boolean, plan?:any) => {
    var areaIds
    if (!setByDefault){
      areaIds = planSelected.area.map((option: any) => option._id);
    }else{
      areaIds = plan.area.map((option: any) => option._id);
    }
    
    let response: any = await getAreasByListIdsNoToken({
      search: '',
      areaIds
    });
    if (response && response.areas) {
      setAreasList(response.areas);
      if (setByDefault){
        var findIngArea = response.areas.find((area:any)=> area.codigo === "1")
        if (findIngArea){
          setAreaSelected(findIngArea)
        }
      }
    }
    setOpenModalLoading(false);
  }

  //Metodo para la obtencion de asignaturas
  const getAsignaturas = async (page?: any) => {
    var asignaturaIds = areaSelected.asignatura.map((option: any) => option._id);
    let response: any = await getAsignaturaByListIdsPaginatedNoToken({
      page: page ? page : 0,
      asignaturaIds
    });
    if (response && response.asignaturas && response.asignaturas.length) {
      //Se recorre respuesta con los datos obtenidos para generar un arreglo en el orden que se muestran los datos en la tabla
      let asignaturas = response.asignaturas.map((data: any) => {
        let arrayData = [
          data.codigo,
          data.nombre,
          data.cantidadCredito,
          data.intensidadHoraria,
          data.semestre,
          data.prerrequisitos,
          data.correquisitos,
          <Tooltip id='filterTooltip' title="Ver contenidos" placement='top' classes={{ tooltip: classes.tooltip }}>
            <div className={classes.buttonHeaderContainer}>
              <Button key={'filtersButton'} color={'primary'} size='sm' round variant="outlined" justIcon startIcon={<VisibilityIcon />}
                onClick={() => {
                  setOpenModal(true);
                  setOpenModalLoading(true);
                  getDocentes(data);
                }} />
            </div>
          </Tooltip>,
          <Tooltip id='filterTooltip' title="Descargar formato asignatura" placement='top' classes={{ tooltip: classes.tooltip }}>
          <div className={classes.buttonHeaderContainer}>
            <Button key={'filtersButton'} color={'primary'} size='sm' round variant="outlined" justIcon startIcon={<GetApp />}
              onClick={() => {
                getDataToDownloadFormat(data);
              }} />
          </div>
        </Tooltip>
        ];
        return arrayData;
      });
      setTotalAsignaturas(response.totalAsignaturas);
      setAsignaturasList(asignaturas);
      setOpenModalLoading(false);
    } else {
      setAsignaturasList([]);
      setTotalAsignaturas(0);
      setSeverityAlert('info');
      setShowAlert(true);
      setMessagesAlert('No se encontraron registros en la base de datos, por favor prueba con otros filtros');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
    }
  }

  //Metodo para la obtencion de contenidos segun la asignatura seleccionada
  const getContenidos = async (asignaturaSelected?: any) => {
    let response: any = await getAllContenidoByAsignaturaNoToken({
      search: '',
    });
    let contenidosSelected = [];
    if (response && response.contenidos) {
      setContenidosList(response.contenidos);
      if (asignaturaSelected.contenido && asignaturaSelected.contenido.length) {
        for (let i = 0; i < asignaturaSelected.contenido.length; i++) {
          let findContenido = response.contenidos.find((contenido: any) => contenido._id === asignaturaSelected.contenido[i]._id)
          if (findContenido) {
            contenidosSelected.push(findContenido);
          }
        }
      }
    }
    const result = await getEquivalencias({ ...asignaturaSelected, contenido: contenidosSelected });
    return result;
  }

  const getEquivalencias = async (asignaturaSelected?: any) => {
    let response: any = await getAllAsignaturasWithPlanCode({
      search: '',
    });
    let equivalenciasSelected = [];
      if (response && (response.asignaturas)){
      var newAsignaturasList = response.asignaturas.filter((item:any) => item.asignatura._id !== asignaturaSelected._id);
      setEquivalenciaList(newAsignaturasList);
      if (asignaturaSelected.equivalencia.length){
        for (let i=0; i<asignaturaSelected.equivalencia.length; i++){
          let findEquivalencia = response.asignaturas.find((asignatura:any) => asignatura.asignatura._id === asignaturaSelected.equivalencia[i]._id)
          if (findEquivalencia){
            equivalenciasSelected.push(findEquivalencia);
          }
        }
      }
    }
    setAsignaturaObject({ ...asignaturaSelected, equivalencia: equivalenciasSelected });
    const result = {...asignaturaSelected, equivalencia: equivalenciasSelected} 
    setOpenModalLoading(false);
    return result;
  }

  //Cuando se cambia de pagina se ejecuta el metodo getHomologaciones con la pagina solicitada
  const onChangePage = (page: number) => {
    setOpenModalLoading(true);
    getAsignaturas(page);
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
                <h4 className={classes.cardTitleWhite}>Micrositios</h4>
              </div>
            </CardHeader>

            <CardBody>

              <GridContainer>
                <GridItem xs={12} sm={12} md={4} >
                  <Autocomplete
                    id="tags-outlined"
                    options={programasList}
                    getOptionLabel={(option: any) => option._id ? `${option.codigo} - ${option.nombre}` : ''}
                    filterSelectedOptions
                    onChange={(e, option) => {
                      setProgramaSelected(option || {})
                      //Inicializacion de objetos
                      setPlanSelected({});
                      setAreaSelected({});

                      //inicializacion de listas
                      setPlanesList([]);
                      setAreasList([]);
                      setAsignaturasList([]);
                      setTotalAsignaturas(0);

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
                      //Inicializacion de objetos
                      setAreaSelected({});

                      //inicializacion de listas
                      setAreasList([]);
                      setAsignaturasList([]);
                      setTotalAsignaturas(0);

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
                      />
                    )}
                  />
                </GridItem>

                <GridItem xs={12} sm={12} md={4} >
                  <Autocomplete
                    id="tags-outlined"
                    options={areasList}
                    getOptionLabel={(option) => option._id ? `${option.codigo} - ${option.nombre}` : ''}
                    filterSelectedOptions
                    onChange={(e, option) => {
                      setAreaSelected(option || {});
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
                      />
                    )}
                  />
                </GridItem>

                <GridItem xs={12} sm={12} md={12} >
                  <hr />
                </GridItem>

              </GridContainer>

 
              {
                !asignaturasList.length ?
                  <h2 style={{ textAlign: 'center' }}>No se encontraron asignaturas en la base de datos</h2>
                  :
                  <Table
                    tableHeaderColor="success"
                    tableHead={[
                      'Código',
                      'Nombre',
                      'Créditos',
                      'Horas semanales',
                      'Semestre',
                      'Prerrequisitos',
                      'Correquisitos',
                      'Acciones',
                      'Descargas'
                    ]}
                    tableData={asignaturasList}
                  />
              } 
              

            </CardBody>
          </Card>

          <Card className={classes.centerContent}>
            <TablePagination page={pagePagination} onChangePage={onChangePage} totalData={totalAsignaturas} />
          </Card>

        </GridItem>
      </GridContainer>

      {/* Modal listado de contenidos por asignatura */}
      

      {/* <Modal
        open={openModal}
        // onClose={handleClose}
        className={classes.modalForm}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={classes.centerContent}>
          <GridItem xs={12} sm={8} md={8} >
            <Card className={classes.containerCardForm}>
              <CardHeader color="success">
                <div className={classes.TitleFilterContainer}>
                <div className={classes.headerActions} style={{alignItems:'left'}}>
                    <Tooltip id='filterTooltip' title="Descargar formato de asignatura" placement='top' classes={{ tooltip: classes.tooltip }}>
                      <div>
                      <Button key={'filtersButton'} color={'secondary'} size='md' round variant="outlined" justIcon startIcon={<GetApp />}
                          onClick={() => { downloadCourseFormat(null, true) }} />
                      </div>
                    </Tooltip>
                  </div>
                  <h4 className={classes.cardTitleWhite}>{asignaturaObject._id ? 'Editar' : 'Crear'} asignaturas</h4>
                  <div className={classes.headerActions}>
                    <Tooltip id='filterTooltip' title="Cerrar" placement='top' classes={{ tooltip: classes.tooltip }}>
                      <div className={classes.buttonHeaderContainer}>
                        <Button key={'filtersButton'} color={'primary'} size='sm' round variant="outlined" justIcon startIcon={<CloseIcon />}
                          onClick={() => { cleanAsignaturaObjectAndSetOpenModal() }} />
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </CardHeader >
              <div className={classes.containerFormModal} >
                <GridContainer>
                  <GridItem xs={12} sm={12} md={4} >
                    <TextField
                      id="outlined-email"
                      label="Código"
                      variant="outlined"
                      margin="dense"
                      className={classes.CustomTextField}
                      error={!asignaturaObject.codigo ? true : false}
                      value={asignaturaObject.codigo}
                      onChange={(event) => {
                        setAsignaturaObject({ ...asignaturaObject, codigo: event.target.value })
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4} >
                    <TextField
                      id="outlined-email"
                      label="Nombre"
                      variant="outlined"
                      margin="dense"
                      className={classes.CustomTextField}
                      error={!asignaturaObject.nombre ? true : false}
                      value={asignaturaObject.nombre}
                      onChange={(event) => {
                        setAsignaturaObject({ ...asignaturaObject, nombre: event.target.value })
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4} >
                    <TextField
                      id="outlined-email"
                      label="Créditos"
                      variant="outlined"
                      margin="dense"
                      className={classes.CustomTextField}
                      type={'number'}
                      error={isNaN(asignaturaObject.cantidadCredito) ? true : false}
                      value={asignaturaObject.cantidadCredito}
                      onKeyPress={ event => {
                        if(event.key === '-' || event.key === '+' || event.key === 'e') {
                          event.preventDefault();
                        }
                      }}
                      onChange={(event) => {
                        if(event.target.validity.valid){
                          setAsignaturaObject({ ...asignaturaObject, cantidadCredito: event.target.value })
                        }
                      }}
                      InputProps={{
                        inputProps: { min: 1, pattern: "[0-9]*", }
                      }}
                    />
                  </GridItem>
                   <GridItem xs={12} sm={12} md={4} >
                    <Autocomplete
                      id="tags-outlined"
                      options={tiposAsignatura}
                      getOptionLabel={(option) => option.title}
                      filterSelectedOptions
                      onChange={(e, option) => {
                        if(option.id === 0){
                          setAsignaturaObject({ ...asignaturaObject, 
                            intensidadHorariaTeorica: asignaturaObject.intensidadHorariaTeorica,
                            intensidadHorariaPractica: 0  
                          })
                        }
                        if(option.id === 1){
                          setAsignaturaObject({ ...asignaturaObject, 
                            intensidadHorariaTeorica: 0,
                            intensidadHorariaPractica: asignaturaObject.intensidadHorariaPractica
                          })
                        }
                        if(option.id === 2){
                          setAsignaturaObject({ ...asignaturaObject, 
                            intensidadHorariaTeorica: asignaturaObject.intensidadHorariaTeorica,
                            intensidadHorariaPractica: asignaturaObject.intensidadHorariaPractica
                          })
                        }
                        setTipoAsignaturaSelected(option || {})
                      }}
                      value={tipoAsignaturaSelected}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          id="outlined-estado-solicitud"
                          label="Tipo de asignatura"
                          variant="outlined"
                          margin="dense"
                          className={classes.CustomTextField}
                          error={tipoAsignaturaSelected && !tipoAsignaturaSelected.title ? true : false}
                        />
                      )}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4} >
                    <TextField
                      id="outlined-email"
                      label="Horas Trabajo Presencial Teorico"
                      variant="outlined"
                      margin="dense"
                      disabled={(tipoAsignaturaSelected.id !== 0 && tipoAsignaturaSelected.id !== 2)}
                      className={classes.CustomTextField}
                      type={'number'}
                      value={asignaturaObject.intensidadHorariaTeorica}
                      error={(tipoAsignaturaSelected.id === 0 || tipoAsignaturaSelected.id === 2) && (isNaN(asignaturaObject.intensidadHorariaTeorica) ? true : false)}
                      onKeyPress={ event => {
                        if(event.key === '-' || event.key === '+' || event.key === 'e') {
                          event.preventDefault();
                        }
                      }}
                      onChange={(event) => {
                        if(event.target.validity.valid){
                          setAsignaturaObject({ ...asignaturaObject, intensidadHorariaTeorica: event.target.value})
                        }
                      }}
                      InputProps={{
                        inputProps: { min: 0, pattern: "[0-9]*", }
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4} >
                    <TextField
                      id="outlined-email"
                      label="Horas Trabajo Presencial Practico"
                      variant="outlined"
                      margin="dense"
                      disabled={tipoAsignaturaSelected.id !== 1 && tipoAsignaturaSelected.id !== 2}
                      className={classes.CustomTextField}
                      type={'number'}
                      value={asignaturaObject.intensidadHorariaPractica}
                      error={(tipoAsignaturaSelected.id === 1 || tipoAsignaturaSelected.id === 2) && (isNaN(asignaturaObject.intensidadHorariaPractica) ? true : false)}
                      onKeyPress={ event => {
                        if(event.key === '-' || event.key === '+' || event.key === 'e') {
                          event.preventDefault();
                        }
                      }}
                      onChange={(event) => {
                        if(event.target.validity.valid){
                          setAsignaturaObject({ ...asignaturaObject, intensidadHorariaPractica: event.target.value})
                        }
                      }}
                      InputProps={{
                        inputProps: { min: 0, pattern: "[0-9]*", }
                      }}
                    />
                    </GridItem>
                  <GridItem xs={12} sm={12} md={4} >
                    <TextField
                      id="outlined-email"
                      label="Horas Trabajo Independiente"
                      variant="outlined"
                      margin="dense"
                      className={classes.CustomTextField}
                      type={'number'}
                      value={asignaturaObject.intensidadHorariaIndependiente}
                      error={isNaN(asignaturaObject.intensidadHorariaIndependiente) ? true : false}
                      onKeyPress={ event => {
                        if(event.key === '-' || event.key === '+' || event.key === 'e') {
                          event.preventDefault();
                        }
                      }}
                      onChange={(event) => {
                        if(event.target.validity.valid){
                          setAsignaturaObject({ ...asignaturaObject, intensidadHorariaIndependiente: event.target.value})
                        }
                      }}
                      InputProps={{
                        inputProps: { min: 0, pattern: "[0-9]*", }
                      }}
                    />
                   </GridItem>
                  <GridItem xs={12} sm={12} md={4} >
                    <TextField
                      id="outlined-email"
                      label="Total Horas Semanales"
                      variant="outlined"
                      margin="dense"
                      disabled={true}
                      className={classes.CustomTextField}
                      type={'number'}
                      error={!asignaturaObject.intensidadHoraria ? true : false}
                      value={asignaturaObject.intensidadHoraria}
                      onKeyPress={ event => {
                        if(event.key === '-' || event.key === '+' || event.key === 'e') {
                          event.preventDefault();
                        }
                      }}
                      onChange={(event) => {
                        if(event.target.validity.valid){
                          setAsignaturaObject({ ...asignaturaObject, intensidadHoraria: event.target.value })
                        }
                      }}
                      InputProps={{
                        inputProps: { min: 0, pattern: "[0-9]*", }
                      }}
                    />
                   </GridItem>
                  <GridItem xs={12} sm={12} md={4} >
                    <TextField
                      id="outlined-email"
                      label="Semestre"
                      variant="outlined"
                      margin="dense"
                      className={classes.CustomTextField}
                      error={!asignaturaObject.semestre ? true : false}
                      value={asignaturaObject.semestre}
                      onChange={(event) => {
                        setAsignaturaObject({ ...asignaturaObject, semestre: event.target.value })
                      }}
                    />
                   </GridItem>
                   <GridItem xs={12} sm={12} md={6} >
                    <TextField
                      id="outlined-email"
                      label="Prerrequisitos"
                      variant="outlined"
                      minRows={3}
                      maxRows={9}
                      multiline
                      margin="dense"
                      className={classes.CustomTextField}
                      error={!asignaturaObject.prerrequisitos ? true : false}
                      value={asignaturaObject.prerrequisitos}
                      onChange={(event) => {
                        setAsignaturaObject({ ...asignaturaObject, prerrequisitos: event.target.value })
                      }}
                    />
                   </GridItem>
                   <GridItem xs={12} sm={12} md={6} >
                    <TextField
                      id="outlined-email"
                      label="Correquisitos"
                      variant="outlined"
                      minRows={3}
                      maxRows={9}
                      multiline
                      margin="dense"
                      className={classes.CustomTextField}
                      error={!asignaturaObject.correquisitos ? true : false}
                      value={asignaturaObject.correquisitos}
                      onChange={(event) => {
                        setAsignaturaObject({ ...asignaturaObject, correquisitos: event.target.value })
                      }}
                    />
                   </GridItem>
                   <GridItem xs={12} sm={12} md={6} >
                    <TextField
                      id="outlined-email"
                      label="Presentacion de la asignatura"
                      variant="outlined"
                      minRows={3}
                      maxRows={9}
                      multiline
                      margin="dense"
                      className={classes.CustomTextField}
                      error={!asignaturaObject.presentacionAsignatura ? true : false}
                      value={asignaturaObject.presentacionAsignatura}
                      onChange={(event) => {
                        setAsignaturaObject({ ...asignaturaObject, presentacionAsignatura: event.target.value })
                      }}
                    />
                   </GridItem>
                   <GridItem xs={12} sm={12} md={6} >
                    <TextField
                      id="outlined-email"
                      label="Justificacion"
                      variant="outlined"
                      minRows={3}
                      maxRows={9}
                      multiline
                      margin="dense"
                      className={classes.CustomTextField}
                      error={!asignaturaObject.justificacionAsignatura ? true : false}
                      value={asignaturaObject.justificacionAsignatura}
                      onChange={(event) => {
                        setAsignaturaObject({ ...asignaturaObject, justificacionAsignatura: event.target.value })
                      }}
                    />
                   </GridItem>
                   <GridItem xs={12} sm={12} md={6} >
                    <TextField
                      id="outlined-email"
                      label="Objetivo General"
                      variant="outlined"
                      minRows={3}
                      maxRows={9}
                      multiline
                      margin="dense"
                      className={classes.CustomTextField}
                      error={!asignaturaObject.objetivoGeneral ? true : false}
                      value={asignaturaObject.objetivoGeneral}
                      onChange={(event) => {
                        setAsignaturaObject({ ...asignaturaObject, objetivoGeneral: event.target.value })
                      }}
                    />
                   </GridItem>
                   <GridItem xs={12} sm={12} md={6} >
                    <TextField
                      id="outlined-email"
                      label="Objetivos Especificos"
                      variant="outlined"
                      minRows={3}
                      maxRows={9}
                      multiline
                      margin="dense"
                      className={classes.CustomTextField}
                      error={!asignaturaObject.objetivosEspecificos ? true : false}
                      value={asignaturaObject.objetivosEspecificos}
                      onChange={(event) => {
                        setAsignaturaObject({ ...asignaturaObject, objetivosEspecificos: event.target.value })
                      }}
                    />
                   </GridItem>
                   <GridItem xs={12} sm={12} md={4} >
                    <TextField
                      id="outlined-email"
                      label="Competencias a Desarrollar"
                      variant="outlined"
                      minRows={5}
                      maxRows={10}
                      multiline
                      margin="dense"
                      className={classes.CustomTextField}
                      error={!asignaturaObject.competencias ? true : false}
                      value={asignaturaObject.competencias}
                      onChange={(event) => {
                        setAsignaturaObject({ ...asignaturaObject, competencias: event.target.value })
                      }}
                    />
                   </GridItem>
                   <GridItem xs={12} sm={12} md={4} >
                    <TextField
                      id="outlined-email"
                      label="Medios Educativos"
                      variant="outlined"
                      minRows={5}
                      maxRows={10}
                      multiline
                      margin="dense"
                      className={classes.CustomTextField}
                      error={!asignaturaObject.mediosEducativos ? true : false}
                      value={asignaturaObject.mediosEducativos}
                      onChange={(event) => {
                        setAsignaturaObject({ ...asignaturaObject, mediosEducativos: event.target.value })
                      }}
                    />
                   </GridItem>
                   <GridItem xs={12} sm={12} md={4} >
                    <TextField
                      id="outlined-email"
                      label="Evaluacion"
                      variant="outlined"
                      minRows={5}
                      maxRows={10}
                      multiline
                      margin="dense"
                      className={classes.CustomTextField}
                      value={asignaturaObject.evaluacion}
                      onChange={(event) => {
                        setAsignaturaObject({ ...asignaturaObject, evaluacion: event.target.value })
                      }}
                    />
                   </GridItem>
                  <GridItem xs={12} sm={12} md={12} >
                    <Autocomplete
                      multiple
                      id="tags-outlined"
                      options={docenteList}
                      getOptionLabel={(option: any) => `${option.nombre} - ${option.documento}`}
                      filterSelectedOptions
                      value={asignaturaObject.docente}
                      onChange={(e, value) => {
                        setAsignaturaObject({ ...asignaturaObject, docente: value })
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          id="outlined-email"
                          label="Docentes"
                          variant="outlined"
                          margin="dense"
                          className={classes.CustomTextField}
                        />
                      )}
                    />
                   </GridItem>
                  <GridItem xs={12} sm={12} md={6} >
                    <Autocomplete
                      multiple
                      id="tags-outlined"
                      options={contenidosList}
                      getOptionLabel={(option: any) => `${option.codigo} - ${option.nombre}`}
                      filterSelectedOptions
                      value={asignaturaObject.contenido}
                      onChange={(e, value) => {
                        setAsignaturaObject({ ...asignaturaObject, contenido: value })
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          id="outlined-email"
                          label="Contenidos"
                          variant="outlined"
                          margin="dense"
                          className={classes.CustomTextField}
                        />
                      )}
                    />

                   </GridItem>
                  <GridItem xs={12} sm={12} md={6}> 
                  <Autocomplete
                      multiple
                      id="tags-outlined"
                      options={equivalenciaList}
                      getOptionLabel={(option: any) => `${option.codigoPlan}: ${option.asignatura.codigo} - ${option.asignatura.nombre}`}
                      filterSelectedOptions
                      value={asignaturaObject.equivalencia}
                      onChange={(e, value) => {
                        setAsignaturaObject({ ...asignaturaObject, equivalencia: value })
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          id="outlined-email"
                          label="Equivalencias"
                          variant="outlined"
                          margin="dense"
                          className={classes.CustomTextField}
                        />
                      )}
                    />
                   </GridItem>
                   <GridItem xs={12} sm={12} md={6} >
                    <TextField
                      id="outlined-email"
                      label="Bibliografia"
                      variant="outlined"
                      minRows={4}
                      maxRows={10}
                      multiline
                      margin="dense"
                      className={classes.CustomTextField}
                      value={asignaturaObject.bibliografia}
                      onChange={(event) => {
                        setAsignaturaObject({ ...asignaturaObject, bibliografia: event.target.value })
                      }}
                    />
                   </GridItem>
                   <GridItem xs={12} sm={12} md={6} >
                    <TextField
                      id="outlined-email"
                      label="Cibergrafia"
                      variant="outlined"
                      minRows={4}
                      maxRows={10}
                      multiline
                      margin="dense"
                      className={classes.CustomTextField}
                      value={asignaturaObject.cibergrafia}
                      onChange={(event) => {
                        setAsignaturaObject({ ...asignaturaObject, cibergrafia: event.target.value })
                      }}
                    />
                   </GridItem>
                </GridContainer>
              </div>
              <div className={classes.containerFooterModal} >
                <Button key={'filtersButton'} color={'primary'} round variant="outlined" endIcon={<SendIcon />}
                  onClick={() => { console.log("save") }} >
                  {'Guardar'}
                </Button>

              </div>

            </Card>
          </GridItem>
        </div>
      </Modal >
      <ModalLoading showModal={openModalLoading} /> */}

      <Modal
        open={openModal}
        className={classes.modalForm}
      >
        <div className={classes.centerContent}>
          <GridItem xs={12} sm={8} md={8} >
            <Card className={classes.container}>
              <CardHeader color="success">
                <div className={classes.TitleFilterContainer}>
                  <div className={classes.headerActions}>
                  <Tooltip id='filterTooltip' title="Descargar formato de asignatura" placement='top' classes={{ tooltip: classes.tooltip }}>
                      <div>
                      <Button key={'filtersButton'} color={'secondary'} size='md' round variant="outlined" justIcon startIcon={<GetApp />}
                          onClick={() => { downloadCourseFormat(null, true) }} />
                      </div>
                    </Tooltip>
                  </div>
                  <h4 className={classes.cardTitleWhite}>Detalle de asignatura</h4>
                  <div className={classes.headerActions}>
                    <Tooltip id='filterTooltip' title="Cerrar" placement='top' classes={{ tooltip: classes.tooltip }}>
                      <div className={classes.buttonHeaderContainer}>
                        <Button key={'filtersButton'} color={'primary'} size='sm' round variant="outlined" justIcon startIcon={<CloseIcon />}
                          onClick={() => { cleanAsignaturaObjectAndSetOpenModal() }} />
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </CardHeader >
              <div className={classes.containerFormModal} >
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12} >
                    {
                      !contenidosList.length ?
                        <h2 style={{ textAlign: 'center' }}>No se encontraron contenidos en la base de datos</h2>
                        :
                        // <Table
                        //   tableHeaderColor="success"
                        //   tableHead={[
                        //     'Código',
                        //     'Nombre',
                        //     'Descripción',
                        //     'Fecha de creación',
                        //     'Fecha ultima actualización'
                        //   ]}
                        //   tableData={contenidosList}
                        // />
                        <h2>{asignaturaObject.codigo}</h2>
                    }
                  </GridItem>
                </GridContainer>
              </div>
            </Card>
          </GridItem>
        </div>
      </Modal>

      <ModalLoading showModal={openModalLoading} />

    </div>
  );
}

export default withStyles(styles)(Micrositios);
