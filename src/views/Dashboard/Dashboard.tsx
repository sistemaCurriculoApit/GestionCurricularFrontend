import React, { useEffect, useState } from 'react';
// react plugin for creating charts
import ChartistGraph from 'react-chartist';
import { NavLink } from 'react-router-dom';
// @material-ui/core
import withStyles from '@material-ui/core/styles/withStyles';
import Icon from '@material-ui/core/Icon';
import Chip from '@material-ui/core/Chip';

// @material-ui/icons
import Store from '@material-ui/icons/Store';
import Warning from '@material-ui/icons/Warning';
import DateRange from '@material-ui/icons/DateRange';
import LocalOffer from '@material-ui/icons/LocalOffer';
import Update from '@material-ui/icons/Update';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import AccessTime from '@material-ui/icons/AccessTime';
import Accessibility from '@material-ui/icons/Accessibility';
import BugReport from '@material-ui/icons/BugReport';
import Code from '@material-ui/icons/Code';
import Cloud from '@material-ui/icons/Cloud';
import AccountCircle from '@material-ui/icons/AccountCircle';
import DescriptionIcon from '@material-ui/icons/Description';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';



// core components
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import Table from '../../components/Table/Table';
import Tasks from '../../components/Tasks/Tasks';
import CustomTabs from '../../components/CustomTabs/CustomTabs';
import Danger from '../../components/Typography/Danger';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardIcon from '../../components/Card/CardIcon';
import CardBody from '../../components/Card/CardBody';
import CardFooter from '../../components/Card/CardFooter';
import ModalLoading from '../../components/ModalLoading/ModalLoading';

import { bugs, website, server } from '../../variables/general';

import {
  dataBaseLineChart,
  dataBaseBarChart,
  completedTasksChart
} from '../../variables/charts';

import dashboardStyle from '../../assets/jss/material-dashboard-react/views/dashboardStyle';
import { userProfilesObject } from '../../constants/generalConstants';

import { getDashboardData, getDashboardHomologacionesChart, getDashboardAvancesChart } from "../../services/dashboardServices"

const MonthsArray = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
]

