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
import TabContext from '@material-ui/lab/TabContext';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TabPanel from '@material-ui/lab/TabPanel';
import Box from '@material-ui/core/Box';
import CloseIcon from '@material-ui/icons/Close';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import SendIcon from '@material-ui/icons/Send';
import moment from 'moment';
import 'moment/locale/es';

import XlsxPopulate from 'xlsx-populate';
import { saveAs } from 'file-saver';

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
import { getAllAsignaturas } from '../../services/asignaturasServices';
import { getAllDocentes } from '../../services/docentesServices';
import { getAllAvancesByAsignatura, getAllAvancesByDocente, getAllAvancesByPerido } from '../../services/avancesServices';
import { getAllHomologacionesByIdSolicitante, getAllHomologacionesByPeriodo } from '../../services/homologacionesServices';

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
function Reportes(props: any) {
  const { classes } = props;
  const [showAlert, setShowAlert] = useState(false);
  const [severityAlert, setSeverityAlert] = useState('');
  const [messageAlert, setMessagesAlert] = useState('');
  const [openModalLoading, setOpenModalLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [asignaturasList, setAsignaturasList] = useState([]);
  const [docentesList, setDocentesList] = useState([]);

  const [avanceByAsignaturaList, setAvanceByAsignaturaList] = useState([]);
  const [avanceByDocenteList, setAvanceByDocenteList] = useState([]);
  const [avanceByPeriodoList, setAvanceByPeriodoList] = useState([]);
  const [homologacionesByIdSolicitanteList, setHomologacionesByIdSolicitanteList] = useState([]);
  const [homologacionesByPeriodoList, setHomologacionesByPeriodoList] = useState([]);

  const [paginationReport, setPaginationReport] = useState<AnythingObject[]>([]);
  const [pageReportSelected, setPageReportSelected] = useState<AnythingObject>({});

  const [totalDataList, setTotalDataList] = useState(0);
  const [pagePagination, setPagePagination] = useState(1);

  const [tabSelection, setTabSelection] = useState('1');
  const [filterObject1, setFilterObject1] = useState<AnythingObject>({
    añoAvance: moment(new Date(new Date().getFullYear(), 0, 1)),
    periodo: '1',
    asignatura: null
  });

  const [filterObject2, setFilterObject2] = useState<AnythingObject>({
    añoAvance: moment(new Date(new Date().getFullYear(), 0, 1)),
    periodo: '1',
    docente: null
  });

  const [filterObject3, setFilterObject3] = useState<AnythingObject>({
    añoAvance: moment(new Date(new Date().getFullYear(), 0, 1)),
    periodo: '1'
  });

  const [filterObject5, setFilterObject5] = useState<AnythingObject>({
    añoHomologacion: moment(new Date(new Date().getFullYear(), 0, 1)),
    periodo: '1'
  });

  const [filterIdSolicitante, setFilterIdSolicitante] = useState('');

  const getAsignaturas = async () => {
    let response: any = await getAllAsignaturas({
      search: '',
    });
    if (response && response.asignaturas) {
      setAsignaturasList(response.asignaturas);
    }
    setOpenModalLoading(false);
  };

  const getDocentes = async () => {
    let response: any = await getAllDocentes({
      search: '',
    });
    if (response && response.docentes) {
      setDocentesList(response.docentes);
    }
    setOpenModalLoading(false);
  };

  useEffect(() => {
    setTotalDataList(0);
    switch (tabSelection) {
      case '1':
        setOpenModalLoading(true);
        getAsignaturas();
        setAvanceByAsignaturaList([]);
        break;
      case '2':
        setOpenModalLoading(true);
        getDocentes();
        setAvanceByDocenteList([]);
        break;
      case '3':
        setAvanceByPeriodoList([]);

        break;
      case '4':
        setHomologacionesByIdSolicitanteList([]);

        break;
      case '5':
        setHomologacionesByPeriodoList([]);

        break;

      default:
        break;
    }
  }, [tabSelection]);

  const getSheetData = (data: any, header: any) => {
    const fields = Object.keys(data[0]);
    const sheetData = data.map(function (row: any) {
      return fields.map(function (fieldName: string) {
        return row[fieldName] ? row[fieldName] : '';
      });
    });
    sheetData.unshift(header);
    return sheetData;
  };

  const getAvancesByAsignatura = async (page?: any, isReport?: boolean) => {
    if (filterObject1.añoAvance && filterObject1.periodo && filterObject1.asignatura && filterObject1.asignatura._id) {
      // Llamado al backend y construcción de los parametros de consulta
      let response: any = await getAllAvancesByAsignatura({
        page: page ? page : 0,
        añoAvance: filterObject1.añoAvance.toDate(),
        periodo: filterObject1.periodo,
        asignaturaId: filterObject1.asignatura._id
      });
      setPagePagination(page ? page + 1 : 1);
      if (response && response.avances && response.avances.length) {
        if (isReport) {
          // Se recorre respuesta con los datos obtenidos para generar un arreglo en el orden que se muestran los datos en la tabla
          const data = response.avances.map((res: any) => {
            return {
              asignatura: `${filterObject1.asignatura.codigo} - ${filterObject1.asignatura.nombre}`,
              añoAvance: moment(res.añoAvance).format('YYYY'),
              periodo: res.periodo,
              porcentajeAvance: res.porcentajeAvance,
              descripcion: res.descripcion,
              fechaCreacion: moment(res.fechaCreacion).format('D/MM/YYYY, h:mm:ss a'),
              fechaActualizacion: moment(res.fechaActualizacion).format('D/MM/YYYY, h:mm:ss a')
            };
          });
          let header = [
            'Asignatura',
            'Año del avance',
            'Periodo',
            'Porcentaje de avance',
            'Descripción',
            'Fecha de creación',
            'Fecha ultima actualización'
          ];

          XlsxPopulate.fromBlankAsync().then(async (workbook: any) => {
            const sheet1 = workbook.sheet(0);
            const sheetData = getSheetData(data, header);
            const totalColumns = sheetData[0].length;

            sheet1.column('A').width(20);
            sheet1.column('B').width(20);
            sheet1.column('C').width(20);
            sheet1.column('D').width(20);
            sheet1.column('E').width(20);
            sheet1.column('F').width(25);
            sheet1.column('G').width(25);
            sheet1.cell('A1').value(sheetData);
            const range = sheet1.usedRange();
            const endColumn = String.fromCharCode(64 + totalColumns);
            sheet1.row(1).style('bold', true);
            sheet1.range('A1:' + endColumn + '1').style('fill', 'BFBFBF');
            range.style('border');
            return workbook.outputAsync().then((res: any) => {
              saveAs(res, 'Avances_por_asignatura.xlsx');
            });
          });
          setOpenModal(false);
        } else {
          let avances = response.avances.map((data: any) => {
            let arrayData = [
              moment(data.añoAvance).format('YYYY'),
              data.periodo,
              data.porcentajeAvance,
              data.descripcion,
              moment(data.fechaCreacion).format('D/MM/YYYY, h:mm:ss a'),
              moment(data.fechaActualizacion).format('D/MM/YYYY, h:mm:ss a')
            ];
            return arrayData;
          });
          setAvanceByAsignaturaList(avances);
          setTotalDataList(response.totalAvances);
        }
      } else {
        setAvanceByAsignaturaList([]);
        setTotalDataList(0);
        setSeverityAlert('info');
        setShowAlert(true);
        setMessagesAlert('No se encontraron registros en la base de datos, por favor prueba con otros filtros');
        setTimeout(() => {
          setShowAlert(false);
        }, 1000);
      }
    } else {
      setSeverityAlert('warning');
      setShowAlert(true);
      setMessagesAlert('Debe diligenciar todos los filtros');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
    }
    setOpenModalLoading(false);
  };

  // Metodo de obtencion de los avances por docente
  const getAvancesByDocente = async (page?: any, isReport?: boolean) => {
    if (filterObject2.añoAvance && filterObject2.periodo && filterObject2.docente && filterObject2.docente._id) {
      // Llamado al backend y construcción de los parametros de consulta
      let response: any = await getAllAvancesByDocente({
        page: page ? page : 0,
        añoAvance: filterObject2.añoAvance.toDate(),
        periodo: filterObject2.periodo,
        docenteId: filterObject2.docente._id
      });
      setPagePagination(page ? page + 1 : 1);
      if (response && response.avances && response.avances.length) {
        if (isReport) {
          // Se recorre respuesta con los datos obtenidos para generar un arreglo en el orden que se muestran los datos en la tabla
          const data = response.avances.map((res: any) => {
            return {
              docente: `${filterObject2.docente.nombre} - ${filterObject2.docente.documento}`,
              añoAvance: moment(res.añoAvance).format('YYYY'),
              periodo: res.periodo,
              porcentajeAvance: res.porcentajeAvance,
              descripcion: res.descripcion,
              fechaCreacion: moment(res.fechaCreacion).format('D/MM/YYYY, h:mm:ss a'),
              fechaActualizacion: moment(res.fechaActualizacion).format('D/MM/YYYY, h:mm:ss a')
            };
          });
          let header = [
            'Docente',
            'Año del avance',
            'Periodo',
            'Porcentaje de avance',
            'Descripción',
            'Fecha de creación',
            'Fecha ultima actualización'
          ];

          XlsxPopulate.fromBlankAsync().then(async (workbook: any) => {
            const sheet1 = workbook.sheet(0);
            const sheetData = getSheetData(data, header);
            const totalColumns = sheetData[0].length;

            sheet1.column('A').width(20);
            sheet1.column('B').width(20);
            sheet1.column('C').width(20);
            sheet1.column('D').width(20);
            sheet1.column('E').width(20);
            sheet1.column('F').width(25);
            sheet1.column('G').width(25);
            sheet1.cell('A1').value(sheetData);
            const range = sheet1.usedRange();
            const endColumn = String.fromCharCode(64 + totalColumns);
            sheet1.row(1).style('bold', true);
            sheet1.range('A1:' + endColumn + '1').style('fill', 'BFBFBF');
            range.style('border');
            return workbook.outputAsync().then((res: any) => {
              saveAs(res, 'Avances_por_docente.xlsx');
            });
          });
          setOpenModal(false);
        } else {
          let avances = response.avances.map((data: any) => {
            let arrayData = [
              moment(data.añoAvance).format('YYYY'),
              data.periodo,
              data.porcentajeAvance,
              data.descripcion,
              moment(data.fechaCreacion).format('D/MM/YYYY, h:mm:ss a'),
              moment(data.fechaActualizacion).format('D/MM/YYYY, h:mm:ss a')
            ];
            return arrayData;
          });
          setAvanceByDocenteList(avances);
          setTotalDataList(response.totalAvances);
        }
      } else {
        setAvanceByDocenteList([]);
        setTotalDataList(0);
        setSeverityAlert('info');
        setShowAlert(true);
        setMessagesAlert('No se encontraron registros en la base de datos, por favor prueba con otros filtros');
        setTimeout(() => {
          setShowAlert(false);
        }, 1000);
      }
    } else {
      setSeverityAlert('warning');
      setShowAlert(true);
      setMessagesAlert('Debe diligenciar todos los filtros');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
    }
    setOpenModalLoading(false);

  };

  // Metodo de obtencion de los avances por periodo
  const getAvancesByPeriodo = async (page?: any, isReport?: boolean) => {
    if (filterObject3.añoAvance && filterObject3.periodo) {
      // Llamado al backend y construcción de los parametros de consulta
      let response: any = await getAllAvancesByPerido({
        page: page ? page : 0,
        añoAvance: filterObject3.añoAvance.toDate(),
        periodo: filterObject3.periodo
      });
      setPagePagination(page ? page + 1 : 1);
      if (response && response.avances && response.avances.length) {
        if (isReport) {
          // Se recorre respuesta con los datos obtenidos para generar un arreglo en el orden que se muestran los datos en la tabla
          const data = response.avances.map((res: any) => {
            return {
              añoAvance: moment(res.añoAvance).format('YYYY'),
              periodo: res.periodo,
              porcentajeAvance: res.porcentajeAvance,
              descripcion: res.descripcion,
              fechaCreacion: moment(res.fechaCreacion).format('D/MM/YYYY, h:mm:ss a'),
              fechaActualizacion: moment(res.fechaActualizacion).format('D/MM/YYYY, h:mm:ss a')
            };
          });
          let header = [
            'Año del avance',
            'Periodo',
            'Porcentaje de avance',
            'Descripción',
            'Fecha de creación',
            'Fecha ultima actualización'
          ];

          XlsxPopulate.fromBlankAsync().then(async (workbook: any) => {
            const sheet1 = workbook.sheet(0);
            const sheetData = getSheetData(data, header);
            const totalColumns = sheetData[0].length;

            sheet1.column('B').width(20);
            sheet1.column('A').width(15);
            sheet1.column('C').width(20);
            sheet1.column('D').width(20);
            sheet1.column('E').width(20);
            sheet1.column('F').width(25);
            sheet1.cell('A1').value(sheetData);
            const range = sheet1.usedRange();
            const endColumn = String.fromCharCode(64 + totalColumns);
            sheet1.row(1).style('bold', true);
            sheet1.range('A1:' + endColumn + '1').style('fill', 'BFBFBF');
            range.style('border');
            return workbook.outputAsync().then((res: any) => {
              saveAs(res, 'Avances_por_periodo.xlsx');
            });
          });
          setOpenModal(false);
        } else {
          let avances = response.avances.map((data: any) => {
            let arrayData = [
              moment(data.añoAvance).format('YYYY'),
              data.periodo,
              data.porcentajeAvance,
              data.descripcion,
              moment(data.fechaCreacion).format('D/MM/YYYY, h:mm:ss a'),
              moment(data.fechaActualizacion).format('D/MM/YYYY, h:mm:ss a')
            ];
            return arrayData;
          });
          setAvanceByPeriodoList(avances);
          setTotalDataList(response.totalAvances);
        }
      } else {
        setAvanceByPeriodoList([]);
        setTotalDataList(0);
        setSeverityAlert('info');
        setShowAlert(true);
        setMessagesAlert('No se encontraron registros en la base de datos, por favor prueba con otros filtros');
        setTimeout(() => {
          setShowAlert(false);
        }, 1000);
      }
    } else {
      setSeverityAlert('warning');
      setShowAlert(true);
      setMessagesAlert('Debe diligenciar todos los filtros');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
    }
    setOpenModalLoading(false);

  };

  // Metodo de obtencion de las homologacoiones por el id del solicitante
  const getHomologacionesByIdSolicitante = async (page?: any, isReport?: boolean) => {
    if (filterIdSolicitante) {
      // Llamado al backend y construcción de los parametros de consulta
      let response: any = await getAllHomologacionesByIdSolicitante({
        page: page ? page : 0,
        identificacionSolicitante: filterIdSolicitante,
      });
      setPagePagination(page ? page + 1 : 1);
      if (response && response.homologaciones && response.homologaciones.length) {
        if (isReport) {
          // Se recorre respuesta con los datos obtenidos para generar un arreglo en el orden que se muestran los datos en la tabla
          const data = response.homologaciones.map((res: any) => {
            return {
              año: moment(res.añoHomologacion).format('YYYY'),
              periodo: res.periodo,
              identificacionSolicitante: res.identificacionSolicitante,
              nombreSolicitante: res.nombreSolicitante,
              asignaturaSolicitante: res.asignaturaSolicitante,
              descripcion: res.descripcion,
              fechaCreacion: moment(res.fechaCreacion).format('D/MM/YYYY, h:mm:ss a'),
              fechaActualizacion: moment(res.fechaActualizacion).format('D/MM/YYYY, h:mm:ss a'),
            };
          });
          let header = [
            'Año',
            'Periodo',
            'Identificacion del solicitante',
            'Nombre del solicitante',
            'Asignatura del solicitante',
            'Descripcion',
            'Fecha de creación',
            'Fecha ultima actualización',
          ];

          XlsxPopulate.fromBlankAsync().then(async (workbook: any) => {
            const sheet1 = workbook.sheet(0);
            const sheetData = getSheetData(data, header);
            const totalColumns = sheetData[0].length;

            sheet1.column('A').width(15);
            sheet1.column('B').width(30);
            sheet1.column('C').width(30);
            sheet1.column('D').width(25);
            sheet1.column('E').width(20);
            sheet1.column('F').width(20);
            sheet1.column('G').width(25);
            sheet1.column('H').width(25);
            sheet1.cell('A1').value(sheetData);
            const range = sheet1.usedRange();
            const endColumn = String.fromCharCode(64 + totalColumns);
            sheet1.row(1).style('bold', true);
            sheet1.range('A1:' + endColumn + '1').style('fill', 'BFBFBF');
            range.style('border');
            return workbook.outputAsync().then((res: any) => {
              saveAs(res, 'Homologaciones_por_solicitante.xlsx');
            });
          });
          setOpenModal(false);
        } else {
          let homologaciones = response.homologaciones.map((data: any) => {
            let arrayData = [
              data.identificacionSolicitante,
              data.nombreSolicitante,
              data.asignaturaSolicitante,
              data.descripcion,
              moment(data.fechaCreacion).format('D/MM/YYYY, h:mm:ss a'),
              moment(data.fechaActualizacion).format('D/MM/YYYY, h:mm:ss a'),
            ];
            return arrayData;
          });
          setHomologacionesByIdSolicitanteList(homologaciones);
          setTotalDataList(response.totalHomologaciones);
        }
      } else {
        setHomologacionesByIdSolicitanteList([]);
        setTotalDataList(0);
        setSeverityAlert('info');
        setShowAlert(true);
        setMessagesAlert('No se encontraron registros en la base de datos, por favor prueba con otros filtros');
        setTimeout(() => {
          setShowAlert(false);
        }, 1000);
      }
    } else {
      setSeverityAlert('warning');
      setShowAlert(true);
      setMessagesAlert('Debe diligenciar todos los filtros');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
    }
    setOpenModalLoading(false);

  };

  // Metodo de obtencion de las homologacoiones por periodo
  const getHomologacionesByPeriodo = async (page?: any, isReport?: boolean) => {
    if (filterObject5.añoHomologacion && filterObject5.periodo) {
      // Llamado al backend y construcción de los parametros de consulta
      let response: any = await getAllHomologacionesByPeriodo({
        page: page ? page : 0,
        añoHomologacion: filterObject5.añoHomologacion.toDate(),
        periodo: filterObject5.periodo
      });
      setPagePagination(page ? page + 1 : 1);
      if (response && response.homologaciones && response.homologaciones.length) {
        if (isReport) {
          // Se recorre respuesta con los datos obtenidos para generar un arreglo en el orden que se muestran los datos en la tabla
          const data = response.homologaciones.map((res: any) => {
            return {
              año: moment(res.añoHomologacion).format('YYYY'),
              periodo: res.periodo,
              identificacionSolicitante: res.identificacionSolicitante,
              nombreSolicitante: res.nombreSolicitante,
              asignaturaSolicitante: res.asignaturaSolicitante,
              descripcion: res.descripcion,
              fechaCreacion: moment(res.fechaCreacion).format('D/MM/YYYY, h:mm:ss a'),
              fechaActualizacion: moment(res.fechaActualizacion).format('D/MM/YYYY, h:mm:ss a'),
            };
          });
          let header = [
            'Año',
            'Periodo',
            'Identificacion del solicitante',
            'Nombre del solicitante',
            'Asignatura del solicitante',
            'Descripcion',
            'Fecha de creación',
            'Fecha ultima actualización',
          ];

          XlsxPopulate.fromBlankAsync().then(async (workbook: any) => {
            const sheet1 = workbook.sheet(0);
            const sheetData = getSheetData(data, header);
            const totalColumns = sheetData[0].length;

            sheet1.column('A').width(15);
            sheet1.column('B').width(30);
            sheet1.column('C').width(30);
            sheet1.column('D').width(25);
            sheet1.column('E').width(20);
            sheet1.column('F').width(20);
            sheet1.column('G').width(25);
            sheet1.column('H').width(25);
            sheet1.cell('A1').value(sheetData);
            const range = sheet1.usedRange();
            const endColumn = String.fromCharCode(64 + totalColumns);
            sheet1.row(1).style('bold', true);
            sheet1.range('A1:' + endColumn + '1').style('fill', 'BFBFBF');
            range.style('border');
            return workbook.outputAsync().then((res: any) => {
              saveAs(res, 'Homologaciones_por_periodo.xlsx');
            });
          });
          setOpenModal(false);
        } else {
          let homologaciones = response.homologaciones.map((data: any) => {
            let arrayData = [
              data.identificacionSolicitante,
              data.nombreSolicitante,
              data.asignaturaSolicitante,
              data.descripcion,
              moment(data.fechaCreacion).format('D/MM/YYYY, h:mm:ss a'),
              moment(data.fechaActualizacion).format('D/MM/YYYY, h:mm:ss a'),
            ];
            return arrayData;
          });
          setHomologacionesByPeriodoList(homologaciones);
          setTotalDataList(response.totalHomologaciones);
        }
      } else {
        setHomologacionesByPeriodoList([]);
        setTotalDataList(0);
        setSeverityAlert('info');
        setShowAlert(true);
        setMessagesAlert('No se encontraron registros en la base de datos, por favor prueba con otros filtros');
        setTimeout(() => {
          setShowAlert(false);
        }, 1000);
      }
    } else {
      setSeverityAlert('warning');
      setShowAlert(true);
      setMessagesAlert('Debe diligenciar todos los filtros');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
    }
    setOpenModalLoading(false);

  };

  // Manejador de la apertura de la modal para establecer la paginacion al generar el reporte 
  const handleReportOpenModal = async () => {
    setPageReportSelected({});
    let pagesReport = Math.ceil(totalDataList / 100);
    let selectRange = [];
    for (let i = 1; i === pagesReport; i++) {
      selectRange.push({ index: i - 1, label: `${i} - ${i * 100}` });
    }
    setPaginationReport(selectRange);
    setOpenModal(true);
  };

  // Segun la pestaña activa se ejecuta el metodo de obtencion de datos para la tabla que se listara
  const handleReportCallFunction = async () => {
    setOpenModalLoading(true);
    switch (tabSelection) {
      case '1':
        getAvancesByAsignatura(pageReportSelected.index, true);
        break;
      case '2':
        getAvancesByDocente(pageReportSelected.index, true);
        break;
      case '3':
        getAvancesByPeriodo(pageReportSelected.index, true);
        break;
      case '4':
        getHomologacionesByIdSolicitante(pageReportSelected.index, true);
        break;
      case '5':
        getHomologacionesByPeriodo(pageReportSelected.index, true);
        break;

      default:
        break;
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
                <h4 className={classes.cardTitleWhite}>Reportes</h4>
              </div>
            </CardHeader>
            <CardBody>
              <TabContext value={tabSelection}>

                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={tabSelection} onChange={(event, value) => { setTabSelection(value); }}
                    variant="scrollable"
                    scrollButtons="auto"
                  >
                    <Tab label="Avances por asignatura" value={'1'} wrapped={true} />
                    <Tab label="Avances de asignatura por docente" value={'2'} wrapped={true} />
                    <Tab label="Avances por periodo" value={'3'} wrapped={true} />
                    <Tab label="Homologación por estudiante" value={'4'} wrapped={true} />
                    <Tab label="Homologación por periodo" value={'5'} wrapped={true} />
                  </Tabs>
                </Box>

                <TabPanel value={'1'} >
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={4}>
                      <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={'sw'} >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <DatePicker
                            views={['year']}
                            label="Año del avance"
                            inputVariant="outlined"
                            margin="dense"
                            className={classes.CustomTextField}
                            format="YYYY"
                            value={filterObject1.añoAvance}
                            onChange={(newValue: any) => {
                              setFilterObject1({ ...filterObject1, añoAvance: newValue });
                            }}
                            clearable={true}
                            clearLabel="Limpiar"
                          />
                          {
                            filterObject1.añoAvance ? (
                              <CloseIcon onClick={(e) => setFilterObject1({ ...filterObject1, añoAvance: null })} />
                            ) : null
                          }

                        </div>
                      </MuiPickersUtilsProvider>
                    </GridItem>

                    <GridItem xs={12} sm={12} md={2}>
                      <Autocomplete
                        id="tags-outlined"
                        options={['1', '2']}
                        getOptionLabel={(option) => option}
                        filterSelectedOptions={true}
                        onChange={(e, option) => setFilterObject1({ ...filterObject1, periodo: option })}
                        value={filterObject1.periodo}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            id="outlined-estado-solicitud"
                            label="Periodo"
                            variant="outlined"
                            margin="dense"
                            className={classes.CustomTextField}
                            error={filterObject1 && !filterObject1.periodo ? true : false}
                          />
                        )}
                      />
                    </GridItem>

                    <GridItem xs={12} sm={12} md={4} >
                      <Autocomplete
                        id="tags-outlined"
                        options={asignaturasList}
                        getOptionLabel={(option) => `${option.codigo} - ${option.nombre}`}
                        filterSelectedOptions={true}
                        onChange={(e, option) => setFilterObject1({ ...filterObject1, asignatura: option || null })}
                        value={filterObject1.asignatura}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            id="outlined-rol"
                            label="Asignatura"
                            variant="outlined"
                            margin="dense"
                            error={!filterObject1.asignatura || !filterObject1.asignatura._id ? true : false}
                            className={classes.CustomTextField}
                          />
                        )}
                      />
                    </GridItem>

                    <GridItem xs={12} sm={12} md={2} >
                      <Button key={'filtersButton'} color={'primary'} round={true} variant="outlined" endIcon={<SendIcon />}
                        onClick={() => {
                          setOpenModalLoading(true);
                          getAvancesByAsignatura();
                        }} >
                      </Button>
                    </GridItem>

                    <GridItem xs={12} sm={12} md={12} >
                      <hr />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} >
                      <br />
                    </GridItem>

                  </GridContainer>

                  {
                    !avanceByAsignaturaList.length ?
                      <h2 style={{ textAlign: 'center' }}>No se encontraron avances en la base de datos</h2>
                      :
                      <>
                        <Table
                          tableHeaderColor="success"
                          tableHead={[
                            'Año del avance',
                            'Periodo',
                            'Porcentaje de avance',
                            'Descripción',
                            'Fecha de creación',
                            'Fecha ultima actualización'
                          ]}
                          tableData={avanceByAsignaturaList}
                        />
                        <div style={{ width: '100%' }}>
                          <br />
                        </div>
                        <div className={classes.centerContent}>
                          <br />
                          <TablePagination page={pagePagination} onChangePage={(page: any) => {
                            setOpenModalLoading(true);
                            getAvancesByAsignatura(page);
                          }} totalData={totalDataList} />

                        </div>
                      </>
                  }

                </TabPanel>

                <TabPanel value={'2'} >
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={4}>
                      <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={'sw'} >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <DatePicker
                            views={['year']}
                            label="Año del avance"
                            inputVariant="outlined"
                            margin="dense"
                            className={classes.CustomTextField}
                            format="YYYY"
                            value={filterObject2.añoAvance}
                            onChange={(newValue: any) => {
                              setFilterObject2({ ...filterObject2, añoAvance: newValue });
                            }}
                            clearable={true}
                            clearLabel="Limpiar"
                          />
                          {
                            filterObject2.añoAvance ? (
                              <CloseIcon onClick={(e) => setFilterObject2({ ...filterObject2, añoAvance: null })} />
                            ) : null
                          }

                        </div>
                      </MuiPickersUtilsProvider>
                    </GridItem>

                    <GridItem xs={12} sm={12} md={2}>
                      <Autocomplete
                        id="tags-outlined"
                        options={['1', '2']}
                        getOptionLabel={(option) => option}
                        filterSelectedOptions={true}
                        onChange={(e, option) => setFilterObject2({ ...filterObject2, periodo: option })}
                        value={filterObject2.periodo}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            id="outlined-estado-solicitud"
                            label="Periodo"
                            variant="outlined"
                            margin="dense"
                            className={classes.CustomTextField}
                            error={filterObject2 && !filterObject2.periodo ? true : false}
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
                        onChange={(e, option) => setFilterObject2({ ...filterObject2, docente: option || null })}
                        value={filterObject2.docente}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            id="outlined-rol"
                            label="Docente"
                            variant="outlined"
                            margin="dense"
                            error={!filterObject2.docente || !filterObject2.docente._id ? true : false}
                            className={classes.CustomTextField}
                          />
                        )}
                      />
                    </GridItem>

                    <GridItem xs={12} sm={12} md={2} >
                      <Button key={'filtersButton'} color={'primary'} round={true} variant="outlined" endIcon={<SendIcon />}
                        onClick={() => {
                          setOpenModalLoading(true);
                          getAvancesByDocente();
                        }} >
                      </Button>
                    </GridItem>

                    <GridItem xs={12} sm={12} md={12} >
                      <hr />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} >
                      <br />
                    </GridItem>

                  </GridContainer>

                  {
                    !avanceByDocenteList.length ?
                      <h2 style={{ textAlign: 'center' }}>No se encontraron avances en la base de datos</h2>
                      :
                      <>
                        <Table
                          tableHeaderColor="success"
                          tableHead={[
                            'Año del avance',
                            'Periodo',
                            'Porcentaje de avance',
                            'Descripción',
                            'Fecha de creación',
                            'Fecha ultima actualización'
                          ]}
                          tableData={avanceByDocenteList}
                        />
                        <div style={{ width: '100%' }}>
                          <br />
                        </div>
                        <div className={classes.centerContent}>
                          <br />
                          <TablePagination page={pagePagination} onChangePage={(page: any) => {
                            setOpenModalLoading(true);
                            getAvancesByDocente(page);
                          }} totalData={totalDataList} />

                        </div>
                      </>
                  }

                </TabPanel>

                <TabPanel value={'3'} >
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={5}>
                      <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={'sw'} >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <DatePicker
                            views={['year']}
                            label="Año del avance"
                            inputVariant="outlined"
                            margin="dense"
                            className={classes.CustomTextField}
                            format="YYYY"
                            value={filterObject3.añoAvance}
                            onChange={(newValue: any) => {
                              setFilterObject3({ ...filterObject3, añoAvance: newValue });
                            }}
                            clearable={true}
                            clearLabel="Limpiar"
                          />
                          {
                            filterObject3.añoAvance ? (
                              <CloseIcon onClick={(e) => setFilterObject3({ ...filterObject3, añoAvance: null })} />
                            ) : null
                          }

                        </div>
                      </MuiPickersUtilsProvider>
                    </GridItem>

                    <GridItem xs={12} sm={12} md={5}>
                      <Autocomplete
                        id="tags-outlined"
                        options={['1', '2']}
                        getOptionLabel={(option) => option}
                        filterSelectedOptions={true}
                        onChange={(e, option) => setFilterObject3({ ...filterObject3, periodo: option })}
                        value={filterObject3.periodo}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            id="outlined-estado-solicitud"
                            label="Periodo"
                            variant="outlined"
                            margin="dense"
                            className={classes.CustomTextField}
                            error={filterObject3 && !filterObject3.periodo ? true : false}
                          />
                        )}
                      />
                    </GridItem>

                    <GridItem xs={12} sm={12} md={2} >
                      <Button key={'filtersButton'} color={'primary'} round={true} variant="outlined" endIcon={<SendIcon />}
                        onClick={() => {
                          setOpenModalLoading(true);
                          getAvancesByPeriodo();
                        }} >
                      </Button>
                    </GridItem>

                    <GridItem xs={12} sm={12} md={12} >
                      <hr />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} >
                      <br />
                    </GridItem>

                  </GridContainer>

                  {
                    !avanceByPeriodoList.length ?
                      <h2 style={{ textAlign: 'center' }}>No se encontraron avances en la base de datos</h2>
                      :
                      <>
                        <Table
                          tableHeaderColor="success"
                          tableHead={[
                            'Año del avance',
                            'Periodo',
                            'Porcentaje de avance',
                            'Descripción',
                            'Fecha de creación',
                            'Fecha ultima actualización'
                          ]}
                          tableData={avanceByPeriodoList}
                        />
                        <div style={{ width: '100%' }}>
                          <br />
                        </div>
                        <div className={classes.centerContent}>
                          <br />
                          <TablePagination page={pagePagination} onChangePage={(page: any) => {
                            setOpenModalLoading(true);
                            getAvancesByPeriodo(page);
                          }} totalData={totalDataList} />

                        </div>
                      </>
                  }
                </TabPanel>

                <TabPanel value={'4'} >
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={6}>
                      <TextField
                        id="outlined-email"
                        label="Identificación del solicitante"
                        variant="outlined"
                        margin="dense"
                        type={'number'}
                        className={classes.CustomTextField}
                        error={!filterIdSolicitante ? true : false}
                        value={filterIdSolicitante}
                        onChange={(event) => {
                          setFilterIdSolicitante(event.target.value);
                        }}
                      />
                    </GridItem>

                    <GridItem xs={12} sm={12} md={2} >
                      <Button key={'filtersButton'} color={'primary'} round={true} variant="outlined" endIcon={<SendIcon />}
                        onClick={() => {
                          setOpenModalLoading(true);
                          getHomologacionesByIdSolicitante();
                        }} >
                      </Button>
                    </GridItem>

                    <GridItem xs={12} sm={12} md={12} >
                      <hr />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} >
                      <br />
                    </GridItem>

                  </GridContainer>

                  {
                    !homologacionesByIdSolicitanteList.length ?
                      <h2 style={{ textAlign: 'center' }}>No se encontraron avances en la base de datos</h2>
                      :
                      <>
                        <Table
                          tableHeaderColor="success"
                          tableHead={[
                            'Identificacion del solicitante',
                            'Nombre del solicitante',
                            'Asignatura del solicitante',
                            'Descripcion',
                            'Fecha de creación',
                            'Fecha ultima actualización',
                          ]}
                          tableData={homologacionesByIdSolicitanteList}
                        />
                        <div style={{ width: '100%' }}>
                          <br />
                        </div>
                        <div className={classes.centerContent}>
                          <br />
                          <TablePagination page={pagePagination} onChangePage={(page: any) => {
                            setOpenModalLoading(true);
                            getHomologacionesByIdSolicitante(page);
                          }} totalData={totalDataList} />

                        </div>
                      </>
                  }

                </TabPanel>

                <TabPanel value={'5'} >
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={5}>
                      <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={'sw'} >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <DatePicker
                            views={['year']}
                            label="Año del avance"
                            inputVariant="outlined"
                            margin="dense"
                            className={classes.CustomTextField}
                            format="YYYY"
                            value={filterObject5.añoHomologacion}
                            onChange={(newValue: any) => {
                              setFilterObject5({ ...filterObject5, añoHomologacion: newValue });
                            }}
                            clearable={true}
                            clearLabel="Limpiar"
                          />
                          {
                            filterObject5.añoHomologacion ? (
                              <CloseIcon onClick={(e) => setFilterObject5({ ...filterObject5, añoHomologacion: null })} />
                            ) : null
                          }

                        </div>
                      </MuiPickersUtilsProvider>
                    </GridItem>

                    <GridItem xs={12} sm={12} md={5}>
                      <Autocomplete
                        id="tags-outlined"
                        options={['1', '2']}
                        getOptionLabel={(option) => option}
                        filterSelectedOptions={true}
                        onChange={(e, option) => setFilterObject5({ ...filterObject5, periodo: option })}
                        value={filterObject5.periodo}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            id="outlined-estado-solicitud"
                            label="Periodo"
                            variant="outlined"
                            margin="dense"
                            className={classes.CustomTextField}
                            error={filterObject5 && !filterObject5.periodo ? true : false}
                          />
                        )}
                      />
                    </GridItem>

                    <GridItem xs={12} sm={12} md={2} >
                      <Button key={'filtersButton'} color={'primary'} round={true} variant="outlined" endIcon={<SendIcon />}
                        onClick={() => {
                          setOpenModalLoading(true);
                          getHomologacionesByPeriodo();
                        }} >
                      </Button>
                    </GridItem>

                    <GridItem xs={12} sm={12} md={12} >
                      <hr />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} >
                      <br />
                    </GridItem>

                  </GridContainer>

                  {
                    !homologacionesByPeriodoList.length ?
                      <h2 style={{ textAlign: 'center' }}>No se encontraron avances en la base de datos</h2>
                      :
                      <>
                        <Table
                          tableHeaderColor="success"
                          tableHead={[
                            'Año del avance',
                            'Periodo',
                            'Porcentaje de avance',
                            'Descripción',
                            'Fecha de creación',
                            'Fecha ultima actualización'
                          ]}
                          tableData={homologacionesByPeriodoList}
                        />
                        <div style={{ width: '100%' }}>
                          <br />
                        </div>
                        <div className={classes.centerContent}>
                          <br />
                          <TablePagination page={pagePagination} onChangePage={(page: any) => {
                            setOpenModalLoading(true);
                            getHomologacionesByPeriodo(page);
                          }} totalData={totalDataList} />

                        </div>
                      </>
                  }
                </TabPanel>

              </TabContext>

            </CardBody>
          </Card>

        </GridItem>
      </GridContainer>

      <div className={classes.containerFloatButton}>
        <Tooltip id="addTooltip" title="Generar Reporte" placement="left" classes={{ tooltip: classes.tooltip }}>
          <div>
            <Button key={'searchButton'} color={'primary'} round={true} justIcon={true} startIcon={<AttachFileIcon />}
              onClick={() => {
                if (totalDataList) {
                  handleReportOpenModal();
                } else {
                  setSeverityAlert('info');
                  setShowAlert(true);
                  setMessagesAlert('No hay datos para el reporte con los filtros seleccionados');
                  setTimeout(() => {
                    setShowAlert(false);
                  }, 1000);
                }
              }} />
          </div>
        </Tooltip>
      </div>

      {/* Modal de generacion de reportes */}

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
                  <h4 className={classes.cardTitleWhite}>Descargar reporte</h4>
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

              <GridContainer>
                <GridItem xs={12} sm={12} md={12} >
                  <br />
                </GridItem>

                <GridItem xs={12} sm={12} md={12} >
                  <Autocomplete
                    id="tags-outlined"
                    options={paginationReport}
                    getOptionLabel={(option) => option && option.label ? option.label : ''}
                    filterSelectedOptions={true}
                    onChange={(e, option) => setPageReportSelected(option || {})}
                    value={pageReportSelected}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        id="outlined-rol"
                        label="Rango de datos"
                        variant="outlined"
                        margin="dense"
                        className={classes.CustomTextField}
                      />
                    )}
                  />
                </GridItem>
              </GridContainer>

              <div className={classes.containerFooterModal} >
                <Button key={'filtersButton'} color={'primary'} round={true} variant="outlined" endIcon={<SendIcon />}
                  onClick={() => {
                    if (pageReportSelected && pageReportSelected.label) {
                      handleReportCallFunction();
                    } else {
                      setSeverityAlert('info');
                      setShowAlert(true);
                      setMessagesAlert('Seleccione el rango de datos para el reporte');
                      setTimeout(() => {
                        setShowAlert(false);
                      }, 1000);
                    }
                  }} >
                  {'Generar Reporte'}
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

export default withStyles(styles)(Reportes);
