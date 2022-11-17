import React, { useState } from 'react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Tooltip from '@material-ui/core/Tooltip';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AdminNavbarLinks from '../Navbars/AdminNavbarLinks';
import Button from '../../components/CustomButtons/Button';
import { Img } from './Img';

import image from '../../assets/img/sidebar-5.jpg';
import sidebarStyle from '../../assets/jss/material-dashboard-react/components/sidebarStyle';

interface PropsMenuItem {
  menuItem: any;
  keyMenuItem: any;
  classesItemMenu: any;
  color: any;
  location: any;
}

const MenuItemsBuild: React.FC<PropsMenuItem> = ({ menuItem, keyMenuItem, classesItemMenu, color, location }) => {

  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };

  // verifies if routeName is the one active (in browser input)
  function activeRoute(routeName: any) {
    return location.pathname.indexOf(routeName) > -1 ? true : false;
  }

  var activePro = ' ';
  var listItemClasses;
  listItemClasses = classNames({
    [' ' + classesItemMenu[color]]: activeRoute(menuItem.layout + menuItem.path)
  });
  const whiteFontClasses = classNames({
    [' ' + classesItemMenu.whiteFont]: activeRoute(menuItem.layout + menuItem.path)
  });

  return (
    <div>
      <NavLink
        to={!menuItem.subItems ? menuItem.layout + menuItem.path : '#'}
        className={activePro + classesItemMenu.item}
        activeClassName="active"
        key={keyMenuItem}
      >
        <ListItem button={true}
          className={classesItemMenu.itemLink + listItemClasses}
          onClick={() => handleClick()}>
          <menuItem.icon
            className={classNames(classesItemMenu.itemIcon, whiteFontClasses)}
          />
          <ListItemText
            primary={menuItem.name}
            className={classNames(classesItemMenu.itemText, whiteFontClasses)}
            disableTypography={true}
          />
          <ListItemSecondaryAction>
            {
              menuItem.subItems ?
                open ? <ExpandLess onClick={() => handleClick()} /> : <ExpandMore onClick={() => handleClick()} />
                : null
            }
          </ListItemSecondaryAction>
        </ListItem>
      </NavLink>

      {
        menuItem.subItems ? (
          <Collapse
            key={menuItem.path}
            in={open}
            timeout="auto"
            unmountOnExit={true}
          >
            {
              menuItem.subItems.map((subItemProps: any, key: any) => {
                const activeProLocal = ' ';
                // const listItemClasses;
                const liClasses = classNames({
                  [' ' + classesItemMenu[`${color}SubItem`]]: activeRoute(subItemProps.layout + subItemProps.path)
                });
                const wfClasses = classNames({
                  [' ' + classesItemMenu.whiteFont]: activeRoute(subItemProps.layout + subItemProps.path)
                });
                return (<NavLink
                  to={subItemProps.layout + subItemProps.path}
                  className={activeProLocal + classesItemMenu.item}
                  activeClassName="active"
                  key={key}
                >
                  <ListItem button={true} className={classesItemMenu.subitemLink + liClasses}>
                    <subItemProps.icon
                      className={classNames(classesItemMenu.subitemIcon, wfClasses)}
                    />
                    <ListItemText
                      primary={subItemProps.name}
                      className={classNames(classesItemMenu.itemText, wfClasses)}
                      disableTypography={true}
                    />
                  </ListItem>
                </NavLink>);

              })
            }

          </Collapse>
        )
          : null
      }

    </div>
  );
};

const Sidebar = ({ ...props }) => {

  const { classes, color, logo, logoText, routes, userName, userEmail } = props;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('idProfileLoggedUser');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    document.location.assign('/login');
  };

  var brand = (
    <div className={classes.logo}>
      <div className={classes.logoImage}>
        <img src={logo} alt="logo" className={classes.img} />
        <span className={classNames(classes.logoLink)}>
          {logoText}
        </span >
        <span className={classNames(classes.logoUserDataLink)}>
          {userName}
        </span>
        <span className={classNames(classes.logoUserDataLink)}>
          {userEmail}
        </span>
      </div>
      <Tooltip id="addTooltip" title="Cerrar sesión" placement="bottom" classes={{ tooltip: classes.tooltip }}>
        <div className={classes.centerContent}>
          <Button
            key={'filtersButton'}
            size={'sm'}
            color={'primary'}
            variant="outlined"
            round={true}
            justIcon={true}
            startIcon={<ExitToAppIcon />}
            onClick={() => { handleLogout(); }}
          >
          </Button>
        </div>
      </Tooltip>
    </div>
  );
  return (
    <div>
      <Hidden mdUp={true} implementation="css">
        <Drawer
          variant="temporary"
          anchor={'right'}
          open={props.open}
          classes={{
            paper: classNames(classes.drawerPaper, {
              [classes.drawerPaperRTL]: props.rtlActive
            })
          }}
          onClose={props.handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>
            {<AdminNavbarLinks />}
            <List className={classes.list}>
              {
                routes.map((prop: any, index: number) => {
                  return (
                    <MenuItemsBuild
                      key={index}
                      menuItem={prop}
                      keyMenuItem={index}
                      classesItemMenu={classes}
                      color={color}
                      location={props.location} />
                  );
                })
              }
            </List>
          </div>
          {image !== undefined ? (
            <div
              className={classes.background}
            // style={{ backgroundImage: 'url(' + image + ')' }}
            >
              <Img background={classes.background} />
            </div>
          ) : null}
        </Drawer>
      </Hidden>
      <Hidden smDown={true} implementation="css">
        <Drawer
          anchor={'left'}
          variant="permanent"
          open={true}
          classes={{
            paper: classNames(classes.drawerPaper, {
              [classes.drawerPaperRTL]: props.rtlActive
            })
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>
            <List className={classes.list}>
              {
                routes.map((prop: any, index: number) => {
                  return (
                    <MenuItemsBuild
                      key={index}
                      menuItem={prop}
                      keyMenuItem={index}
                      classesItemMenu={classes}
                      color={color}
                      location={props.location} />
                  );
                })
              }
            </List>
          </div>
          {image !== undefined ? (
            <div
              className={classes.background}
            >
              <Img background={classes.background} />
            </div>
          ) : null}
        </Drawer>
      </Hidden>
    </div>
  );
};

export default withStyles(sidebarStyle)(Sidebar);
