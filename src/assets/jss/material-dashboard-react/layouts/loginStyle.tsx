import {
  drawerWidth,
  transition
} from '../../material-dashboard-react';
import { createStyles, Theme } from '@material-ui/core';

const appStyle = (theme: Theme) => createStyles({
  wrapper: {
    position: 'relative',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    top: '0',
    height: '100vh'
  },
  wrapperFilter: {
    position: 'relative',
    top: '0',
    height: '100vh',
    backgroundColor: '#00000036'
  },
  content: {
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    padding: '0px 15px',
    minHeight: 'calc(80vh - 60px)',
  },
  container: {
    paddingRight: '15px',
    paddingLeft: '15px',
    width:'35em' 
  },
  map: {
    marginTop: '70px'
  }
});

export default appStyle;
