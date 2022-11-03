import { Advancement } from '../models';

export const advancementAdapter = (advancement: any): Advancement => ({
  programId: advancement.programaId,
  planId: advancement.planId,
  areaId: advancement.areaId,
  subjectId: advancement.asignaturaId,
  professorId: advancement.docenteId,
  content: advancement.contenido,
  advancementYear: advancement.añoAvance,
  period: advancement.periodo,
  advancementPercentage: advancement.porcentajeAvance,
  description: advancement.descripcion,
});