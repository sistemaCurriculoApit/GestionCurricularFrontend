import React, { useState, useEffect, useMemo } from 'react';
import { SelectChangeEvent, createStyles } from '@mui/material';
import { withStyles } from '@material-ui/core/styles';

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
import { getProgramasPopulated } from '../../services/programasServices';
import { GetFileAsignatura, getSubjectsByAreaId } from '../../services/asignaturasServices';
import { useSubjectModal } from './Components/Modal/Modal';
import { transformSubjects, subjectInitialValue } from './Util';
import { Select, FilterWrapper } from '../../components';
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

const Micrositios = ({ classes }: any) => {
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [severityAlert, setSeverityAlert] = useState<string>('');
  const [messageAlert, setMessagesAlert] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFirstTime, setIsFirstTime] = useState<boolean>(true);

  const [programs, setPrograms] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [selectedProgramId, setSelectedProgramId] = useState<string>('');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [selectedAreaId, setSelectedAreaId] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<Subject>(subjectInitialValue);
  const [selectedSubjectType, setSelectedSubjectType] = useState<any>({});

  const [subjectsCount, setSubjectsCount] = useState(0);
  const [page, setPage] = useState<number>(0);

  const { Modal: SubjectModal, setIsModalOpen } = useSubjectModal();

  const programsIds = useMemo(() => (
    programs.reduce((acc, program) => ({ ...acc, [program._id]: program }), {})
  ), [programs]);

  const plansIds = useMemo(() => (
    plans.reduce((acc, plan) => ({ ...acc, [plan._id]: plan }), {})
  ), [plans]);

  const areasIds = useMemo(() => (
    areas.reduce((acc, area) => ({ ...acc, [area._id]: area }), {})
  ), [areas])

  const subjectTransformation = useMemo(() => transformSubjects({
    subjects: subjects,
    classes: classes,
    subjectTypes: tiposAsignatura,
    onStateClick: (_subject, subjectTypes) => {
      setIsModalOpen(true);
      setIsLoading(true);

      setSelectedSubjectType(subjectTypes.find((_subjectType: any) => _subjectType.id === _subject.asignaturaTipo) || {});
      setSelectedSubject(_subject);

      setIsLoading(false);
    },
    onDownloadClick: (data) => {
      getDataToDownloadFormat(data);
    }
  }), [subjects, classes, tiposAsignatura])

  const setMessage = ([level, message]: string[]) => {
    setSeverityAlert(level);
    setShowAlert(true);
    setMessagesAlert(message);
    setTimeout(() => {
      setShowAlert(false);
    }, 1000);
  };

  const cleanSubject = () => {
    setSelectedSubject(subjectInitialValue);
    setIsModalOpen(false);
  };

  const downloadCourseFormat = async (_subject?: any, fromObject?: boolean) => {
    setIsLoading(true);
    const baseSubject = fromObject ? selectedSubject : _subject;
    const asignaturaToGetFile = {
      ...baseSubject,
      asignaturaTipo: '',
    };

    const response: any = await GetFileAsignatura(asignaturaToGetFile);
    const messageType = response ? 'success' : 'error';
    const message = response ? 'Archivo PDF generado satisfactoriamente.' : 'Ocurrio un error generando el archivo PDF.';

    setMessage([messageType, message]);
    setIsLoading(false);
  };

  const getDataToDownloadFormat = (_subject?: any) => {
    cleanSubject();
    setSelectedSubjectType(tiposAsignatura.find((tipoAsignatura: any) => tipoAsignatura.id === _subject.asignaturaTipo) || {});
    downloadCourseFormat(_subject, false);
  };

  const getSubjects = async (_page?: number) => {
    setIsLoading(true);
    setSubjectsCount(0);

    if (isFirstTime) {
      setIsFirstTime(false);
    }

    const _subjects: Subject[] = await getSubjectsByAreaId({
      page: _page,
      areaId: selectedAreaId
    });

    if (!_subjects.length) {
      setSubjects([]);
      setSubjectsCount(0);
      setIsLoading(false);
      setMessage(['info', 'No se encontraron registros en la base de datos, por favor prueba con otros filtros']);
      return;
    }

    setSubjectsCount(areasIds[selectedAreaId].asignatura.length)

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
        const _programs = await getProgramasPopulated();
        const defaultProgram = !isFirstTime ? _programs[0] : _programs.find((program: any) => program.codigo === ID_ENGINEERING_PROGRAM);

        setPrograms(_programs);
        setSelectedProgramId(defaultProgram._id);
        setIsLoading(false);
      } catch {
        setMessage(['error', 'Intente de nuevo']);
        setIsLoading(false);
      }
    };

    init();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setSelectedPlanId('');
    setSelectedAreaId('');
    setPlans([]);
    setAreas([]);
    setSubjects([]);
    setSubjectsCount(0);

    if (selectedProgramId) {
      const { plan: _plan } = programsIds[selectedProgramId];
      const defaultPlan = !isFirstTime ? _plan[0] : _plan.find((plan: any) => plan.codigo === ID_ENGINEERING_PLAN);

      setPlans(_plan);
      setSelectedPlanId(defaultPlan._id)
    }
    setIsLoading(false);
  }, [selectedProgramId]);

  useEffect(() => {
    setIsLoading(true);
    setSelectedAreaId('');
    setAreas([]);

    if (selectedPlanId) {
      const { area: _areas } = plansIds[selectedPlanId];
      const defaultArea = !isFirstTime ? _areas[0] : _areas.find((area: any) => area.codigo === ID_ENGINEERING_AREA);

      setAreas(_areas);
      setSelectedAreaId(defaultArea._id)
    }

    setIsLoading(false);
  }, [selectedPlanId]);

  useEffect(() => {
    setSubjects([]);
    if (selectedAreaId) {
      setPage(0);
      getSubjects();
    }
  }, [selectedAreaId]);

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
              <FilterWrapper>
                <Select
                  name='programs-select'
                  label="Programa"
                  onChange={(e: SelectChangeEvent<string>) => setSelectedProgramId(e.target.value)}
                  value={selectedProgramId}
                  options={Object.keys(programsIds)}
                  display={(_programId: string) => {
                    const p = programsIds[_programId];
                    return `${p.codigo} - ${p.nombre}`;
                  }}
                  xs={{ minWidth: 300, width: '30%', '& > label.MuiFormLabel-root': { top: 0 } }}
                />

                <Select
                  name='plans-select'
                  label="Plan"
                  onChange={(e: SelectChangeEvent<string>) => setSelectedPlanId(e.target.value)}
                  value={selectedPlanId}
                  options={Object.keys(plansIds)}
                  display={(_planId: string) => {
                    const p = plansIds[_planId];
                    return `${p.codigo} - ${p.nombre}`;
                  }}
                  xs={{ minWidth: 250, width: '25%', '& > label.MuiFormLabel-root': { top: 0 } }}
                />

                <Select
                  name='area-select'
                  label="Área"
                  onChange={(e: SelectChangeEvent<string>) => setSelectedAreaId(e.target.value)}
                  value={selectedAreaId}
                  options={Object.keys(areasIds)}
                  display={(_areaId: string) => {
                    const a = areasIds[_areaId];
                    return `${a.codigo} - ${a.nombre}`;
                  }}
                  xs={{ minWidth: 300, width: '30%', '& > label.MuiFormLabel-root': { top: 0 } }}
                />
              </FilterWrapper>
              <GridContainer>
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
                      tableData={subjectTransformation}
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
        subject={selectedSubject}
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
