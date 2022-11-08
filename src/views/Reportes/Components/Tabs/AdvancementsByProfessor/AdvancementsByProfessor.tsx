import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { AdvacementReportTable } from '../../AdvacementReportTable/AdvacementReportTable';
import { SearchButton } from '../../SearchButton/SearchButton';
import { getAllDocentes } from '../../../../../services/docentesServices';
import { AdvancementsResponse, getAdvancementsByProfessors, getAdvancementsPeriods, getAdvancementsProfessors } from '../../../../../services/avancesServices';
import { DownloadAdvancementReport } from '../../../../../services/excelService';
import { YearPeriodPicker } from '../../YearPeriodPicker/YearPeriodPicker';
import { TableDivider } from '../../TableDivider/TableDivider';
import { TabProps } from '../types';
import { parseAdvancementReport } from '../../../Util/Util';
import { Select } from '../../../../../components';
import { Advancement } from '../../../../../models';
import { FilterWrapper } from '../../../Util/FiltersWrapper';
import GridContainer from '../../../../../components/Grid/GridContainer';

type AdvancementsByProfessorTabProps = TabProps;
const FILE_SUFIX = 'por_docente';

export const AdvacementsByProfessorTab: React.FC<AdvancementsByProfessorTabProps> = ({
  classes,
  setAlert,
  setLoading,
  setReportData
}) => {
  const [advancementsCount, setAdvancementsCount] = useState<number>(0);
  const [selectedProfessorId, setSelectedProfessorId] = useState<string>('');
  const [advancements, setAdvancements] = useState<Advancement[]>([]);
  const [page, setPage] = useState<number>(1);
  const [professors, setProfessors] = useState<any[]>([]);
  const [advancementYear, setAdvancementYear] = useState<string>('');
  const [period, setPeriod] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    const getProfessors = async (): Promise<any[]> => {
      try {
        const response: any = await getAllDocentes({ search: '' });
        return response.docentes || [];
      } catch {
        return [];
      }
    };

    getProfessors().then((data: any[]) => { setProfessors(data); setLoading(false); });
  }, []);

  const handleAdvancementsByProfessor = useCallback(async (queryPage?: number, isReport?: boolean) => {
    if (!advancementYear || !period || !selectedProfessorId) {
      setAlert(['warning', 'Debe diligenciar todos los filtros']);
      return;
    }

    setLoading(true);

    try {
      const {
        advancements: _advancements,
        advancementsCount: _advancementsCount
       }: AdvancementsResponse = await getAdvancementsByProfessors(selectedProfessorId, {
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
  }, [advancementYear, period, selectedProfessorId]);

  const professorsIds: { [key: string]: any } = useMemo(() => (
    professors.reduce((acc, _subject: any) => ({
      ...acc,
      [_subject._id]: _subject
    }), {})), [professors])

  useEffect(() => {
    setProfessors([]);
    setSelectedProfessorId('');
    if (!advancementYear || !period) {
      return;
    }

    setLoading(true);

    const controller: AbortController = new AbortController();
    const signal: AbortSignal = controller.signal;

    getAdvancementsProfessors(advancementYear, period, signal).then((_professors: any[]) => {
      setProfessors(_professors);
      setSelectedProfessorId(_professors.length ? _professors[0]._id : null);
      setLoading(false);
    })

    return () => controller.abort();
  }, [advancementYear, period]);

  useEffect(() => {
    setReportData({
      dataCount: advancementsCount,
      reportFunc: (selectedPage: number) => handleAdvancementsByProfessor(selectedPage, true)
    });
  }, [advancementsCount, handleAdvancementsByProfessor]);

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
            name='professor-select'
            label='Docente'
            onChange={(e: SelectChangeEvent<string>) => setSelectedProfessorId(e.target.value)}
            value={selectedProfessorId}
            options={Object.keys(professorsIds)}
            display={(_professorId: string) => {
              const p = professorsIds[_professorId];
              return `${p.nombre} - ${p.documento}`;
            }}
            xs={{ minWidth: 300 }}
          />
        </FilterWrapper>
        <SearchButton onClick={() => {
          handleAdvancementsByProfessor();
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
          handleAdvancementsByProfessor(p);
        }}
      />
    </>
  );
};
