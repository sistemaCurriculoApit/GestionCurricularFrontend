import React, {useEffect,useState} from 'react';
import classNames from 'classnames';
// import PropTypes from 'prop-types';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import { createStyles } from '@material-ui/core';
import {
  primaryColor,
  hexToRgb
} from '../../assets/jss/material-dashboard-react';


import headerStyle from '../../assets/jss/material-dashboard-react/components/headerStyle';
import { paginationSize } from '../../constants/generalConstants'



function TablePagination({ ...props }: any) {
  const { classes, color, onChangePage, totalData, page } = props;

  const [totalPages, setTotalPages] = useState(0);

  
  useEffect(() => {
    if(totalData){
      setTotalPages(Math.ceil(totalData/paginationSize));
    }
  }, [totalData])


  const appBarClasses = classNames({
    [' ' + classes[color]]: color
  });

  return (
    <div className={classes.containerPagination}>
      <Pagination page={page} count={totalPages} variant={'outlined'} classes={{ ul: classes.ul }} onChange={(e,page: number)=>onChangePage(page-1)}
      />
    </div>
  );
}
const styles = createStyles({
  containerPagination: {
    padding: '10px',
  },
  ul: {
    "& .Mui-selected": {
      color: '#fff',
      backgroundColor: `rgba(${hexToRgb(primaryColor[0])})`
    }
  }
});

export default withStyles(styles)(TablePagination);
