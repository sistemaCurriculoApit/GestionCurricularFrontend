import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { TextField, createStyles } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

import AlertComponent from '../../components/Alert/AlertComponent';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import Table from '../../components/Table/Table';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import TablePagination from '../../components/Pagination/TablePagination';
import ModalLoading from '../../components/ModalLoading/ModalLoading';

import { CustomSearchTextField, CustomTextField } from '../../assets/jss/material-dashboard-react/components/customInputStyle';
import { containerFloatButton } from '../../assets/jss/material-dashboard-react/components/buttonStyle';
import { container, containerFormModal, containerFooterModal, modalForm } from '../../assets/jss/material-dashboard-react';
import cardTabletCustomStyle from '../../assets/jss/material-dashboard-react/components/cardTabletCustomStyle';
import tooltipStyle from '../../assets/jss/material-dashboard-react/tooltipStyle';

import { tiposAsignatura } from '../../constants/generalConstants';
import { getAllProgramasNoToken } from '../../services/programasServices';
import { getPlanesByListIdsNoToken } from '../../services/planesServices';
import { getAreasByListIdsNoToken } from '../../services/areasServices';
import { getAllContenidoByAsignaturaNoToken } from '../../services/contenidosServices';
import { getAsignaturaByListIdsPaginatedNoToken, GetFileAsignatura, getAllAsignaturasWithPlanCodeNT } from '../../services/asignaturasServices';
import { getAllDocentesNT } from '../../services/docentesServices';
import { useSubjectModal } from './Components/Modal/Modal';
import { transformSubjects } from './Util/SubjectTransformation';
import { Subject } from '../../models';

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

const ID_ENGINEERING_PROGRAM = '1';
const ID_ENGINEERING_PLAN = '8210';
const ID_ENGINEERING_AREA = '3';
const subjectInitialValue: Subject = {
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
  prerrequisitos: '',
  correquisitos: '',
  presentacionAsignatura: '',
  justificacionAsignatura: '',
  objetivoGeneral: '',
  objetivosEspecificos: '',
  competencias: '',
  mediosEducativos: '',
  evaluacion: '',
  bibliografia: '',
  cibergrafia: '',
  contenido: [],
  docente: [],
  equivalencia: []
};

