import React from 'react';
import { Subject } from '../../../../models';
import './SubjectBasicInfo.css';

type SubjectBasicInfoProps = {
  subject: Subject,
  subjectTypesSelected: any
};

export const SubjectBasicInfo: React.FC<SubjectBasicInfoProps> = ({ subject, subjectTypesSelected }) => (
  <div className='subject-basic-info-container'>
    <div className='basic-info-group'>
      <div><span>Código:</span> {subject.codigo}</div>
      <div><span>Nombre:</span> {subject.nombre}</div>
      <div><span>Tipo de asignatura:</span> {subjectTypesSelected.title}</div>
      <div><span>Prerrequisitos:</span> {subject.prerrequisitos}</div>
      <div><span>Correquisitos:</span> {subject.correquisitos}</div>
    </div>
    <div className='basic-info-group-values'>
        <div><span>Créditos:</span> {subject.cantidadCredito}</div>
        <div><span>Semestre:</span> {subject.semestre}</div>
        <div><span>Total Horas Semanales:</span> {subject.intensidadHoraria}</div>
        <div><span>Horas Trabajo Independiente:</span> {subject.intensidadHorariaIndependiente}</div>
        <div><span>Horas Trabajo Presencial Teorico:</span> {subject.intensidadHorariaTeorica}</div>
        <div><span>Horas Trabajo Presencial Practico:</span> {subject.intensidadHorariaPractica}</div>
    </div>
  </div>
);