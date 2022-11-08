import React, { useCallback, useEffect, useState } from 'react';
import { AdvacementReportTable } from '../../AdvacementReportTable/AdvacementReportTable';
import { SearchButton } from '../../SearchButton/SearchButton';
import { AdvancementsResponse, getAdvancementsByPeriods, getAdvancementsPeriods } from '../../../../../services/avancesServices';
import { DownloadAdvancementReport } from '../../../../../services/excelService';
import { TableDivider } from '../../TableDivider/TableDivider';
import { YearPeriodPicker } from '../../YearPeriodPicker/YearPeriodPicker';
import { TabProps } from '../types';
import { parseAdvancementReport } from '../../../Util/Util';
import { Advancement } from '../../../../../models';
import GridContainer from '../../../../../components/Grid/GridContainer';

type AdvancementsByPeriodTabProps = TabProps;
const FILE_SUFIX = 'por_periodo';

export const AdvancementsByPeriodTab: React.FC<AdvancementsByPeriodTabProps> = ({
  classes,
  setAlert,
  setLoading,
  setReportData
}) => {
  const [advancementsCount, setAdvancementsCount] = useState<number>(0);
  const [advancements, setAdvancements] = useState<Advancement[]>([]);
  const [page, setPage] = useState<number>(1);
  const [advancementYear, setAdvancementYear] = useState<string>('');
  const [period, setPeriod] = useState<string>('');

  const handleAdvancementsByPeriod = useCallback(async (queryPage?: number, isReport?: boolean) => {
    if (!advancementYear || !period) {
      setAlert(['warning', 'Debe diligenciar todos los filtros']);
      return;
    }

    setLoading(true);

    try {
      const {
        advancements: _advancements,
        advancementsCount: _advancementsCount
      }: AdvancementsResponse = await getAdvancementsByPeriods(period, {
        page: queryPage || 0,
        advancementYear,
      });

      if (!_advancements.length) {
        setAlert(['info', 'No se encontraron registros en la base de datos, por favor prueba con otros filtros']);
        setLoading(false);
        setAdvancements([]);
        setAdvancementsCount(0);
        return;
      }

      if (isReport) {
        await DownloadAdvancementReport(_advancements.map(parseAdvancementReport), FILE_SUFIX);
        setLoading(false);
        return;
      }

      setAdvancements(_advancements);
      setAdvancementsCount(_advancementsCount);
      setLoading(false);
    } catch {
      setAlert(['error', 'Error consultando avances']);
      setLoading(false);
    }
  }, [advancementYear, period]);

  useEffect(() => {
    setReportData({
      dataCount: advancementsCount,
      reportFunc: (selectedPage: number) => handleAdvancementsByPeriod(selectedPage, true)
    });
  }, [advancementsCount, handleAdvancementsByPeriod]);

  return (
    <>
      <GridContainer>
        <YearPeriodPicker
          setLoading={setLoading}
          getPeriods={getAdvancementsPeriods}
          onChange={(_year, _period) => { setAdvancementYear(_year); setPeriod(_period); }}
          width={300}
        />

        <SearchButton onClick={() => {
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
          setPage(p + 1);
          handleAdvancementsByPeriod(p);
        }}
      />
    </>
  );
};
