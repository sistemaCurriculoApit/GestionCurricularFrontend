import React, { useState, useEffect } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import Modal from '@material-ui/core/Modal';
import Tooltip from '@material-ui/core/Tooltip';
import Search from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import SendIcon from '@material-ui/icons/Send';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';

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
import { getEquivalenciasPaginated, createEquivalencia, updateEquivalencia } from '../../services/equivalenciasServices';

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

function Equivalencias(props: any) {

  const { classes } = props;

  const [showAlert, setShowAlert] = useState(false);
  const [severityAlert, setSeverityAlert] = useState('');
  const [messageAlert, setMessagesAlert] = useState('');
  const [searchField, setSearchField] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [openModalLoading, setOpenModalLoading] = useState(false);

  const [equivalenciaList, setEquivalenciasList] = useState([]);
  const [totalEquivalencias, setTotalEquivalencias] = useState(0);
  const [pagePagination, setPagePagination] = useState(1);
  const [equivalenciaObject, setEquivalenciaObject] = useState<AnythingObject>({
    _id: '',
    sourcePlan: '',
    sourcePlanName: '',
    sourceCourseCode: '',
    sourceCourseName: '',
  });

  const validateFields = () => (equivalenciaObject.sourceCourseCode &&
    equivalenciaObject.sourceCourseName &&
    equivalenciaObject.sourcePlan
  );

  const setDataEditEquivalencia = (data: any) => {
    setOpenModal(true);
    setEquivalenciaObject({
      _id: data._id,
      sourceCourseCode: data.sourceCourseCode,
      sourceCourseName: data.sourceCourseName,
      sourcePlanName: data.sourcePlanName,
      sourcePlan: data.sourcePlan
    });
  };

  const getEquivalencias = async (page?: any) => {
    let response: any = await getEquivalenciasPaginated({
      page: page ? page : 0,
      search: searchField,
    });
    setPagePagination(page ? page + 1 : 1);
    if (response.equivalencias && response.equivalencias.length) {
      // Se recorre respuesta con los datos obtenidos para generar un arreglo en el orden que se muestran los datos en la tabla
      let equivalencias = response.equivalencias.map((data: any) => {
        let arrayData = [
          data.sourceCourseCode,
          data.sourceCourseName,
          data.sourcePlan,
          data.sourcePlanName,
          <Tooltip id="filterTooltip" title="Editar" placement="top" classes={{ tooltip: classes.tooltip }}>
            <div className={classes.buttonHeaderContainer}>
              <Button key={'filtersButton'} color={'primary'} size="sm" round={true} variant="outlined" justIcon={true} startIcon={<EditIcon />}
                onClick={() => {
                  setDataEditEquivalencia(data);
                }} />
            </div>
          </Tooltip>
        ];
        return arrayData;
      });
      setTotalEquivalencias(response.totalEquivalencias);
      setEquivalenciasList(equivalencias);
    } else {
      setTotalEquivalencias(0);
      setEquivalenciasList([]);

    }
    setOpenModalLoading(false);
  };

  const onChangePage = (page: number) => {
    setOpenModalLoading(true);
    getEquivalencias(page);
  };

  const handleCreateEquivalencia = async () => {
    let equivalenciaToSave = {
      sourceCourseCode: equivalenciaObject.sourceCourseCode,
      sourceCourseName: equivalenciaObject.sourceCourseName,
      sourcePlan: equivalenciaObject.sourcePlan,
      sourcePlanName: equivalenciaObject.sourcePlanName
    };
    let response: any = await createEquivalencia(equivalenciaToSave);
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
      setMessagesAlert('Equivalencia creada satisfactoriamente');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
      setOpenModal(false);
      getEquivalencias();
    }
  };

  const handleEditEquivalencia = async () => {
    let equivalenciaToSave = {
      sourceCourseCode: equivalenciaObject.sourceCourseCode,
      sourceCourseName: equivalenciaObject.sourceCourseName,
      sourcePlan: equivalenciaObject.sourcePlan,
      sourcePlanName: equivalenciaObject.sourcePlanName
    };
    let response: any = await updateEquivalencia(equivalenciaToSave, equivalenciaObject._id);
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
      setMessagesAlert('Equivalencia editada satisfactoriamente');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
      setOpenModal(false);
      getEquivalencias();
    }
  };

  const handleSaveEquivalencia = () => {
    setOpenModalLoading(true);
    let isValid = validateFields();
    if (isValid) {
      if (equivalenciaObject._id) {
        // EDITAR
        handleEditEquivalencia();
      } else {
        // CREAR
        handleCreateEquivalencia();
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
    getEquivalencias();
  }, []);

  useEffect(() => {
    if (!searchField) {
      setOpenModalLoading(true);
      getEquivalencias();
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
                <h4 className={classes.cardTitleWhite}>Equivalencias</h4>
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
                          getEquivalencias();
                        }}
                      />
                    </div>
                  </Tooltip>
                </div>
              </div>
            </CardHeader>
            <CardBody>

              {
                !equivalenciaList.length ?
                  <h2 style={{ textAlign: 'center' }}>No se encontraron equivalencias.</h2>
                  :
                  <Table
                    tableHeaderColor="success"
                    tableHead={[
                      'Código de asignatura origen',
                      'Nombre de asignatura origen',
                      'Código del plan origen',
                      'Nombre del plan origen',
                      'Acciones'
                    ]}
                    tableData={equivalenciaList}
                  />
              }
            </CardBody>
          </Card>

          <Card className={classes.centerContent}>
            <TablePagination page={pagePagination} count={10} onChangePage={onChangePage} totalData={totalEquivalencias} />
          </Card>

        </GridItem>
      </GridContainer>
      <div className={classes.containerFloatButton}>
        <Tooltip id="addTooltip" title="Crear nueva equivalencia" placement="left" classes={{ tooltip: classes.tooltip }}>
          <div>
            <Button key={'searchButton'} color={'primary'} round={true} justIcon={true} startIcon={<AddIcon />}
              onClick={() => {
                setOpenModal(true);
                setEquivalenciaObject(
                  {
                    _id: '',
                    sourceCourseCode: '',
                    sourceCourseName: '',
                    sourcePlan: '',
                    sourcePlanName: '',
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
                  <h4 className={classes.cardTitleWhite}>{equivalenciaObject._id ? 'Editar' : 'Crear'} equivalencia</h4>
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
                      label="Código de asignatura"
                      variant="outlined"
                      margin="dense"
                      className={classes.CustomTextField}
                      error={!equivalenciaObject.sourceCourseCode ? true : false}
                      value={equivalenciaObject.sourceCourseCode}
                      onChange={(event) => {
                        setEquivalenciaObject({ ...equivalenciaObject, sourceCourseCode: event.target.value });
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} >
                    <TextField
                      id="outlined-email"
                      label="Nombre de asignatura"
                      variant="outlined"
                      margin="dense"
                      className={classes.CustomTextField}
                      error={!equivalenciaObject.sourceCourseName ? true : false}
                      value={equivalenciaObject.sourceCourseName}
                      onChange={(event) => {
                        setEquivalenciaObject({ ...equivalenciaObject, sourceCourseName: event.target.value });
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} >
                    <TextField
                      id="outlined-email"
                      label="Código del plan origen"
                      variant="outlined"
                      margin="dense"
                      className={classes.CustomTextField}
                      error={!equivalenciaObject.sourcePlan ? true : false}
                      value={equivalenciaObject.sourcePlan}
                      onChange={(event) => {
                        setEquivalenciaObject({ ...equivalenciaObject, sourcePlan: event.target.value });
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6} >
                    <TextField
                      id="outlined-email"
                      label="Nombre del plan origen"
                      variant="outlined"
                      margin="dense"
                      className={classes.CustomTextField}
                      value={equivalenciaObject.sourcePlanName}
                      onChange={(event) => {
                        setEquivalenciaObject({ ...equivalenciaObject, sourcePlanName: event.target.value });
                      }}
                    />
                  </GridItem>
                </GridContainer>
              </div>
              <div className={classes.containerFooterModal} >
                <Button key={'filtersButton'} color={'primary'} round={true} variant="outlined" endIcon={<SendIcon />}
                  onClick={() => { handleSaveEquivalencia(); }} >
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

export default withStyles(styles)(Equivalencias);