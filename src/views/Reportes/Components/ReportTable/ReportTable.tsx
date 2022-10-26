import React from 'react';
import Table from '../../../../components/Table/Table';
import TablePagination from '../../../../components/Pagination/TablePagination';

type ReportTableProps = {
  classes: any,
  data: any[],
  onChangePage: (page: number) => void,
  page: number,
  totalPages: number,
  message: string,
  headers: string[]
};

export const ReportTable: React.FC<ReportTableProps> = ({
  classes,
  data,
  onChangePage,
  page,
  totalPages,
  message,
  headers
}) => {
  if (!data.length) {
    return <h2 style={{ textAlign: 'center' }}>{message}</h2>;
  }

  return (
    <>
      <Table
        tableHeaderColor="success"
        tableHead={headers}
        tableData={data}
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
};
