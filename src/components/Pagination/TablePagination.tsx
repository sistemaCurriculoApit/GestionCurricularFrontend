import React, { useEffect, useState } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Pagination from '@material-ui/lab/Pagination';
import { createStyles } from '@material-ui/core';
import {
  primaryColor,
  hexToRgb
} from '../../assets/jss/material-dashboard-react';

import { paginationSize } from '../../constants/generalConstants';

function TablePagination({ ...props }: any) {
  const { classes, onChangePage, totalData, page } = props;

  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (totalData) {
      setTotalPages(Math.ceil(totalData / paginationSize));
    }
  }, [totalData]);

  return (
    <div className={classes.containerPagination}>
      <Pagination
        page={page}
        count={totalPages}
        variant={'outlined'}
        classes={{ ul: classes.ul }}
        onChange={(e, pageNumber: number) => onChangePage(pageNumber - 1)}
      />
    </div>
  );
}
const styles = createStyles({
  containerPagination: {
    padding: '10px',
  },
  ul: {
    '& .Mui-selected': {
      color: '#fff',
      backgroundColor: `rgba(${hexToRgb(primaryColor[0])})`
    }
  }
});

export default withStyles(styles)(TablePagination);
