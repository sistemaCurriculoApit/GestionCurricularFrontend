import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { AdvacementReportTable } from '../../AdvacementReportTable/AdvacementReportTable';
import { AdvacementResumeTable } from '../../AdvancementResumeTable/AdvancementResumeTable';
import { SearchButton } from '../../SearchButton/SearchButton';
import { AdvancementsResponse, getAdvancementsBySubject, getAdvancementsPeriods, getAdvancementsSubjects } from '../../../../../services/avancesServices';
import { DownloadAdvancementReport } from '../../../../../services/excelService';
import { TableDivider } from '../../TableDivider/TableDivider';
import { YearPeriodPicker } from '../../YearPeriodPicker/YearPeriodPicker';
import { TabProps } from '../types';
import { parseAdvancementReport } from '../../../Util/Util';
import { Advancement, Subject } from '../../../../../models';
import { Select, FilterWrapper } from '../../../../../components';
import GridContainer from '../../../../../components/Grid/GridContainer';

type AdvancementsBySubjectTabProps = TabProps;
const FILE_SUFIX = 'por_asignatura';

export const AdvancementsBySubjectTab: React.FC<AdvancementsBySubjectTabProps> = ({
  classes,
  setAlert,
  setLoading,
  setReportData
}) => {
  const [advancementsCount, setAdvancementsCount] = useState<number>(0);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [advancements, setAdvancements] = useState<Advancement[]>([]);
  const [page, setPage] = useState<number>(1);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [advancementYear, setAdvancementYear] = useState<string>('');
  const [period, setPeriod] = useState<string>('');

  const handleAdvancementsBySubject = useCallback(async (queryPage?: number, isReport?: boolean) => {
    if (!advancementYear || !period || !selectedSubjectId) {
      setAlert(['warning', 'Debe diligenciar todos los filtros']);
      return;
    }

    setLoading(true);

    try {
      const {
        advancements: _advancements,
        advancementsCount: _advancementsCount
      }: AdvancementsResponse = await getAdvancementsBySubject(selectedSubjectId, {
        page: queryPage || 0,
        advancementYear,
        period: parseInt(period, 10)
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
  }, [advancementYear, period, selectedSubjectId]);

  const subjectIds: { [key: string]: Subject } = useMemo(() => (
    subjects.reduce((acc, _subject: Subject) => ({
      ...acc,
      [_subject._id]: _subject
    }), {})), [subjects]);

  useEffect(() => {
    setSubjects([]);
    setSelectedSubjectId('');
    if (!advancementYear || !period) {
      return;
    }

    setLoading(true);

    const controller: AbortController = new AbortController();
    const signal: AbortSignal = controller.signal;

    getAdvancementsSubjects(advancementYear, period, signal).then((_subjects: Subject[]) => {
      setSubjects(_subjects);
      setSelectedSubjectId(_subjects.length ? _subjects[0]._id : '');
      setLoading(false);
    });

    return () => controller.abort();
  }, [advancementYear, period]);

  useEffect(() => {
    setReportData({
      dataCount: advancementsCount,
      reportFunc: (selectedPage: number) => handleAdvancementsBySubject(selectedPage, true)
    });
  }, [advancementsCount, handleAdvancementsBySubject]);

  return (
    <>
      <GridContainer>
        <FilterWrapper>
          <YearPeriodPicker
            setLoading={setLoading}
            getPeriods={getAdvancementsPeriods}
            onChange={(_year, _period) => { setAdvancementYear(_year); setPeriod(_period); }}
          />

          <Select
            name="subject-select"
            label="Asignatura"
            onChange={(e: SelectChangeEvent<string>) => setSelectedSubjectId(e.target.value)}
            value={selectedSubjectId}
            options={Object.keys(subjectIds)}
            display={(_subjectId: string) => {
              const s = subjectIds[_subjectId];
              return `${s.codigo} - ${s.nombre}`;
            }}
            xs={{ minWidth: 300 }}
          />
        </FilterWrapper>
        <SearchButton onClick={() => {
          handleAdvancementsBySubject();
        }} />

        <TableDivider />
      </GridContainer>

      <AdvacementReportTable
        classes={classes}
        advancements={advancements}
        totalPages={advancementsCount}
        page={page}
        onChangePage={(p: number) => {
          setPage(p + 1);
          handleAdvancementsBySubject(p);
        }}
      />

      <AdvacementResumeTable advancements={advancements} />
    </>
  );
};
