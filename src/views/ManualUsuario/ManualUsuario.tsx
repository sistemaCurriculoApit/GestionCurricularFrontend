import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import { createStyles } from '@material-ui/core';
import { frontendBaseUrl } from '../../services/constants';
import { userProfilesObject } from '../../constants/generalConstants';

const styles = createStyles({
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
    fontWeight: 300,
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
  cardBodyCustom: {
    height: '50em'
  }
});

function ManualUsuario(props: any) {
  const { classes } = props;

  const getManualUsuarioName = () => {
    const idProfile = localStorage.getItem('idProfileLoggedUser');
    const profile = Object.values(userProfilesObject).find(({ id }: any) => id.toString() === idProfile);
    const manualName = profile ? profile.title : 'Invitado';
    return `${frontendBaseUrl}/Manual_de_Usuario_Gestion_Curricular_${manualName}.pdf`;
  };

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="success">
            <h4 className={classes.cardTitleWhite}>Manual de usuario</h4>
          </CardHeader>
          <CardBody className={classes.cardBodyCustom} >
            <object data={getManualUsuarioName()} type="application/pdf" width="100%" height="100%">
            </object>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

export default withStyles(styles)(ManualUsuario);