const Micrositios = ({ classes }: any) => {
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [severityAlert, setSeverityAlert] = useState<string>('');
  const [messageAlert, setMessagesAlert] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [programs, setPrograms] = useState<any[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [areas, setAreas] = useState<any[]>([]);
  const [selectedArea, setSelectedArea] = useState<any>(null);
  const [selectedSubjectType, setSelectedSubjectType] = useState<any>({});

  const [professors, setProfessors] = useState<any>(null);
  const [equivalences, setEquivalences] = useState<any>(null);
  const [contents, setContents] = useState<any>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [subjectsCount, setSubjectsCount] = useState(0);
  const [page, setPage] = useState(0);
  const [subject, setSubject] = useState<Subject>(subjectInitialValue);
  const [isFirstTime, setIsFirstTime] = useState<boolean>(true);
  const { Modal: SubjectModal, setIsModalOpen } = useSubjectModal();

  const setMessage = ([level, message]: string[]) => {
    setSeverityAlert(level);
    setShowAlert(true);
    setMessagesAlert(message);
    setTimeout(() => {
      setShowAlert(false);
    }, 1000);
  };

  const cleanSubject = () => {
    setSubject(subjectInitialValue);
    setIsModalOpen(false);
  };

  const getCompleteSubject = (_subject: Subject) => {
    const docente = _subject.docente.map((professor: any) => professors[professor._id] || professor);
    const contenido = _subject.contenido.map((content: any) => contents[content._id] || content);
    const equivalencia = _subject.equivalencia.map((equivalency: any) => equivalences[equivalency._id] || equivalences);

    return ({
      ..._subject,
      docente,
      contenido,
      equivalencia
    });
  };

  const downloadCourseFormat = async (_subject?: any, fromObject?: boolean) => {
    setIsLoading(true);
    const baseSubject = fromObject ? subject : _subject;
    const asignaturaToGetFile = {
      ...baseSubject,
      asignaturaTipo: '',
      docente: baseSubject.docente ? baseSubject.docente.map(({ _id }: any) => ({ _id })) : null,
      contenido: baseSubject.contenido ? baseSubject.contenido.map(({ _id, nombre, descripcion }: any) => ({ _id, nombre, descripcion })) : null,
      equivalencia: baseSubject.equivalencia ? baseSubject.equivalencia.map(({ asignatura }: any) => ({ _id: asignatura._id })) : null
    };

    const response: any = await GetFileAsignatura(asignaturaToGetFile);
    const messageType = response ? 'success' : 'error';
    const message = response ? 'Archivo PDF generado satisfactoriamente.' : 'Ocurrio un error generando el archivo PDF.';

    setMessage([messageType, message]);
    setIsLoading(false);
  };

  const getAreas = async () => {
    const areaIds = selectedPlan.area.map((_plan: any) => _plan._id);

    const response: any = await getAreasByListIdsNoToken({ search: '', areaIds });

    if (!response || !response.areas) {
      setAreas([]);
      setIsLoading(false);
      return;
    }

    const { areas: _areas } = response;
    setAreas(_areas);

    const defaultArea = !isFirstTime ? _areas[0] : _areas.find((area: any) => area.codigo === ID_ENGINEERING_AREA);
    setSelectedArea(defaultArea);
    setIsLoading(false);
    return;
  };

  const getPlans = async () => {
    setIsLoading(true);
    const planIds = selectedProgram.plan.map((plan: any) => plan._id);

    const response: any = await getPlanesByListIdsNoToken({ search: '', planIds });

    if (!response || !response.planes) {
      setPlans([]);
      setIsLoading(false);
      return;
    }

    const { planes } = response;

    setPlans(planes);

    const defaultPlan = !isFirstTime ? planes[0] : planes.find((plan: any) => plan.codigo === ID_ENGINEERING_PLAN);
    setSelectedPlan(defaultPlan);
    setIsLoading(false);
    return;
  };

  const getDataToDownloadFormat = (_subject?: any) => {
    cleanSubject();
    setSelectedSubjectType(tiposAsignatura.find((tipoAsignatura: any) => tipoAsignatura.id === _subject.asignaturaTipo) || {});

    const subjectData = getCompleteSubject(_subject);
    downloadCourseFormat(subjectData, false);
  };

  const getSubjects = async (_page?: any) => {
    setIsLoading(true);

    if (isFirstTime) {
      setIsFirstTime(false);
    }

    const asignaturaIds = selectedArea.asignatura.map((_subject: Subject) => _subject._id);
    const response: any = await getAsignaturaByListIdsPaginatedNoToken({
      page: _page,
      asignaturaIds
    });

    if (!response || !response.asignaturas || !response.asignaturas.length) {
      setSubjects([]);
      setSubjectsCount(0);
      setMessage(['info', 'No se encontraron registros en la base de datos, por favor prueba con otros filtros']);
      return;
    }

    const _subjects = transformSubjects({
      subjects: response.asignaturas,
      classes: classes,
      subjectTypes: tiposAsignatura,
      onStateClick: (_subject, subjectTypes) => {
        setIsModalOpen(true);
        setIsLoading(true);
        setSelectedSubjectType(subjectTypes.find((_subjectType: any) => _subjectType.id === _subject.asignaturaTipo) || {});
        setSubject(getCompleteSubject(_subject));
        setIsLoading(false);
      },
      onDownloadClick: (data) => {
        getDataToDownloadFormat(data);
      }
    });

    setSubjectsCount(response.totalAsignaturas);
    setSubjects(_subjects);
    setIsLoading(false);
  };

  const onChangePage = (_page: number) => {
    setIsLoading(true);
    setPage(_page);
    getSubjects(_page);
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const [
          { docentes },
          { contenidos },
          { asignaturas },
          { programas }
        ] = await Promise.all([
          getAllDocentesNT({ search: '' }),
          getAllContenidoByAsignaturaNoToken({ search: '' }),
          getAllAsignaturasWithPlanCodeNT({ search: '' }),
          getAllProgramasNoToken({ search: '' })
        ]);

        setPrograms(programas);

        const defaultProgram = !isFirstTime ? programas[0] : programas.find((program: any) => program.codigo === ID_ENGINEERING_PROGRAM);
        const contentsHashMap = contenidos.reduce((acc: any, el: any) => ({ ...acc, [el._id]: el }), {});
        const professorsHashMap = docentes.reduce((acc: any, el: any) => ({ ...acc, [el._id]: el }), {});
        const subjectsHashMap = asignaturas.reduce((acc: any, el: any) => ({ ...acc, [el.asignatura._id]: el }), {});

        setSelectedProgram(defaultProgram);
        setProfessors(professorsHashMap);
        setContents(contentsHashMap);
        setEquivalences(subjectsHashMap);
        setIsLoading(false);
      } catch {
        setMessage(['error', 'Intente de nuevo']);
        setIsLoading(false);
      }
    };

    init();
  }, []);

  useEffect(() => {
    setSelectedPlan(null);
    setSelectedArea(null);
    setPlans([]);
    setAreas([]);
    setSubjects([]);
    setSubjectsCount(0);

    if (selectedProgram && selectedProgram._id) {
      getPlans();
    }
  }, [selectedProgram]);

  useEffect(() => {
    if (selectedPlan && selectedPlan._id) {
      getAreas();
    }
  }, [selectedPlan]);

  useEffect(() => {
    if (selectedArea && selectedArea._id) {
      getSubjects();
    }
  }, [selectedArea]);

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
                    options={programs}
                    getOptionLabel={(option: any) => option._id ? `${option.codigo} - ${option.nombre}` : ''}
                    disableClearable={true}
                    filterSelectedOptions={true}
                    onChange={(_, option) => {
                      setSelectedProgram(option || {});
                      setSelectedPlan({});
                      setSelectedArea({});
                      setPlans([]);
                      setAreas([]);
                      setSubjects([]);
                      setSubjectsCount(0);

                    }}
                    value={selectedProgram}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        id="outlined-rol"
                        label="Programa"
                        variant="outlined"
                        margin="dense"
                        error={selectedProgram && !selectedProgram._id ? true : false}
                        className={classes.CustomTextField}
                      />
                    )}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4} >
                  <Autocomplete
                    id="tags-outlined"
                    options={plans}
                    getOptionLabel={(option: any) => option._id ? `${option.codigo} - ${option.nombre}` : ''}
                    disableClearable={true}
                    filterSelectedOptions={true}
                    onChange={(_, option) => {
                      setSelectedPlan(option || {});
                      setSelectedArea({});
                      setAreas([]);
                      setSubjects([]);
                      setSubjectsCount(0);

                    }}
                    value={selectedPlan}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        id="outlined-rol"
                        label="Plan"
                        variant="outlined"
                        margin="dense"
                        error={selectedPlan && !selectedPlan._id ? true : false}
                        className={classes.CustomTextField}
                      />
                    )}
                  />
                </GridItem>

                <GridItem xs={12} sm={12} md={4} >
                  <Autocomplete
                    id="tags-outlined"
                    options={areas}
                    getOptionLabel={(option) => option._id ? `${option.codigo} - ${option.nombre}` : ''}
                    disableClearable={true}
                    filterSelectedOptions={true}
                    onChange={(_, option) => {
                      setSelectedArea(option || {});
                    }}
                    value={selectedArea}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        id="outlined-rol"
                        label="Área"
                        variant="outlined"
                        margin="dense"
                        error={selectedArea && !selectedArea._id ? true : false}
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
                !subjects.length ?
                  <h2 style={{ textAlign: 'center' }}>No se encontraron asignaturas en la base de datos</h2>
                  : (
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
                      tableData={subjects}
                    />
                  )
              }

            </CardBody>
          </Card>

          <Card className={classes.centerContent}>
            <TablePagination page={page + 1} onChangePage={onChangePage} totalData={subjectsCount} />
          </Card>

        </GridItem>
      </GridContainer>

      <SubjectModal
        classes={classes}
        subject={subject}
        subjectTypes={tiposAsignatura}
        subjectTypesSelected={selectedSubjectType}
        downloadCourseFormat={downloadCourseFormat}
        cleanSubject={cleanSubject}
      />

      <ModalLoading showModal={isLoading} />

    </div>
  );
};

export default withStyles(styles)(Micrositios);
