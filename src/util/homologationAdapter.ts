import { Homologation } from '../models';

export const homologationAdapter = (homologation: any): Homologation => ({
  programId: homologation.programaId,
  planId: homologation.planId,
  subjectId: homologation.asignaturaId,
  studentId: homologation.identificacionSolicitante,
  applicantName: homologation.nombreSolicitante,
  applicantCollege: homologation.universidadSolicitante,
  applicantProgram: homologation.programaSolicitante,
  applicantSubject: homologation.asignaturaSolicitante,
  homologationYear: homologation.añoHomologacion,
  period: homologation.periodo,
  homologationStatus: homologation.estadoHomologacion,
  desitionDate: homologation.fechaDecision,
  description: homologation.descripcion,
});