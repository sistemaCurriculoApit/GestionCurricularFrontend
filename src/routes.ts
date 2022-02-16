// @material-ui/icons
import Dashboard from '@material-ui/icons/Dashboard';
import Assignment from '@material-ui/icons/Assignment';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import HourglassEmpty from '@material-ui/icons/HourglassEmpty';
import Description from '@material-ui/icons/Description';
import Assessment from '@material-ui/icons/Assessment';
import SupervisorAccount from '@material-ui/icons/SupervisorAccount';
import School from '@material-ui/icons/School';
import AccountCircle from '@material-ui/icons/AccountCircle';
import AssignmentInd from '@material-ui/icons/AssignmentInd';
import Web from '@material-ui/icons/Web';
import Person from '@material-ui/icons/Person';
import BubbleChart from '@material-ui/icons/BubbleChart';
import LocationOn from '@material-ui/icons/LocationOn';
import Notifications from '@material-ui/icons/Notifications';
import Unarchive from '@material-ui/icons/Unarchive';
import Language from '@material-ui/icons/Language';
// core components/views for Admin layout
import Login from './views/Login/Login';
import DashboardPage from './views/Dashboard/Dashboard';
import ContenidosPage from './views/Contenidos/Contenidos';
import AsignaturasPage from './views/Asignaturas/Asignaturas';
import AreasPage from './views/Areas/Areas';
import PlanesPage from './views/Planes/Planes';
import ProgramasPage from './views/Programas/Programas';
import ActasPage from './views/Actas/Actas';
import Usuarios from './views/Usuarios/Usuarios';
import Docentes from './views/Docentes/Docentes';
import Reportes from './views/Reportes/Reportes';
import Homologaciones from './views/Homologaciones/Homologaciones';
import AvancesAsignaturas from './views/AvancesAsignaturas/AvancesAsignaturas';
import Micrositios from './views/Micrositios/Micrositios';
import ManualUsuario from './views/ManualUsuario/ManualUsuario';
import UserProfile from './views/UserProfile/UserProfile';
import TableList from './views/TableList/TableList';
import Typography from './views/Typography/Typography';
import Icons from './views/Icons/Icons';
import Maps from './views/Maps/Maps';
import NotificationsPage from './views/Notifications/Notifications';
import Actas from './views/Actas/Actas';

