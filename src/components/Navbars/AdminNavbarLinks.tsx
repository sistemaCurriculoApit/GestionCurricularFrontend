import React from 'react';
import classNames from 'classnames';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Hidden from '@material-ui/core/Hidden';
import Poppers from '@material-ui/core/Popper';
// @material-ui/icons
import Person from '@material-ui/icons/Person';
import Notifications from '@material-ui/icons/Notifications';
import Dashboard from '@material-ui/icons/Dashboard';
import Search from '@material-ui/icons/Search';
// core components
import CustomInput from '../CustomInput/CustomInput';
import Button from '../CustomButtons/Button';

import headerLinksStyle from '../../assets/jss/material-dashboard-react/components/headerLinksStyle';

interface Props {
  classes: any;
}

class HeaderLinks extends React.Component<Props, {}> {

  anchorEl: any;

  state = {
    open: false
  };

  handleToggle = () => {
    this.setState({ open: !this.state.open });
  }

  handleClose = (event: any) => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ open: false });
  }

  render() {
    const { classes } = this.props;
    const { open } = this.state;
    return (
      <div>
      </div>
    );
  }
}

export default withStyles(headerLinksStyle)(HeaderLinks);
