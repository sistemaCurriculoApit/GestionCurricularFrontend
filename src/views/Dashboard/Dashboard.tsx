import React, { useEffect, useState } from 'react';
import ChartistGraph from 'react-chartist';
import withStyles from '@material-ui/core/styles/withStyles';
import Chip from '@material-ui/core/Chip';

import AccountCircle from '@material-ui/icons/AccountCircle';
import DescriptionIcon from '@material-ui/icons/Description';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';

import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardIcon from '../../components/Card/CardIcon';
import CardBody from '../../components/Card/CardBody';
import CardFooter from '../../components/Card/CardFooter';
import ModalLoading from '../../components/ModalLoading/ModalLoading';

import {
  dataBaseLineChart,
  dataBaseBarChart,
} from '../../variables/charts';

import dashboardStyle from '../../assets/jss/material-dashboard-react/views/dashboardStyle';
import { userProfilesObject } from '../../constants/generalConstants';

import { getDashboardData, getDashboardHomologacionesChart, getDashboardAvancesChart } from '../../services/dashboardServices';

// Constante de los meses del año para ser mostrados en las graficas
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
];

function Dashboard(props: any) {

  const { classes } = props;

  const [openModalLoading, setOpenModalLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalDocentes, setTotalDocentes] = useState(0);
  const [totalActas, setTotalActas] = useState(0);
  const [homologacionesChart, setHomologacionesChart] = useState<any>([]);
  const [avancesChart, setAvancesChart] = useState<any>([]);

  const idProfile = localStorage.getItem('idProfileLoggedUser');

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
  };

  useEffect(() => {
    setOpenModalLoading(true);
    getData();
  }, []);

  const handleRedirectActas = () => {
    if (idProfile) {
      switch (parseInt(idProfile, 10)) {
        case userProfilesObject.admin.id:
          props.history.push('/admin/actas', { openModalCreate: true });
    
          break;
        case userProfilesObject.coorProg.id:
          props.history.push('/coordinadorPrograma/actas', { openModalCreate: true });

          break;
        case userProfilesObject.coorArea.id:
          props.history.push('/coordinadorArea/actas', { openModalCreate: true });

          break;
        case userProfilesObject.doc.id:
          props.history.push('/docente/actas', { openModalCreate: true });

          break;
        default:
          break;

      }
    }
  };

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
              idProfile && parseInt(idProfile, 10) === userProfilesObject.admin.id ?
                <CardFooter stats={true}>
                  <div className={classes.stats}>
                    <a className={classes.a}
                      onClick={e => {
                        e.preventDefault();
                        props.history.push('/admin/administracion/usuarios', { openModalCreate: true });
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
              idProfile && parseInt(idProfile, 10) === userProfilesObject.admin.id ?
                <CardFooter stats={true}>
                  <div className={classes.stats}>
                    <a className={classes.a}
                      onClick={e => {
                        e.preventDefault();
                        props.history.push('/admin/administracion/docentes', { openModalCreate: true });
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
              idProfile && (parseInt(idProfile, 10) === userProfilesObject.admin.id ||
                parseInt(idProfile, 10) === userProfilesObject.coorProg.id ||
                parseInt(idProfile, 10) === userProfilesObject.coorArea.id ||
                parseInt(idProfile, 10) === userProfilesObject.doc.id)
                ?
                <CardFooter stats={true}>
                  <div className={classes.stats}>
                    <a className={classes.a}
                      onClick={e => {
                        e.preventDefault();
                        handleRedirectActas();
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
                    props.history.push('/admin/avancesAsignatura', { openModalCreate: true });
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
                    props.history.push('/admin/homologacion', { openModalCreate: true });
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
