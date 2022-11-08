import React, { useMemo } from 'react';
import { Homologation } from '../../../../models';
import { parseHomologation } from '../../Util/Util';
import { ReportTable } from '../ReportTable/ReportTable';

type HomologationsReportTableProps = {
  classes: any,
  homologations: Homologation[],
  onChangePage: (page: number) => void,
  page: number,
  totalPages: number
};

export const HomologationsReportTable: React.FC<HomologationsReportTableProps> = ({
  classes,
  homologations,
  onChangePage,
  page,
  totalPages
}) => {
  const _homologations = useMemo(() => homologations.map(parseHomologation), [homologations])

  return (
    <ReportTable
      classes={classes}
      data={_homologations}
      onChangePage={onChangePage}
      page={page}
      totalPages={totalPages}
      message='No se encontraron homologaciones en la base de datos'
      headers={[
        'Semestre',
        'Identificacion del solicitante',
        'Nombre del solicitante',
        'Asignatura del solicitante',
        'Descripcion',
        'Fecha de creación',
        'Fecha ultima actualización',
      ]}
    />
  );
};
