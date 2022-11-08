import React, { useMemo } from 'react';
import { Advancement } from '../../../../models';
import { parseAdvancement } from '../../Util/Util';
import { ReportTable } from '../ReportTable/ReportTable';

type AdvacementReportTableProps = {
  classes: any,
  advancements: Advancement[],
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
  const _advancements = useMemo(() => advancements.map(parseAdvancement), [advancements])

  return (
    <ReportTable
      classes={classes}
      data={_advancements}
      onChangePage={onChangePage}
      page={page}
      totalPages={totalPages}
      message="No se encontraron avances en la base de datos"
      headers={[
        'Asignatura',
        'Porcentaje de avance',
        'Descripción',
        'Fecha de creación',
        'Fecha ultima actualización'
      ]}
    />
  );
};
