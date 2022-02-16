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
import {
  container,
  containerFormModal,
  containerFooterModal,
  containerCardForm,
  modalForm
} from '../../assets/jss/material-dashboard-react'

import { AnythingObject } from '../../constants/generalConstants'
import { getAsignaturasPaginated, createAsignatura, updateAsignatura } from "../../services/asignaturasServices"
import { getAllDocentes } from "../../services/docentesServices"
import { getAllContenidos } from "../../services/contenidosServices"


//Estilos generales usados en el modulo
const styles = createStyles({
  CustomSearchTextFieldStyle: CustomSearchTextField.input,
  CustomTextField: CustomTextField.input,
  container,
  containerFormModal,
  containerCardForm,
  containerFooterModal,
  modalForm,
  ...cardTabletCustomStyle,
  ...tooltipStyle,
  ...containerFloatButton,
});


//Inicio componente funcional con sus rescpectivas propiedades si las hubiere
function Asignaturas(props: any) {
  
  //Declaración de variables y estados del componente
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

  const [asignaturaList, setAsignaturasList] = useState([]);
  const [contenidoList, setContenidoList] = useState([]);
  const [docenteList, setDocenteList] = useState([]);
  const [totalAsignaturas, setTotalAsignaturas] = useState(0);
  const [pagePagination, setPagePagination] = useState(1);
  const [asignaturaObject, setAsignaturaObject] = useState<AnythingObject>({
    _id: '',
    nombre: '',
    codigo: '',
    semestre: '',
    cantidadCredito: 1,
    intensidadHoraria: 1,
    contenido: [],
    docente: []
  });

  //Al iniciar el componente se obtienen las asignaturas
  useEffect(() => {
    setOpenModalLoading(true);
    getAsignaturas();
  }, [])

  //Actualizacion de la lista de asingaturas si el componente de busqueda es modificado
  useEffect(() => {
    if (!searchField) {
      setOpenModalLoading(true);
      getAsignaturas();
    }
  }, [searchField])

  
  //Metodo de obtencion de asignaturas
  const getAsignaturas = async (page?: any) => {
    //Llamado al backend y construcción de los parametros de consulta
    let response: any = await getAsignaturasPaginated({
      page: page ? page : 0,
      search: searchField,
      dateCreationFrom: dateCreationFrom ? dateCreationFrom.toDate() : '',
      dateCreationTo: dateCreationTo ? dateCreationTo.toDate() : '',
    });
    setPagePagination(page ? page + 1 : 1);
    if (response.asignaturas && response.asignaturas.length) {
      //Se recorre respuesta con los datos obtenidos para generar un arreglo en el orden que se muestran los datos en la tabla
      let asignaturas = response.asignaturas.map((data: any) => {
        let arrayData = [
          data.codigo,
          data.nombre,
          data.cantidadCredito,
          data.intensidadHoraria,
          data.semestre,
          moment(data.fechaCreacion).format('D/MM/YYYY, h:mm:ss a'),
          moment(data.fechaActualizacion).format('D/MM/YYYY, h:mm:ss a'),
          <Tooltip id='filterTooltip' title="Editar" placement='top' classes={{ tooltip: classes.tooltip }}>
            <div className={classes.buttonHeaderContainer}>
              <Button key={'filtersButton'} color={'primary'} size='sm' round variant="outlined" justIcon startIcon={<EditIcon />}
                onClick={() => {
                  setDataEditAsignatura(data);
                }} />
            </div>
          </Tooltip>
        ];
        return arrayData;
      });
      setTotalAsignaturas(response.totalAsignaturas);
      setAsignaturasList(asignaturas);
    } else {
      setTotalAsignaturas(0);
      setAsignaturasList([]);

    }
    setOpenModalLoading(false);
  }

  //Obtencion de los docentes para la modal, cuando se crea o se edita una asignatura
  const getDocentes = async (isEdit?: boolean, asignaturaToEdit?: any) => {
    let response: any = await getAllDocentes({
      search: '',
    });
    let docentesSelected = [];
    if (response && response.docentes) {
      setDocenteList(response.docentes);
      if (isEdit && asignaturaToEdit.docente && asignaturaToEdit.docente.length) {
        for (let i = 0; i < asignaturaToEdit.docente.length; i++) {
          let findDocente = response.docentes.find((docente: any) => docente._id === asignaturaToEdit.docente[i]._id)
          if (findDocente) {
            docentesSelected.push(findDocente);
          }
        }
      }
    }
    getContenidos(isEdit, { ...asignaturaToEdit, docente: docentesSelected });

  }

  //Obtencion de los docentes para la modal, cuando se crea o se edita una asignatura
  const getContenidos = async (isEdit?: boolean, asignaturaToEdit?: any) => {
    let response: any = await getAllContenidos({
      search: '',
    });
    let contenidosSelected = [];
    if (response && response.contenidos) {
      setContenidoList(response.contenidos);
      if (isEdit && asignaturaToEdit.contenido && asignaturaToEdit.contenido.length) {
        for (let i = 0; i < asignaturaToEdit.contenido.length; i++) {
          let findContenido = response.contenidos.find((contenido: any) => contenido._id === asignaturaToEdit.contenido[i]._id)
          if (findContenido) {
            contenidosSelected.push(findContenido);
          }
        }
      }
    }
    setAsignaturaObject({ ...asignaturaToEdit, contenido: contenidosSelected });
    setOpenModalLoading(false);
  }

  //Cuando se cambia de pagina se ejecuta el metodo getAsignaturas con la pagina solicitada
  const onChangePage = (page: number) => {
    setOpenModalLoading(true);
    getAsignaturas(page);

  };

  //Se establecen los datos de una asignatura a editar en la modal
  const setDataEditAsignatura = (data: any) => {
    try {
      handleOpenModal(true, data);
    } catch (error) {
      setOpenModalLoading(false);
    }
  };

  //Metodo que controla la apertura de la modal con el fin de obtener los docentes y los contenidos
  const handleOpenModal = (isEdit?: boolean, asignaturaToEdit?: any) => {
    try {
      setOpenModal(true);
      setOpenModalLoading(true);
      getDocentes(isEdit, asignaturaToEdit);
    } catch (error) {
      setOpenModalLoading(false);
    }
  }

  //Manejador de la accion guardar de la modal, se encarga de crear o editar
  const handleSaveAsignatura = () => {
    setOpenModalLoading(true);
    let isValid = validateFields();
    if (isValid) {
      if (asignaturaObject._id) {
        //EDITAR
        handleEditAsignatura();
      } else {
        //CREAR
        handleCreateAsignatura();
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

  //Metodo para crear una Asignatura
  const handleCreateAsignatura = async () => {
    let asignaturaToSave = {
      ...asignaturaObject,
      docente: asignaturaObject.docente.map((docente: any) => ({ _id: docente._id })),
      contenido: asignaturaObject.contenido.map((contenido: any) => ({ _id: contenido._id }))
    };
    let response: any = await createAsignatura(asignaturaToSave);
    if (response && response.error) {
      setSeverityAlert('error');
      setShowAlert(true);
      setMessagesAlert(response.descripcion || 'Ha ocurrido un error intentando crear, por favor intentelo de nuevo');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
      setOpenModalLoading(false);
    } else {
      setSeverityAlert('success');
      setShowAlert(true);
      setMessagesAlert('Asignatura creada satisfactoriamente');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
      setOpenModal(false);
      getAsignaturas();
    }
  }

  //Metodo para editar una Asignatura
  const handleEditAsignatura = async () => {
    let asignaturaToSave = {
      ...asignaturaObject,
      docente: asignaturaObject.docente.map((docente: any) => ({ _id: docente._id })),
      contenido: asignaturaObject.contenido.map((contenido: any) => ({ _id: contenido._id }))
    };
    let response: any = await updateAsignatura(asignaturaToSave, asignaturaObject._id);
    if (response && response.error) {
      setSeverityAlert('warning');
      setShowAlert(true);
      setMessagesAlert(response.descripcion || 'Ha ocurrido un error intentando actualizar, por favor intentelo de nuevo');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
      setOpenModalLoading(false);
    } else {
      setSeverityAlert('success');
      setShowAlert(true);
      setMessagesAlert('Asignatura editada satisfactoriamente');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
      setOpenModal(false);
      getAsignaturas();
    }
  }

  //Validacion de campos obligatorios para la creacion y edicion
  const validateFields = () => {
    if (asignaturaObject.codigo &&
      asignaturaObject.nombre &&
      asignaturaObject.semestre &&
      asignaturaObject.cantidadCredito &&
      asignaturaObject.intensidadHoraria
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
                <h4 className={classes.cardTitleWhite}>Asignaturas</h4>
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
                          setOpenModalLoading(true);
                          getAsignaturas();
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
                            setOpenModalLoading(true);
                            getAsignaturas();
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
                !asignaturaList.length ?
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
                      'Fecha de creación',
                      'Fecha ultima actualización',
                      'Acciones'
                    ]}
                    tableData={asignaturaList}
                  />
              }
            </CardBody>
          </Card>

          <Card className={classes.centerContent}>
            <TablePagination page={pagePagination} onChangePage={onChangePage} totalData={totalAsignaturas} />
          </Card>

        </GridItem>
      </GridContainer>
      <div className={classes.containerFloatButton}>
        <Tooltip id='addTooltip' title="Crear nueva asignatura" placement='left' classes={{ tooltip: classes.tooltip }}>
          <div>
            <Button key={'searchButton'} color={'primary'} round justIcon startIcon={<AddIcon />}
              onClick={() => {
                handleOpenModal(false,
                  {
                    _id: '',
                    nombre: '',
                    codigo: '',
                    semestre: '',
                    cantidadCredito: 1,
                    intensidadHoraria: 1,
                    contenido: [],
                    docente: []
                  }
                )
              }} />
          </div>
        </Tooltip>
      </div>

      {/* Modal de creación y edicion de contenidos */}

      <Modal
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
                  <h4 className={classes.cardTitleWhite}>{asignaturaObject._id ? 'Editar' : 'Crear'} asignaturas</h4>
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
                      error={!asignaturaObject.cantidadCredito ? true : false}
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
                    <TextField
                      id="outlined-email"
                      label="Horas semanales"
                      variant="outlined"
                      margin="dense"
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
                        inputProps: { min: 1, pattern: "[0-9]*", }
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
                  <GridItem xs={12} sm={12} md={12} >
                    <Autocomplete
                      multiple
                      id="tags-outlined"
                      options={contenidoList}
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
                </GridContainer>
              </div>
              <div className={classes.containerFooterModal} >
                <Button key={'filtersButton'} color={'primary'} round variant="outlined" endIcon={<SendIcon />}
                  onClick={() => { handleSaveAsignatura() }} >
                  {'Guardar'}
                </Button>

              </div>

            </Card>
          </GridItem>
        </div>
      </Modal >
      <ModalLoading showModal={openModalLoading} />
    </div >
  );
}

export default withStyles(styles)(Asignaturas);
