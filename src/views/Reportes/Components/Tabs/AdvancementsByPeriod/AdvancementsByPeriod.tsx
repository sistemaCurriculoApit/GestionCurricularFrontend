import React, { useCallback, useEffect, useState } from 'react';
import GridContainer from '../../../../../components/Grid/GridContainer';
import { AdvacementReportTable } from '../../AdvacementReportTable/AdvacementReportTable';
import { SearchButton } from '../../SearchButton/SearchButton';
import { AdvancementsResponse, getAdvancementsByPeriods } from '../../../../../services/avancesServices';
import { DownloadAdvancementReport } from '../../../../../services/excelService';
import { TableDivider } from '../../TableDivider/TableDivider';
import { useYearPeriodPicker } from '../../YearPeriodPicker/YearPeriodPicker';
import { TabProps } from '../types';
import { parseAdvancement } from '../../../Util/Util';

type AdvancementsByPeriodTabProps = TabProps;
const FILE_SUFIX = 'por_periodo';

export const AdvancementsByPeriodTab: React.FC<AdvancementsByPeriodTabProps> = ({
  classes,
  setError,
  setLoading,
  setPeportData
}) => {
  const [advancementsCount, setAdvancementsCount] = useState<number>(0);
  const [advancements, setAdvancements] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const { year: advancementYear, period, YearPeriodPicker } = useYearPeriodPicker({
    classes,
    sizesYear: { xs: 12, sm: 12, md: 5 },
    sizesPeriod: { xs: 12, sm: 12, md: 5 }
  });

  const handleAdvancementsByPeriod = useCallback(async (queryPage?: number, isReport?: boolean) => {
    if (!advancementYear || !period) {
      setError(['warning', 'Debe diligenciar todos los filtros']);
      setLoading(false);
      return;
    }

    try {
      const response: AdvancementsResponse = await getAdvancementsByPeriods(period, {
        page: queryPage || 0,
        advancementYear: advancementYear.year().toString(),
      });

      if (!response || !response.advancements || !response.advancements.length) {
        setError(['info', 'No se encontraron registros en la base de datos, por favor prueba con otros filtros']);
        setLoading(false);
        setAdvancements([]);
        setAdvancementsCount(0);
        return;
      }

      if (isReport) {
        const data = response.advancements.map(parseAdvancement(true));

        await DownloadAdvancementReport(data, FILE_SUFIX);
        setLoading(false);
        return;
      }

      const parsedAdvancements = response.advancements.map(parseAdvancement());
      setAdvancements(parsedAdvancements);
      setAdvancementsCount(response.advancementsCount);
      setLoading(false);
    } catch {
      setError(['error', 'Error consultando avances']);
      setLoading(false);
    }
  }, [advancementYear, period]);

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
      dataCount: advancementsCount,
      reportFunc: (selectedPage: number) => handleAdvancementsByPeriod(selectedPage, true)
    });
  }, [advancementsCount, handleAdvancementsByPeriod]);

  return (
    <>
      <GridContainer>
        <YearPeriodPicker />

        <SearchButton onClick={() => {
          setLoading(true);
          handleAdvancementsByPeriod();
        }} />

        <TableDivider />
      </GridContainer>

      <AdvacementReportTable
        classes={classes}
        advancements={advancements}
        totalPages={advancementsCount}
        page={page}
        onChangePage={(p: any) => {
          setLoading(true);
          setPage(p + 1);
          handleAdvancementsByPeriod(p);
        }}
      />
    </>
  );
};
