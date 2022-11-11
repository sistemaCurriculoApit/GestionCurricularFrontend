import React from 'react';
import { Tooltip } from '@mui/material';
import { ProgressBar } from './ProgressBar';
import moment from 'moment';

export const parseHomologation = (homologation: any) => {
  const creationDate = moment(homologation.fechaCreacion);
  const updateDate = moment(homologation.fechaActualizacion);

  return [
    `${homologation.añoHomologacion.split('-')[0]} - ${homologation.periodo}`,
    homologation.identificacionSolicitante,
    homologation.nombreSolicitante,
    homologation.asignaturaSolicitante,
    homologation.descripcion,
    (<Tooltip title={creationDate.format('D/MM/YYYY, h:mm:ss a')}><span>{creationDate.fromNow()}</span></Tooltip>),
    (<Tooltip title={updateDate.format('D/MM/YYYY, h:mm:ss a')}><span>{updateDate.fromNow()}</span></Tooltip>),
  ];
};

export const parseHomologationReport = (añoHomologacion: any) => ({
  año: moment(añoHomologacion.añoHomologacion).format('YYYY'),
  periodo: añoHomologacion.periodo,
  identificacionSolicitante: añoHomologacion.identificacionSolicitante,
  nombreSolicitante: añoHomologacion.nombreSolicitante,
  asignaturaSolicitante: añoHomologacion.asignaturaSolicitante,
  descripcion: añoHomologacion.descripcion,
  fechaCreacion: moment(añoHomologacion.fechaCreacion).format('D/MM/YYYY, h:mm:ss a'),
  fechaActualizacion: moment(añoHomologacion.fechaActualizacion).format('D/MM/YYYY, h:mm:ss a'),
});

const getProfessorName = (professor: any) => professor ? professor.nombre : '-';

const parseAdvancementResume = (advancement: any) => [
  advancement.asignaturaId.nombre,
  getProfessorName(advancement.docenteId),
  advancement.porcentajeAvance
];

export const parseToResume = (advancements: any[]) => {
  const result = advancements
    .map(parseAdvancementResume)
    .reduce((acc: { [key: string]: number }, [subject, professor, value]) => {
      const key = `${subject},${professor}`;

      return { ...acc, [key]: value + (acc[key] || 0) }
    }, {});

  return Object
    .keys(result)
    .map((key) => {
      const [subject, professor] = key.split(',');

      return [
        subject,
        professor,
        <ProgressBar value={result[key]} />
      ]
    })
}

export const parseAdvancement = (advancement: any) => {
  const creationDate = moment(advancement.fechaCreacion);
  const updateDate = moment(advancement.fechaActualizacion);

  return [
    advancement.asignaturaId.nombre,
    getProfessorName(advancement.docenteId),
    <ProgressBar value={advancement.porcentajeAvance} />,
    advancement.descripcion,
    (<Tooltip title={creationDate.format('D/MM/YYYY, h:mm:ss a')}><span>{creationDate.fromNow()}</span></Tooltip>),
    (<Tooltip title={updateDate.format('D/MM/YYYY, h:mm:ss a')}><span>{updateDate.fromNow()}</span></Tooltip>)
  ];
};

export const parseAdvancementReport = (advancement: any) => ({
  asignatura: advancement.asignaturaId.nombre,
  añoAvance: moment(advancement.añoAvance).format('YYYY'),
  periodo: advancement.periodo,
  porcentajeAvance: advancement.porcentajeAvance,
  descripcion: advancement.descripcion,
  fechaCreacion: moment(advancement.fechaCreacion).format('D/MM/YYYY, h:mm:ss a'),
  fechaActualizacion: moment(advancement.fechaActualizacion).format('D/MM/YYYY, h:mm:ss a')
});
