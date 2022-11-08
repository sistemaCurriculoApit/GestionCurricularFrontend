import React from 'react';

import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse, IconButton, Typography } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import { Subject } from '../../../../models';

const subjectTitleMap: { [key: string]: { title: string, isList: boolean } } = {
  presentacionAsignatura: {
    title: 'Presentacion de la asignatura',
    isList: false,
  },
  justificacionAsignatura: {
    title: 'Justificacion',
    isList: false,
  },
  objetivoGeneral: {
    title: 'Objetivo General',
    isList: true,
  },
  objetivosEspecificos: {
    title: 'Objetivos Especificos',
    isList: true,
  },
  competencias: {
    title: 'Competencias a Desarrollar',
    isList: true,
  },
  mediosEducativos: {
    title: 'Medios Educativos',
    isList: false,
  },
  evaluacion: {
    title: 'Evaluacion',
    isList: false,
  },
  bibliografia: {
    title: 'Bibliografia',
    isList: false,
  },
  cibergrafia: {
    title: 'Cibergrafia',
    isList: false,
  }
};

const Row: React.FC<{ title: string, value: any, isList: boolean }> = ({ title, value, isList }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell sx={{ maxWidth: '20px' }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {title}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit={true}>
            <Box sx={{ margin: 1 }}>
              {isList ? (
              <ul>
                {value.split('•')
                .filter((item: string) => Boolean(item.length))
                .map((item: string) => (
                  <li>
                    {item.trim()}
                  </li>
                )) }
              </ul>
              ) : (<div>{value}</div>)}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export const ExpandibleTable: React.FC<{ data: Subject }> = ({ data }) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ maxWidth: '20px' }}/>
            <TableCell>Detalles de la asignatura</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(data).filter(([key]) => Boolean(subjectTitleMap[key]))
            .map(([key, value]) => (
              <Row key={key} value={value} title={subjectTitleMap[key].title} isList={subjectTitleMap[key].isList} />
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};