import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
// import PropTypes from 'prop-types';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import { createStyles } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  primaryColor,
  hexToRgb
} from '../../assets/jss/material-dashboard-react';

import Card from '../../components/Card/Card';



import headerStyle from '../../assets/jss/material-dashboard-react/components/headerStyle';
import { paginationSize } from '../../constants/generalConstants'



function ModalLoading({ ...props }: any) {
  const { classes, showModal } = props;

  // useEffect(() => {
  //   setTotalPages(totalData/paginationSize);
  // }, [totalData])


  return (
    <div className={classes.containerPagination}>
      <Modal
        open={showModal}
        className={classes.modalLoading}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={classes.centerContent}>
          <Card className={[classes.cardContainer]}>
            <CircularProgress size={70} />

          </Card>
        </div>
      </Modal>
    </div>
  );
}
const styles = createStyles({
  modalLoading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardContainer: {
    alignItems: 'center',
    width: 100,
    paddingRight: '15px',
    paddingLeft: '15px',
    paddingTop: '15px',
    paddingBottom: '15px',
    marginRight: 'auto',
    marginLeft: 'auto'
  },
  containerPagination: {
    padding: '10px',
  },
  centerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default withStyles(styles)(ModalLoading);