const dashboardRoutes = [
  {
    path: '',
    name: 'Inicio de sesión',
    component: Login,
    layout: '/login'
  },

  //ACCESOS DE administrador
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: Dashboard,
    component: DashboardPage,
    layout: '/admin'
  },
  {
    path: '/curriculo',
    name: 'Currículo',
    icon: Assignment,
    layout: '/admin',
    subItems:[
      {
        path: '/curriculo/contenidos',
        name: 'Contenidos',
        icon: School,
        component: ContenidosPage,
        layout: '/admin'
      },
      {
        path: '/curriculo/asignaturas',
        name: 'Asignaturas',
        icon: School,
        component: AsignaturasPage,
        layout: '/admin'
      },
      {
        path: '/curriculo/areas',
        name: 'Áreas',
        icon: School,
        component: AreasPage,
        layout: '/admin'
      },
      {
        path: '/curriculo/planes',
        name: 'Planes',
        icon: School,
        component: PlanesPage,
        layout: '/admin'
      },
      {
        path: '/curriculo/programas',
        name: 'Programas',
        icon: School,
        component: ProgramasPage,
        layout: '/admin'
      },
    ]
  },
  {
    path: '/homologacion',
    name: 'Homologación de asignaturas',
    icon: LibraryBooks,
    component: Homologaciones,
    layout: '/admin'
  },
  {
    path: '/avancesAsignatura',
    name: 'Avances de asignaturas',
    icon: HourglassEmpty,
    component: AvancesAsignaturas,
    layout: '/admin'
  },
  {
    path: '/actas',
    name: 'Actas',
    icon: Description,
    component: ActasPage,
    layout: '/admin'
  },
  {
    path: '/reportes',
    name: 'Reportes',
    icon: Assessment,
    component: Reportes,
    layout: '/admin'
  },
  {
    path: '/micrositio',
    name: 'Micrositio',
    icon: Web,
    component: Micrositios,
    layout: '/admin'
  },
  {
    path: '/administracion',
    name: 'Administración',
    icon: SupervisorAccount,
    layout: '/admin',
    subItems:[
      {
        path: '/administracion/usuarios',
        name: 'Usuarios',
        icon: AccountCircle,
        component: Usuarios,
        layout: '/admin'
      },
      {
        path: '/administracion/docentes',
        name: 'Docentes',
        icon: AssignmentInd,
        component: Docentes,
        layout: '/admin'
      },
    ]
  },
  {
    path: '/Manual',
    name: 'Manual de usuario',
    icon: Web,
    component: ManualUsuario,
    layout: '/admin'
  },


  //ACCESOS DE  COORDINADOR
  {
    path: '/curriculo',
    name: 'Currículo',
    icon: Assignment,
    layout: '/coordinador',
    subItems:[
      {
        path: '/curriculo/contenidos',
        name: 'Contenidos',
        icon: School,
        component: ContenidosPage,
        layout: '/admin'
      },
      {
        path: '/curriculo/asignaturas',
        name: 'Asignaturas',
        icon: School,
        component: AsignaturasPage,
        layout: '/admin'
      },
      {
        path: '/curriculo/areas',
        name: 'Áreas',
        icon: School,
        component: AreasPage,
        layout: '/admin'
      },
      {
        path: '/curriculo/planes',
        name: 'Planes',
        icon: School,
        component: PlanesPage,
        layout: '/admin'
      },
      {
        path: '/curriculo/programas',
        name: 'Programas',
        icon: School,
        component: ProgramasPage,
        layout: '/admin'
      },
    ]
  },
  {
    path: '/homologacion',
    name: 'Homologación de asignaturas',
    icon: LibraryBooks,
    component: Homologaciones,
    layout: '/coordinador'
  },
  {
    path: '/avancesAsignatura',
    name: 'Avances de asignaturas',
    icon: HourglassEmpty,
    component: AvancesAsignaturas,
    layout: '/coordinador'
  },
  {
    path: '/actas',
    name: 'Actas',
    icon: Description,
    component: Actas,
    layout: '/coordinador'
  },
  {
    path: '/reportes',
    name: 'Reportes',
    icon: Assessment,
    component: Reportes,
    layout: '/coordinador'
  },
  {
    path: '/micrositio',
    name: 'Micrositio',
    icon: Web,
    component: Micrositios,
    layout: '/coordinador'
  },
  {
    path: '/Manual',
    name: 'Manual de usuario',
    icon: Web,
    component: ManualUsuario,
    layout: '/coordinador'
  },

  //ACCESOS DE  DOCENTE
  {
    path: '/actas',
    name: 'Actas',
    icon: Description,
    component: Actas,
    layout: '/docente'
  },
  {
    path: '/reportes',
    name: 'Reportes',
    icon: Assessment,
    component: Reportes,
    layout: '/docente'
  },
  {
    path: '/micrositio',
    name: 'Micrositio',
    icon: Web,
    component: Micrositios,
    layout: '/docente'
  },
  {
    path: '/Manual',
    name: 'Manual de usuario',
    icon: Web,
    component: ManualUsuario,
    layout: '/docente'
  },
  
  //ACCESOS DE INVITADO
  {
    path: '/micrositio',
    name: 'Micrositio',
    icon: Web,
    component: Micrositios,
    layout: '/invitado'
  },
  {
    path: '/Manual',
    name: 'Manual de usuario',
    icon: Web,
    component: ManualUsuario,
    layout: '/invitado'
  }
];

export default dashboardRoutes;
