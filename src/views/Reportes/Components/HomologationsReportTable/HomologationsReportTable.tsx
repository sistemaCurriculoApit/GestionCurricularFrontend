import React from 'react';
import Table from '../../../../components/Table/Table';
import TablePagination from '../../../../components/Pagination/TablePagination';

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
  totalPages,
}) => {
  if (!homologations.length) {
    return <h2 style={{ textAlign: 'center' }}>No se encontraron homologaciones en la base de datos</h2>;
  }

  return (
    <>
      <Table
        tableHeaderColor="success"
        tableHead={[
          'Identificacion del solicitante',
          'Nombre del solicitante',
          'Asignatura del solicitante',
          'Descripcion',
          'Fecha de creación',
          'Fecha ultima actualización',
        ]}
        tableData={homologations}
      />
      <div style={{ width: '100%' }}>
        <br />
      </div>
      <div className={classes.centerContent}>
        <br />
        <TablePagination
          page={page}
          onChangePage={onChangePage}
          totalData={totalPages}
        />
      </div>
    </>
  );
}