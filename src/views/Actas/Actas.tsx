import React, { useState, useEffect } from 'react';
import MomentUtils from "@date-io/moment";
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import Modal from '@material-ui/core/Modal';
import Chip from "@material-ui/core/Chip";
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
import { container, containerFormModal, containerFooterModal, chipMargin, modalForm } from '../../assets/jss/material-dashboard-react'

import { AnythingObject } from '../../constants/generalConstants'
import { getActasPaginated, createActa, updateActa } from "../../services/actasServices"


const styles = createStyles({
  CustomSearchTextFieldStyle: CustomSearchTextField.input,
  CustomTextField: CustomTextField.input,
  container,
  containerFormModal,
  containerFooterModal,
  chipMargin,
  modalForm,
  ...cardTabletCustomStyle,
  ...tooltipStyle,
  ...containerFloatButton,
});

function Actas(props: any) {
  const { classes } = props;
  const openModalCreate = props.history.location.state ? props.history.location.state.openModalCreate : false;

  const [showAlert, setShowAlert] = useState(false);
  const [severityAlert, setSeverityAlert] = useState('');
  const [messageAlert, setMessagesAlert] = useState('');
  const [searchField, setSearchField] = useState('');
  const [openMoreFilters, setOpenMoreFilters] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModalLoading, setOpenModalLoading] = useState(false);
  const [dateActaFrom, setDateActaFrom] = useState<any>(null);
  const [dateActaTo, setDateActaTo] = useState<any>(null);
  const [dateCreationFrom, setDateCreationFrom] = useState<any>(null);
  const [dateCreationTo, setDateCreationTo] = useState<any>(null);
  const [listAssistants, setListAssistants] = useState([]);
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [actasList, setActasList] = useState([]);
  const [totalActas, setTotalActas] = useState(0);
  const [pagePagination, setPagePagination] = useState(1);
  const [actaObject, setActaObject] = useState<AnythingObject>({
    _id: '',
    actividad: '',
    lugar: '',
    tema: '',
    conclusion: '',
    fechaActa: new Date()
  });

  useEffect(() => {
    setOpenModalLoading(true);
    getActas();
    if (openModalCreate) {
      setOpenModal(true);
    }
  }, [])

  useEffect(() => {
    if (!searchField) {
      setOpenModalLoading(true);
      getActas();
    }
  }, [searchField])

  const getActas = async (page?: any) => {
    let response: any = await getActasPaginated({
      page: page ? page : 0,
      search: searchField,
      dateActaFrom: dateActaFrom ? dateActaFrom.toDate() : '',
      dateActaTo: dateActaTo ? dateActaTo.toDate() : '',
      dateCreationFrom: dateCreationFrom ? dateCreationFrom.toDate() : '',
      dateCreationTo: dateCreationTo ? dateCreationTo.toDate() : '',
    });
    setPagePagination(page ? page + 1 : 1);
    if (response.actas && response.actas.length) {
      let actas = response.actas.map((data: any) => {
        let arrayData = [
          data.actividad,
          moment(data.fechaActa).format('D/MM/YYYY'),
          data.lugar,
          data.asistente.replaceAll('||', '\n'),
          data.tema,
          <Tooltip id='filterTooltip' title="Ver detalles de acta" placement='top' classes={{ tooltip: classes.tooltip }}>
          <div className={classes.buttonHeaderContainer}>
            <Button key={'filtersButton'} color={'primary'} size='sm' round variant="outlined" justIcon startIcon={<VisibilityIcon />}
              onClick={() => {
                setIsEdit(false)
                setDataEditOrViewActa(data);
              }} />
          </div>
        </Tooltip>,
          <Tooltip id='filterTooltip' title="Editar" placement='top' classes={{ tooltip: classes.tooltip }}>
            <div className={classes.buttonHeaderContainer}>
              <Button key={'filtersButton'} color={'primary'} size='sm' round variant="outlined" justIcon startIcon={<EditIcon />}
                onClick={() => {
                  setIsEdit(true)
                  setDataEditOrViewActa(data);
                }} />
            </div>
          </Tooltip>
        ];
        return arrayData;
      });
      setTotalActas(response.totalActas);
      setActasList(actas);
    } else {
      setTotalActas(0);
      setActasList([]);

    }
    setOpenModalLoading(false);
  }

  const onChangePage = (page: number) => {
    setOpenModalLoading(true);
    getActas(page);

  };

  const setDataEditOrViewActa = (data: any) => {
    setOpenModal(true);
    setActaObject({
      _id: data._id,
      actividad: data.actividad,
      lugar: data.lugar,
      tema: data.tema,
      conclusion: data.conclusion,
      fechaActa: moment(data.fechaActa),
    });
    setListAssistants(data.asistente.split('||'));
  };

  const handleSaveActa = () => {
    setOpenModalLoading(true);
    let isValid = validateFields();
    if (isValid) {

      if (actaObject._id) {
        //EDITAR USUARIO
        handleEditActa();
      } else {
        //CREAR USUARIO
        handleCreateActa();
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

  const handleCreateActa = async () => {
    let actaToSave = {
      actividad: actaObject.actividad,
      lugar: actaObject.lugar,
      asistente: listAssistants.length ? listAssistants.join('||') : '',
      tema: actaObject.tema,
      conclusion: actaObject.conclusion,
      fechaActa: actaObject.fechaActa.toDate()
    };
    let response: any = await createActa(actaToSave);
    if (response && response.error) {
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
      setMessagesAlert('Acta creada satisfactoriamente');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
      setOpenModal(false);
      getActas();
    }
  }

  const handleEditActa = async () => {
    let actaToSave = {
      actividad: actaObject.actividad,
      lugar: actaObject.lugar,
      asistente: listAssistants.length ? listAssistants.join('||') : '',
      tema: actaObject.tema,
      conclusion: actaObject.conclusion,
      fechaActa: actaObject.fechaActa.toDate()
    };
    let response: any = await updateActa(actaToSave, actaObject._id);
    if (response && response.error) {
      setSeverityAlert('error');
      setShowAlert(true);
      setMessagesAlert('Ha ocurrido un error intentando actualizar, por favor intentelo de nuevo');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
      setOpenModalLoading(false);
    } else {
      setSeverityAlert('success');
      setShowAlert(true);
      setMessagesAlert('Acta editada satisfactoriamente');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
      setOpenModal(false);
      getActas();
    }
  }

  const validateFields = () => {
    if (actaObject.actividad &&
      actaObject.lugar &&
      listAssistants.length &&
      actaObject.tema &&
      actaObject.conclusion) {
      return true;
    } else {
      return false;
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
                <h4 className={classes.cardTitleWhite}>Actas</h4>
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
                          getActas();
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
                              <h4 className={classes.cardTitleBlack}>Fecha del acta</h4>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={6}>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <DatePicker
                                  label="Fecha desde"
                                  inputVariant='outlined'
                                  margin='dense'
                                  className={classes.CustomTextField}
                                  format="DD/MM/YYYY"
                                  value={dateActaFrom}
                                  onChange={(newValue: any) => {
                                    setDateActaFrom(newValue);
                                  }}
                                  clearable
                                  clearLabel='Limpiar'
                                />
                                {
                                  dateActaFrom ? (
                                    <CloseIcon onClick={(e) => setDateActaFrom(null)} />
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
                                  value={dateActaTo}
                                  onChange={(newValue: any) => {
                                    setDateActaTo(newValue);
                                  }}
                                  clearable
                                  clearLabel='Limpiar'
                                />
                                {
                                  dateActaTo ? (
                                    <CloseIcon onClick={(e) => setDateActaTo(null)} />
                                  ) : null
                                }
                              </div>
                            </GridItem>

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
                            getActas();
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
                !actasList.length ?
                  <h2 style={{ textAlign: 'center' }}>No se encontraron actas en la base de datos</h2>
                  :
                  <Table
                    tableHeaderColor="success"
                    tableHead={[
                      'Actividad',
                      'Fecha',
                      'Lugar',
                      'Asistentes',
                      'Temas',
                      'Ver detalles',
                      'Acciones'
                    ]}
                    tableData={actasList}
                  />
              }
            </CardBody>
          </Card>

          <Card className={classes.centerContent}>
            <TablePagination page={pagePagination} count={10} onChangePage={onChangePage} totalData={totalActas} />
          </Card>

        </GridItem>
      </GridContainer>
      <div className={classes.containerFloatButton}>
        <Tooltip id='addTooltip' title="Crear nueva acta" placement='left' classes={{ tooltip: classes.tooltip }}>
          <div>
            <Button key={'searchButton'} color={'primary'} round justIcon startIcon={<AddIcon />}
              onClick={() => {
                setOpenModal(true);
                setActaObject(
                  {
                    _id: '',
                    actividad: '',
                    lugar: '',
                    tema: '',
                    conclusion: '',
                    fechaActa: new Date()
                  }
                );
              }} />
          </div>
        </Tooltip>
      </div>
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
                    <h4 className={classes.cardTitleWhite}>{actaObject._id ? 'Editar': 'Crear'}  acta</h4>
                    :
                    <h4 className={classes.cardTitleWhite}>Detalles de acta</h4>
                  }
                  
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
                  <GridItem xs={12} sm={12} md={12} >
                    <TextField
                      id="outlined-email"
                      label="Actividad"
                      variant="outlined"
                      margin="dense"
                      className={classes.CustomTextField}
                      error={!actaObject.actividad ? true : false}
                      value={actaObject.actividad}
                      disabled={!isEdit}
                      onChange={(event) => {
                        setActaObject({ ...actaObject, actividad: event.target.value })
                      }}
                    />
                  </GridItem>

                  <GridItem xs={12} sm={12} md={6} >
                    <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={"sw"} >
                      <DatePicker
                        label="Fecha"
                        inputVariant='outlined'
                        margin='dense'
                        className={classes.CustomTextField}
                        format="DD/MM/YYYY"
                        error={!actaObject.fechaActa ? true : false}
                        value={actaObject.fechaActa}
                        disabled={!isEdit}
                        onChange={(event) => {
                          setActaObject({ ...actaObject, fechaActa: event });
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  </GridItem>

                  <GridItem xs={12} sm={12} md={6} >
                    <TextField
                      id="outlined-email"
                      label="Lugar"
                      variant="outlined"
                      margin="dense"
                      className={classes.CustomTextField}
                      error={!actaObject.lugar ? true : false}
                      value={actaObject.lugar}
                      disabled={!isEdit}
                      onChange={(event) => {
                        setActaObject({ ...actaObject, lugar: event.target.value })
                      }}
                    />
                  </GridItem>

                  <GridItem xs={12} sm={12} md={12} >
                    <Autocomplete
                      multiple
                      freeSolo
                      id="tags-outlined"
                      options={[]}
                      renderTags={() => (null)}
                      value={listAssistants}
                      disabled={!isEdit}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          id="outlined-email"
                          label="Asistentes"
                          variant="outlined"
                          margin="dense"
                          className={classes.CustomTextField}
                          error={!listAssistants.length ? true : false}
                          helperText="Presione 'enter' para añadir al asistente"
                          onKeyDown={(e: any) => {
                            if (e.keyCode === 13 && e.target.value.trim().length !== 0) {
                              setListAssistants(listAssistants.concat(e.target.value));
                            }
                          }}
                        />
                      )}
                    />
                    {
                      listAssistants.map((option, index) => {
                        // This is to handle new options added by the user (allowed by freeSolo prop).
                        return (
                          <Chip
                            key={index}
                            label={option}
                            variant="outlined"
                            disabled={!isEdit}
                            className={classes.chipMargin}
                            onDelete={
                              () => {
                                setListAssistants(listAssistants.filter((entry) => entry !== option));
                              }
                            }
                          />
                        );
                      })
                    }
                  </GridItem>

                  <GridItem xs={12} sm={12} md={12} >

                    <TextField
                      id="outlined-email"
                      label="Temas"
                      variant="outlined"
                      margin="dense"
                      multiline
                      minRows={4}
                      maxRows={10}
                      disabled={!isEdit}
                      className={classes.CustomTextField}
                      error={!actaObject.tema ? true : false}
                      value={actaObject.tema}
                      onChange={(event) => {
                        setActaObject({ ...actaObject, tema: event.target.value })
                      }}
                      helperText="Cada tema en una línea separada"
                    />
                  </GridItem>

                  <GridItem xs={12} sm={12} md={12} >
                    <TextField
                      id="outlined-email"
                      label="conclusiones"
                      variant="outlined"
                      margin="dense"
                      multiline
                      minRows={4}
                      maxRows={10}
                      disabled={!isEdit}
                      className={classes.CustomTextField}
                      error={!actaObject.conclusion ? true : false}
                      value={actaObject.conclusion}
                      onChange={(event) => {
                        setActaObject({ ...actaObject, conclusion: event.target.value })
                      }}
                      helperText="Cada tema en una línea separada"
                    />
                  </GridItem>

                </GridContainer>
              </div>
              {
                isEdit ? 
                <div className={classes.containerFooterModal} >
                  <Button key={'filtersButton'} color={'primary'} round variant="outlined" endIcon={<SendIcon />}
                    onClick={() => { handleSaveActa() }} >
                    {'Guardar'}
                  </Button>
                </div> : null
              }
            </Card>
          </GridItem>
        </div>
      </Modal>
      <ModalLoading showModal={openModalLoading} />
    </div>
  );
}

export default withStyles(styles)(Actas);
