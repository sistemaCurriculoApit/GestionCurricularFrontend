import React, { useCallback, useEffect, useState } from 'react';
import GridContainer from '../../../../../components/Grid/GridContainer';
import GridItem from '../../../../../components/Grid/GridItem';
import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { AdvacementReportTable } from '../../AdvacementReportTable/AdvacementReportTable';
import { SearchButton } from '../../SearchButton/SearchButton';
import { getAllAsignaturas } from '../../../../../services/asignaturasServices';
import { AdvancementsResponse, getAdvancementsBySubject } from '../../../../../services/avancesServices';
import { DownloadAdvancementReport } from '../../../../../services/excelService';
import { TableDivider } from '../../TableDivider/TableDivider';
import { useYearPeriodPicker } from '../../YearPeriodPicker/YearPeriodPicker';
import { TabProps } from '../types';
import { parseAdvancement } from '../../../Util/Util';

type AdvancementsBySubjectTabProps = TabProps;
const FILE_SUFIX = 'por_asignatura';

export const AdvancementsBySubjectTab: React.FC<AdvancementsBySubjectTabProps> = ({
  classes,
  setError,
  setLoading,
  setPeportData
}) => {
  const [advancementsCount, setAdvancementsCount] = useState<number>(0);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [advancements, setAdvancements] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [subjects, setSubjects] = useState<any[]>([]);
  const { year: advancementYear, period, YearPeriodPicker } = useYearPeriodPicker({
    classes,
    sizesYear: { xs: 12, sm: 12, md: 4 },
    sizesPeriod: { xs: 12, sm: 12, md: 2 }
  });

  useEffect(() => {
    setLoading(true);
    const getSubjects = async (): Promise<any[]> => {
      try {
        const response: any = await getAllAsignaturas({ search: '' });
        return response.asignaturas || [];
      } catch {
        return [];
      }
    };

    getSubjects().then((data: any[]) => { setSubjects(data); setLoading(false); });
  }, []);

  const handleAdvancementsBySubject = useCallback(async (queryPage?: number, isReport?: boolean) => {
    if (!advancementYear || !period || !selectedSubject || !selectedSubject._id) {
      setError(['warning', 'Debe diligenciar todos los filtros']);
      setLoading(false);
      return;
    }

    try {
      const response: AdvancementsResponse = await getAdvancementsBySubject(selectedSubject._id, {
        page: queryPage || 0,
        advancementYear: advancementYear.year().toString(),
        period: parseInt(period, 10)
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
  }, [advancementYear, period, selectedSubject]);

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
      reportFunc: (selectedPage: number) => handleAdvancementsBySubject(selectedPage, true)
    });
  }, [advancementsCount, handleAdvancementsBySubject]);

  return (
    <>
      <GridContainer>
        <YearPeriodPicker />

        <GridItem xs={12} sm={12} md={4} >
          <Autocomplete
            id="tags-outlined"
            options={subjects}
            getOptionLabel={(option) => `${option.codigo} - ${option.nombre}`}
            disableClearable={true}
            filterSelectedOptions={true}
            onChange={(_, option) => setSelectedSubject(option || null)}
            value={selectedSubject}
            renderInput={(params) => (
              <TextField
                {...params}
                id="outlined-rol"
                label="Asignatura"
                variant="outlined"
                margin="dense"
                className={classes.CustomTextField}
              />
            )}
          />
        </GridItem>

        <SearchButton onClick={() => {
          setLoading(true);
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
          setLoading(true);
          setPage(p + 1);
          handleAdvancementsBySubject(p);
        }}
      />
    </>
  );
};
