import moment from 'moment';

export const parseHomologation = (isReport?: boolean) => ({
  añoHomologacion,
  periodo,
  identificacionSolicitante,
  nombreSolicitante,
  asignaturaSolicitante,
  descripcion,
  fechaCreacion,
  fechaActualizacion
}: any) => isReport ? ({
  año: moment(añoHomologacion).format('YYYY'),
  periodo,
  identificacionSolicitante,
  nombreSolicitante,
  asignaturaSolicitante,
  descripcion,
  fechaCreacion: moment(fechaCreacion).format('D/MM/YYYY, h:mm:ss a'),
  fechaActualizacion: moment(fechaActualizacion).format('D/MM/YYYY, h:mm:ss a'),
}) : [
    identificacionSolicitante,
    nombreSolicitante,
    asignaturaSolicitante,
    descripcion,
    moment(fechaCreacion).format('D/MM/YYYY, h:mm:ss a'),
    moment(fechaActualizacion).format('D/MM/YYYY, h:mm:ss a'),
  ];

export const parseAdvancement = (isReport?: boolean) => ({
  añoAvance,
  porcentajeAvance,
  periodo,
  descripcion,
  fechaCreacion,
  fechaActualizacion
}: any) => isReport ? {
  añoAvance: moment(añoAvance).format('YYYY'),
  periodo,
  porcentajeAvance,
  descripcion,
  fechaCreacion: moment(fechaCreacion).format('D/MM/YYYY, h:mm:ss a'),
  fechaActualizacion: moment(fechaActualizacion).format('D/MM/YYYY, h:mm:ss a')
} : [
    moment(añoAvance).format('YYYY'),
    periodo,
    porcentajeAvance,
    descripcion,
    moment(fechaCreacion).format('D/MM/YYYY, h:mm:ss a'),
    moment(fechaActualizacion).format('D/MM/YYYY, h:mm:ss a')
  ];
