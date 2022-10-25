import { createStyles } from '@material-ui/core';

const cardTabletCustomStyle = createStyles({
  cardCategoryWhite: {
    '&,& a,& a:hover,& a:focus': {
      color: 'rgba(255,255,255,.62)',
      margin: '0',
      fontSize: '14px',
      marginTop: '0',
      marginBottom: '0'
    },
    '& a,& a:hover,& a:focus': {
      color: '#FFFFFF'
    }
  },
  cardTitleWhite: {
    color: '#FFFFFF',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: 500,
    fontFamily: '\'Roboto\', \'Helvetica\', \'Arial\', sans-serif',
    marginBottom: '3px',
    textDecoration: 'none',
    '& small': {
      color: '#777',
      fontSize: '65%',
      fontWeight: 400,
      lineHeight: 1
    }
  },
  cardTitleBlack: {
    color: '#000',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: 500,
    fontFamily: '\'Roboto\', \'Helvetica\', \'Arial\', sans-serif',
    marginBottom: '10px',
    textDecoration: 'none',
    '& small': {
      color: '#777',
      fontSize: '65%',
      fontWeight: 400,
      lineHeight: 1
    }
  },
  centerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardFilters: {
    paddingRight: '10px',
    paddingLeft: '10px',
    paddingTop: '10px',
    paddingBottom: '10px',
    marginRight: 'auto',
    marginLeft: 'auto',
    width: 'auto'
  },
  containerFooterCard: {
    marginTop: '5px',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  TitleFilterContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
  },
  buttonHeaderContainer: {
    margin: '0px 5px'
  },
  filterContainer: {
    display: 'flex',
    width: '100%',
    padding: '10px 10px',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default cardTabletCustomStyle;
