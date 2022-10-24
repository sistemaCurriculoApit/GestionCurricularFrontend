import React, { useCallback, useEffect, useState } from 'react';
import GridContainer from '../../../../../components/Grid/GridContainer';
import GridItem from '../../../../../components/Grid/GridItem';
import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { AdvacementReportTable } from '../../AdvacementReportTable/AdvacementReportTable';
import { SearchButton } from '../../SearchButton/SearchButton';
import { getAllDocentes } from '../../../../../services/docentesServices';
import { AdvancementsResponse, getAdvancementsByProfessors } from '../../../../../services/avancesServices';
import { DownloadAdvancementReport } from '../../../../../services/excelService';
import { useYearPeriodPicker } from '../../YearPeriodPicker/YearPeriodPicker';
import { TableDivider } from '../../TableDivider/TableDivider';
import { TabProps } from '../types';
import { parseAdvancement } from '../../../Util/Util';

type AdvancementsByProfessorTabProps = TabProps;
const FILE_SUFIX = 'por_docente';

export const AdvacementsByProfessorTab: React.FC<AdvancementsByProfessorTabProps> = ({
  classes,
  setError,
  setLoading,
  setPeportData
}) => {
  const [advancementsCount, setAdvancementsCount] = useState<number>(0);
  const [selectedProfessor, setSelectedProfessor] = useState<any>(null);
  const [advancements, setAdvancements] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [professors, setProfessors] = useState<any[]>([]);
  const { year: advancementYear, period, YearPeriodPicker } = useYearPeriodPicker({
    classes,
    sizesYear: { xs: 12, sm: 12, md: 4 },
    sizesPeriod: { xs: 12, sm: 12, md: 2 }
  });

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
    if (!advancementYear || !period || !selectedProfessor || !selectedProfessor._id) {
      setError(['warning', 'Debe diligenciar todos los filtros']);
      setLoading(false);
      return;
    }

    try {
      const response: AdvancementsResponse = await getAdvancementsByProfessors(selectedProfessor._id, {
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
  }, [advancementYear, period, selectedProfessor]);

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
      reportFunc: (selectedPage: number) => handleAdvancementsByProfessor(selectedPage, true)
    });
  }, [advancementsCount, handleAdvancementsByProfessor]);

  return (
    <>
      <GridContainer>
        <YearPeriodPicker />

        <GridItem xs={12} sm={12} md={4} >
          <Autocomplete
            id="tags-outlined"
            options={professors}
            getOptionLabel={(option) => option._id ? `${option.nombre} - ${option.documento}` : ''}
            disableClearable={true}
            filterSelectedOptions={true}
            onChange={(e, option) => setSelectedProfessor(option || null)}
            value={selectedProfessor}
            renderInput={(params) => (
              <TextField
                {...params}
                id="outlined-rol"
                label="Docente"
                variant="outlined"
                margin="dense"
                className={classes.CustomTextField}
              />
            )}
          />
        </GridItem>

        <SearchButton onClick={() => {
          setLoading(true);
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
          setLoading(true);
          setPage(p + 1);
          handleAdvancementsByProfessor(p);
        }}
      />
    </>
  );
};
