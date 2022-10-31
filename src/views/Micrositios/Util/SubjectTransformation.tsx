import React from 'react';
import { Tooltip } from '@material-ui/core';
import { GetApp, Visibility } from '@material-ui/icons';
import Button from '../../../components/CustomButtons/Button';

type TransformSubjects = {
  subjects: any[],
  classes: any,
  subjectTypes: any[],
  onStateClick: (subject: any, subjectTypes: any[]) => void,
  onDownloadClick: (subject: any) => void
};

export const transformSubjects = ({
  subjects,
  classes,
  subjectTypes,
  onStateClick,
  onDownloadClick
}: TransformSubjects): any[] => (
  subjects.map((subject: any) => [
    subject.codigo,
    subject.nombre,
    subject.cantidadCredito,
    subject.intensidadHoraria,
    subject.semestre,
    subject.prerrequisitos,
    subject.correquisitos,
    <Tooltip
      key={subject._id}
      id="filterTooltip"
      title="Ver detalles de asignatura"
      placement="top"
      classes={{ tooltip: classes.tooltip }}
    >
      <div className={classes.buttonHeaderContainer}>
        <Button
          key={'filtersButton'}
          color={'primary'}
          size="sm"
          round={true}
          variant="outlined"
          justIcon={true}
          startIcon={<Visibility />}
          onClick={() => onStateClick(subject, subjectTypes)} />
      </div>
    </Tooltip>,
    <Tooltip
      key={subject._id}
      id="filterTooltip"
      title="Descargar formato asignatura"
      placement="top"
      classes={{ tooltip: classes.tooltip }}>
      <div
        className={classes.buttonHeaderContainer}>
        <Button
          key={'filtersButton'}
          color={'primary'}
          size="sm"
          round={true}
          variant="outlined"
          justIcon={true}
          startIcon={<GetApp />}
          onClick={() => onDownloadClick(subject)} />
      </div>
    </Tooltip>
  ])
);
