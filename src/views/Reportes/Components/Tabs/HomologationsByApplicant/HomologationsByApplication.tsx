import React, { useState, useEffect, useCallback } from 'react';
import GridContainer from '../../../../../components/Grid/GridContainer';
import GridItem from '../../../../../components/Grid/GridItem';
import { TextField } from '@material-ui/core';
import { SearchButton } from '../../SearchButton/SearchButton';
import { DowloadHomologationsReport } from '../../../../../services/excelService';
import { TableDivider } from '../../TableDivider/TableDivider';
import { HomologationsReportTable } from '../../HomologationsReportTable/HomologationsReportTable';
import { getHomologationsByApplicant, HomologationsResponse } from '../../../../../services/homologacionesServices';
import { TabProps } from '../types';
import { parseHomologation } from '../../../Util/Util';

type HomologationsByApplicantTabProps = TabProps;
const FILE_SUFIX = 'por_aplicante';

export const HomologationsByApplicantTab: React.FC<HomologationsByApplicantTabProps> = ({
  classes,
  setError,
  setLoading,
  setPeportData
}) => {
  const [homologationsCount, setHomologationsCount] = useState<number>(0);
  const [homologations, setHomologations] = useState<any[]>([]);
  const [applicantId, setApplicantId] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  const handleHomologationsByApplicant = useCallback(async (queryPage?: number, isReport?: boolean) => {
    if (!applicantId) {
      setError(['warning', 'Debe diligenciar todos los filtros']);
      setLoading(false);
      return;
    }
    try {

      const response: HomologationsResponse = await getHomologationsByApplicant(applicantId, { page: queryPage || 0 });

      if (!response || !response.homologations || !response.homologations.length) {
        setError(['warning', 'No se encontraron registros en la base de datos, por favor prueba con otros filtros']);
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

      const parsedHomologations = response.homologations.map(parseHomologation());

      setHomologations(parsedHomologations);
      setHomologationsCount(response.homologationsCount);

      setLoading(false);
      return;
    } catch {
      setError(['error', 'Error consultando homologaciones']);
      setLoading(false);
      return;
    }
  }, [applicantId]);

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
      reportFunc: (selectedPage: number) => handleHomologationsByApplicant(selectedPage, true)
    });
  }, [homologationsCount, handleHomologationsByApplicant]);

  return (
    <>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <TextField
            id="outlined-email"
            label="Identificación del solicitante"
            variant="outlined"
            margin="dense"
            type={'tel'}
            className={classes.CustomTextField}
            error={!applicantId}
            value={applicantId}
            onChange={(event) => {
              setApplicantId(event.target.value);
            }}
          />
        </GridItem>

        <SearchButton onClick={() => {
          setLoading(true);
          handleHomologationsByApplicant();
        }} />

        <TableDivider />

      </GridContainer>

      <HomologationsReportTable
        classes={classes}
        homologations={homologations}
        totalPages={homologationsCount}
        page={page}
        onChangePage={(p: any) => {
          setLoading(true);
          setPage(p + 1);
          handleHomologationsByApplicant(p);
        }}
      />
    </>
  );
};
