import React, { useCallback, useEffect, useState } from 'react';
import { SearchButton } from '../../SearchButton/SearchButton';
import { DowloadHomologationsReport } from '../../../../../services/excelService';
import { TableDivider } from '../../TableDivider/TableDivider';
import { YearPeriodPicker } from '../../YearPeriodPicker/YearPeriodPicker';
import { HomologationsReportTable } from '../../HomologationsReportTable/HomologationsReportTable';
import { getHomologationsByPeriods, getHomologationsPeriods, HomologationsResponse } from '../../../../../services/homologacionesServices';
import { TabProps } from '../types';
import { parseHomologationReport } from '../../../Util/Util';
import { Homologation } from '../../../../../models';
import GridContainer from '../../../../../components/Grid/GridContainer';

type HomologationsByPeriodTabProps = TabProps;
const FILE_SUFIX = 'por_periodo';

export const HomologationsByPeriodTab: React.FC<HomologationsByPeriodTabProps> = ({
  classes,
  setAlert,
  setLoading,
  setReportData
}) => {
  const [homologationsCount, setHomologationsCount] = useState<number>(0);
  const [homologations, setHomologations] = useState<Homologation[]>([]);
  const [page, setPage] = useState<number>(1);
  const [homologationYear, setHomologationYear] = useState<string>('');
  const [period, setPeriod] = useState<string>('');

  const handleHomologationsByPeriod = useCallback(async (queryPage?: number, isReport?: boolean) => {
    if (!homologationYear || !period) {
      setAlert(['warning', 'Debe diligenciar todos los filtros']);
      setLoading(false);
      return;
    }

    try {
      const {
        homologations: _homologations,
        homologationsCount: _homologationsCount
      }: HomologationsResponse = await getHomologationsByPeriods(period, {
        page: queryPage || 0,
        homologationYear
      });

      if (!_homologations.length) {
        setAlert(['info', 'No se encontraron registros en la base de datos, por favor prueba con otros filtros']);
        setLoading(false);
        setHomologations([]);
        setHomologationsCount(0);
        return;
      }

      if (isReport) {
        await DowloadHomologationsReport(_homologations.map(parseHomologationReport), FILE_SUFIX);
        setLoading(false);
        return;
      }

      setHomologations(_homologations);
      setHomologationsCount(_homologationsCount);
      setLoading(false);
    } catch {
      setAlert(['error', 'Error consultando avances']);
      setLoading(false);
    }
  }, [homologationYear, period]);

  useEffect(() => {
    setReportData({
      dataCount: homologationsCount,
      reportFunc: (selectedPage: number) => handleHomologationsByPeriod(selectedPage, true)
    });
  }, [homologationsCount, handleHomologationsByPeriod]);

  return (
    <>
      <GridContainer>
        <YearPeriodPicker
          setLoading={setLoading}
          getPeriods={getHomologationsPeriods}
          onChange={(_year, _period) => { setHomologationYear(_year); setPeriod(_period); }}
          width={300}
        />

        <SearchButton onClick={() => {
          setLoading(true);
          handleHomologationsByPeriod();
        }} />

        <TableDivider />
      </GridContainer>

      <HomologationsReportTable
        classes={classes}
        homologations={homologations}
        totalPages={homologationsCount}
        page={page}
        onChangePage={(p: any) => {
          setLoading(false);
          setPage(p + 1);
          handleHomologationsByPeriod(p);
        }}
      />
    </>
  );
};
