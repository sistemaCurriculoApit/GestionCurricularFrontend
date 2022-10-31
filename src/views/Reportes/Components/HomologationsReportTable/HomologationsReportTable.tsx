import React from 'react';
import Table from '../../../../components/Table/Table';
import TablePagination from '../../../../components/Pagination/TablePagination';
import { ReportTable } from '../ReportTable/ReportTable';

type HomologationsReportTableProps = {
  classes: any,
  homologations: any[],
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
  return (
    <ReportTable
      classes={classes}
      data={homologations}
      onChangePage={onChangePage}
      page={page}
      totalPages={totalPages}
      message='No se encontraron homologaciones en la base de datos'
      headers={[
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
