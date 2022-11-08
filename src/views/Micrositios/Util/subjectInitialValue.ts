import { Subject } from "../../../models";

export const subjectInitialValue: Subject = {
  _id: '',
  nombre: '',
  codigo: '',
  semestre: '',
  cantidadCredito: 1,
  asignaturaTipo: {},
  intensidadHorariaPractica: 0,
  intensidadHorariaTeorica: 0,
  intensidadHorariaIndependiente: 0,
  intensidadHoraria: 0,
  prerrequisitos: '',
  correquisitos: '',
  presentacionAsignatura: '',
  justificacionAsignatura: '',
  objetivoGeneral: '',
  objetivosEspecificos: '',
  competencias: '',
  mediosEducativos: '',
  evaluacion: '',
  bibliografia: '',
  cibergrafia: '',
  contenido: [],
  docente: [],
  equivalencia: []
}