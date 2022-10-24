import React, { useEffect, useState } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Alert from '@material-ui/lab/Alert';
import { createStyles } from '@material-ui/core';

function AlertComponent({ ...props }: any) {
  const {
    classes,
    severity = 'success',
    message = '',
    visible = false,
    timeout = 5000
  } = props;

  const [showAlert, setshowAlert] = useState(false);

  useEffect(() => {
    if (visible) {
      setshowAlert(true);
      setTimeout(() => {
        setshowAlert(false);
      }, timeout);
    }
  }, [visible]);

  return (
    <div className={classes.containerAlert}>
      {
        showAlert ? (
          <Alert severity={severity}>
            {message}
          </Alert>
        ) : null

      }
    </div>
  );
}

const styles = createStyles({
  containerAlert: {
    position: 'fixed',
    zIndex: 1301,
    top: 5,
    right: 20
  },
});

export default withStyles(styles)(AlertComponent);
