import React, { useCallback, useEffect, useState } from 'react';
import GridContainer from '../../../../../components/Grid/GridContainer';
import { SearchButton } from '../../SearchButton/SearchButton';
import { DowloadHomologationsReport } from '../../../../../services/excelService';
import { TableDivider } from '../../TableDivider/TableDivider';
import { useYearPeriodPicker } from '../../YearPeriodPicker/YearPeriodPicker';
import { HomologationsReportTable } from '../../HomologationsReportTable/HomologationsReportTable';
import { getHomologationsByPeriods, HomologationsResponse } from '../../../../../services/homologacionesServices';
import { TabProps } from '../types';
import { parseHomologation } from '../../../Util/Util';

type HomologationsByPeriodTabProps = TabProps;
const FILE_SUFIX = 'por_periodo';

export const HomologationsByPeriodTab: React.FC<HomologationsByPeriodTabProps> = ({
  classes,
  setError,
  setLoading,
  setPeportData
}) => {
  const [homologationsCount, setHomologationsCount] = useState<number>(0);
  const [homologations, setHomologations] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const { year: homologationYear, period, YearPeriodPicker } = useYearPeriodPicker({
    classes,
    sizesYear: { xs: 12, sm: 12, md: 5 },
    sizesPeriod: { xs: 12, sm: 12, md: 5 }
  });

  const handleHomologationsByPeriod = useCallback(async (queryPage?: number, isReport?: boolean) => {
    if (!homologationYear || !period) {
      setError(['warning', 'Debe diligenciar todos los filtros']);
      setLoading(false);
      return;
    }

    try {
      const response: HomologationsResponse = await getHomologationsByPeriods(period, {
        page: queryPage || 0,
        homologationYear: homologationYear.year().toString(),
      });

      if (!response || !response.homologations || !response.homologations.length) {
        setError(['info', 'No se encontraron registros en la base de datos, por favor prueba con otros filtros']);
        setLoading(false);
        setHomologations([]);
        setHomologationsCount(0);
        return;
      }

      if (isReport) {
        const data = response.homologations.map(parseHomologation(true));

        await DowloadHomologationsReport(data, FILE_SUFIX);
        setLoading(false);
        return;
      }

      const parsedHomologaciones = response.homologations.map(parseHomologation());
      setHomologations(parsedHomologaciones);
      setHomologationsCount(response.homologationsCount);
      setLoading(false);
    } catch {
      setError(['error', 'Error consultando avances']);
      setLoading(false);
    }
  }, [homologationYear, period]);

  useEffect(() => {
    setPeportData({
      dataCount: 0,
      reportFunc: async () => { }
    });

    return () => {
      setPeportData({
        dataCount: 0,
        reportFunc: async () => { }
      });
    };
  }, []);

  useEffect(() => {
    setPeportData({
      dataCount: homologationsCount,
      reportFunc: (selectedPage: number) => handleHomologationsByPeriod(selectedPage, true)
    });
  }, [homologationsCount, handleHomologationsByPeriod]);

  return (
    <>
      <GridContainer>
        <YearPeriodPicker />

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
