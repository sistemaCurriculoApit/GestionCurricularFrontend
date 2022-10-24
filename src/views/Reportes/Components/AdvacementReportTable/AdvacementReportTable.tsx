import React from 'react';
import Table from '../../../../components/Table/Table';
import TablePagination from '../../../../components/Pagination/TablePagination';

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
}) => {
  if (!advancements.length) {
    return <h2 style={{ textAlign: 'center' }}>No se encontraron avances en la base de datos</h2>;
  }

  return (
    <>
      <Table
        tableHeaderColor="success"
        tableHead={[
          'Año del avance',
          'Periodo',
          'Porcentaje de avance',
          'Descripción',
          'Fecha de creación',
          'Fecha ultima actualización'
        ]}
        tableData={advancements}
      />
      <div style={{ width: '100%' }}>
        <br />
      </div>
      <div className={classes.centerContent}>
        <br />
        <TablePagination
          page={page}
          onChangePage={onChangePage}
          totalData={advancements.length}
        />
      </div>
    </>
  );
}