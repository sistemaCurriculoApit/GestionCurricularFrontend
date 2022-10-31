import React from 'react';
import classNames from 'classnames';

import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';

import buttonStyle from '../../assets/jss/material-dashboard-react/components/buttonStyle';

function RegularButton({
  classes,
  color,
  round,
  children,
  disabled,
  simple,
  size,
  block,
  link,
  justIcon,
  fab,
  className,
  muiClasses,
  ...rest
}: any) {
  const btnClasses = classNames({
    [classes.button]: true,
    [classes[size]]: size,
    [classes[color]]: color,
    [classes.round]: round,
    [classes.disabled]: disabled,
    [classes.simple]: simple,
    [classes.block]: block,
    [classes.link]: link,
    [classes.justIcon]: justIcon,
    [classes.fab]: fab,
    [className]: className
  });
  return (
    <Button {...rest} classes={muiClasses} className={btnClasses}>
      {children}
    </Button>
  );
}

export default withStyles(buttonStyle)(RegularButton);