function Dashboard(props: any) {
  const { classes } = props;

  const [openModalLoading, setOpenModalLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalDocentes, setTotalDocentes] = useState(0);
  const [totalActas, setTotalActas] = useState(0);
  const [homologacionesChart, setHomologacionesChart] = useState<any>([]);
  const [avancesChart, setAvancesChart] = useState<any>([]);

  const idProfile = localStorage.getItem('idProfileLoggedUser');

  useEffect(() => {
    setOpenModalLoading(true);
    getData();
  }, []);

  const getData = async (page?: any) => {
    let response: any = await getDashboardData();
    let homologacionesChartData: any = await getDashboardHomologacionesChart();
    let avancesChartData: any = await getDashboardAvancesChart();

    if (response) {
      setTotalUsers(response.totalUsers);
      setTotalDocentes(response.totalDocentes);
      setTotalActas(response.totalActas);
    }
    if (homologacionesChartData.homologacionesByMonth && homologacionesChartData.homologacionesByMonth.length) {
      setHomologacionesChart(homologacionesChartData.homologacionesByMonth);
    }
    if (avancesChartData.avancesByMonth && avancesChartData.avancesByMonth.length) {
      setAvancesChart(avancesChartData.avancesByMonth);
    }
    setOpenModalLoading(false);
  }

  const handleRedirectActas = () => {
    if (idProfile) {
      switch (parseInt(idProfile)) {
        case userProfilesObject.admin.id:
          props.history.push('/admin/actas', { openModalCreate: true })

          break;
        case userProfilesObject.coor.id:
          props.history.push('/coordinador/actas', { openModalCreate: true })

          break;
        case userProfilesObject.doc.id:
          props.history.push('/docente/actas', { openModalCreate: true })

          break;

      }
    }
  }

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={4}>
          <Card>
            <CardHeader color="success" stats={true} icon={true}>
              <CardIcon color="success">
                <AccountCircle />
              </CardIcon>
              <p className={classes.cardCategory}>Usuarios creados</p>
              <h3 className={classes.cardTitle}>
                {totalUsers}
              </h3>
            </CardHeader>
            {
              idProfile && parseInt(idProfile) == userProfilesObject.admin.id ?
                <CardFooter stats={true}>
                  <div className={classes.stats}>
                    <a className={classes.a}
                      onClick={e => {
                        e.preventDefault();
                        props.history.push('/admin/administracion/usuarios', { openModalCreate: true })
                      }}
                    >
                      Crear nuevo usuario
                    </a>
                  </div>
                </CardFooter>
                : null
            }
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={4}>
          <Card>
            <CardHeader color="success" stats={true} icon={true}>
              <CardIcon color="success">
                <AssignmentIndIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Docentes creados</p>
              <h3 className={classes.cardTitle}>{totalDocentes}</h3>
            </CardHeader>
            {
              idProfile && parseInt(idProfile) == userProfilesObject.admin.id ?
                <CardFooter stats={true}>
                  <div className={classes.stats}>
                    <a className={classes.a}
                      onClick={e => {
                        e.preventDefault();
                        props.history.push('/admin/administracion/docentes', { openModalCreate: true })
                      }}
                    >
                      Crear nuevo docente
                    </a>
                  </div>
                </CardFooter>
                : null
            }
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={4}>
          <Card>
            <CardHeader color="success" stats={true} icon={true}>
              <CardIcon color="success">
                <DescriptionIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Actas creadas</p>
              <h3 className={classes.cardTitle}>{totalActas}</h3>
            </CardHeader>
            {
              idProfile && (parseInt(idProfile) == userProfilesObject.admin.id ||
                parseInt(idProfile) == userProfilesObject.coor.id ||
                parseInt(idProfile) == userProfilesObject.doc.id)
                ?
                <CardFooter stats={true}>
                  <div className={classes.stats}>
                    <a className={classes.a}
                      onClick={e => {
                        e.preventDefault();
                        handleRedirectActas()
                      }}
                    >
                      Crear nueva acta
                    </a>
                  </div>
                </CardFooter>
                : null
            }
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card chart={true}>
            <CardHeader color="success">
              <ChartistGraph
                className="ct-chart"
                data={{ labels: dataBaseLineChart.data.labels, series: [avancesChart] }}
                type="Line"
                options={{ ...dataBaseLineChart.options }}
              // listener={dataBaseLineChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Avances de asignatura registrados este año</h4>
              {
                MonthsArray.map((month: any, index) => <Chip
                  color={'primary'}
                  label={`${month} - ${avancesChart[index] ? avancesChart[index] : '0'}`}
                  key={index}
                />)
              }
            </CardBody>
            <CardFooter chart={true}>
              <div className={classes.stats}>
                <a className={classes.a}
                  onClick={e => {
                    e.preventDefault();
                    props.history.push('/admin/avancesAsignatura', { openModalCreate: true })
                  }}
                >
                  Registrar nuevo avance
                </a>
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card chart={true}>
            <CardHeader color="success">
              <ChartistGraph
                className="ct-chart"
                data={{ labels: dataBaseBarChart.data.labels, series: [homologacionesChart] }}
                type="Bar"
                options={{ ...dataBaseBarChart.options }}
              // responsiveOptions={dataBaseBarChart.responsiveOptions}
              // listener={dataBaseBarChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Homologaciones registradas este año</h4>
              {
                MonthsArray.map((month: any, index) => <Chip
                  color={'primary'}
                  label={`${month} - ${homologacionesChart[index] ? homologacionesChart[index] : '0'}`}
                  key={index}
                />)
              }
            </CardBody>
            <CardFooter chart={true}>
              <div className={classes.stats}>
                <a className={classes.a}
                  onClick={e => {
                    e.preventDefault();
                    props.history.push('/admin/homologacion', { openModalCreate: true })
                  }}
                >
                  Registrar nueva homologación
                </a>
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <ModalLoading showModal={openModalLoading} />
    </div>
  );
}

// Dashboard.propTypes = {
//   classes: PropTypes.object.isRequired
// };

export default withStyles(dashboardStyle)(Dashboard);
