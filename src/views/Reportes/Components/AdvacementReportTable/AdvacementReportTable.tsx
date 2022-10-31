import React from 'react';
import { ReportTable } from '../ReportTable/ReportTable';

type AdvacementReportTableProps = {
  classes: any,
  advancements: any[],
  onChangePage: (page: number) => void,
  page: number,
  totalPages: number
};

export const AdvacementReportTable: React.FC<AdvacementReportTableProps> = ({
  classes,
  advancements,
  onChangePage,
  page,
  totalPages
}) => {
  return (
    <ReportTable
      classes={classes}
      data={advancements}
      onChangePage={onChangePage}
      page={page}
      totalPages={totalPages}
      message="No se encontraron avances en la base de datos"
      headers={[
        'Año del avance',
        'Periodo',
        'Porcentaje de avance',
        'Descripción',
        'Fecha de creación',
        'Fecha ultima actualización'
      ]}
    />
  );
};
