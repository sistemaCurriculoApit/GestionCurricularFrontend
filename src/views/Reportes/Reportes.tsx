import React, { useState } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import TabContext from '@material-ui/lab/TabContext';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TabPanel from '@material-ui/lab/TabPanel';
import Box from '@material-ui/core/Box';
import 'moment/locale/es';

import { createStyles } from '@material-ui/core';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import ModalLoading from '../../components/ModalLoading/ModalLoading';
import AlertComponent from '../../components/Alert/AlertComponent';

// jss
import { CustomSearchTextField, CustomTextField } from '../../assets/jss/material-dashboard-react/components/customInputStyle';
import cardTabletCustomStyle from '../../assets/jss/material-dashboard-react/components/cardTabletCustomStyle';
import { containerFloatButton } from '../../assets/jss/material-dashboard-react/components/buttonStyle';
import tooltipStyle from '../../assets/jss/material-dashboard-react/tooltipStyle';
import { container, containerFormModal, containerFooterModal, modalForm } from '../../assets/jss/material-dashboard-react';

import { AdvancementsBySubjectTab } from './Components/Tabs/AdvancementsBySubject/AdvacementsBySubject';
import { AdvacementsByProfessorTab } from './Components/Tabs/AdvancementsByProfessor/AdvancementsByProfessor';
import { AdvancementsByPeriodTab } from './Components/Tabs/AdvancementsByPeriod/AdvancementsByPeriod';
import { HomologationsByApplicantTab } from './Components/Tabs/HomologationsByApplicant/HomologationsByApplication';
import { HomologationsByPeriodTab } from './Components/Tabs/HomologationsByPeriod/HomologationsByPeriod';
import { useExportModal } from './Components/Modal/Modal';
import { ReportButton } from './Components/ReportButton/ReportButton';

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

const Reportes: React.FC<any> = ({ classes }) => {
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [severityAlert, setSeverityAlert] = useState<string>('');
  const [messageAlert, setMessagesAlert] = useState<string>('');
  const [tabSelection, setTabSelection] = useState<string>('1');
  const [openModalLoading, setOpenModalLoading] = useState<boolean>(false);
  const [paginationReport, setPaginationReport] = useState<any[]>([]);
  const [reportingData, setReportingData] = useState<{ dataCount: number, reportFunc: (page: number) => Promise<void> }>({
    dataCount: 0,
    reportFunc: async () => { }
  });
  const { Modal: ReportModal, setIsModalOpen } = useExportModal();

  const setError = ([severity, message]: string[]) => {
    setSeverityAlert(severity);
    setShowAlert(true);
    setMessagesAlert(message);
    setTimeout(() => {
      setShowAlert(false);
    }, 1000);
  };

  const handleReportOpenModal = async () => {
    const pagesReport = Math.ceil(reportingData.dataCount / 100);
    const selectRange = [];
    for (let i = 1; i === pagesReport; i++) {
      selectRange.push({ index: i - 1, label: `${i} - ${i * 100}` });
    }
    setPaginationReport(selectRange);
    setIsModalOpen(true);
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
                  <Tabs value={tabSelection} onChange={(_, value) => { setTabSelection(value); }}
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
                  <AdvancementsBySubjectTab
                    classes={classes}
                    setError={setError}
                    setLoading={setOpenModalLoading}
                    setPeportData={setReportingData}
                  />

                </TabPanel>

                <TabPanel value={'2'} >
                  <AdvacementsByProfessorTab
                    classes={classes}
                    setError={setError}
                    setLoading={setOpenModalLoading}
                    setPeportData={setReportingData}
                  />
                </TabPanel>

                <TabPanel value={'3'} >
                  <AdvancementsByPeriodTab
                    classes={classes}
                    setError={setError}
                    setLoading={setOpenModalLoading}
                    setPeportData={setReportingData}
                  />
                </TabPanel>

                <TabPanel value={'4'} >
                  <HomologationsByApplicantTab
                    classes={classes}
                    setError={setError}
                    setLoading={setOpenModalLoading}
                    setPeportData={setReportingData}
                  />
                </TabPanel>

                <TabPanel value={'5'} >
                  <HomologationsByPeriodTab
                    classes={classes}
                    setError={setError}
                    setLoading={setOpenModalLoading}
                    setPeportData={setReportingData}
                  />
                </TabPanel>

              </TabContext>

            </CardBody>
          </Card>

        </GridItem>
      </GridContainer>

      <ReportButton
        classes={classes}
        onClick={() => {
          if (reportingData.dataCount) {
            handleReportOpenModal();
          } else {
            setError(['info', 'No hay datos para el reporte con los filtros seleccionados']);
          }
        }}
      />

      <ReportModal
        classes={classes}
        paginationReport={paginationReport}
        onDownloadClick={(pageSelected) => {
          if (pageSelected && pageSelected.label) {
            setOpenModalLoading(true);
            reportingData.reportFunc(pageSelected);
          } else {
            setError(['info', 'Seleccione el rango de datos para el reporte']);
          }
        }}
      />

      <ModalLoading showModal={openModalLoading} />
    </div>
  );
};

export default withStyles(styles)(Reportes);
