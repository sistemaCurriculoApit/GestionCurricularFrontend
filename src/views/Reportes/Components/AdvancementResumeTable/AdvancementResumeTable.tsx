import React, { useMemo } from 'react';
import { Advancement } from '../../../../models';
import { parseToResume } from '../../Util/Util';
import Table from '../../../../components/Table/Table';


type AdvacementResumeTableProps = {
  advancements: Advancement[],
};

export const AdvacementResumeTable: React.FC<AdvacementResumeTableProps> = ({
  advancements,
}) => {
  if (!advancements.length) {
    return <></>;
  }

  const _advancements = useMemo(() => parseToResume(advancements), [advancements]);

  if (advancements.length === _advancements.length) {
    return <></>;
  }

  return (
    <>
      <div style={{ width: '100%' }}>
        <br />
      </div>
      <h2>Resumen</h2>
      <Table
        tableHeaderColor="success"
        tableData={_advancements}
        tableHead={[
          'Asignatura',
          'Docente',
          'Porcentaje de avance'
        ]}
      />
    </>
  );
};
