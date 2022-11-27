import React, { useState, useEffect, useCallback } from 'react';
import { TextField } from '@material-ui/core';
import { SearchButton } from '../../SearchButton/SearchButton';
import { DowloadHomologationsReport } from '../../../../../services/excelService';
import { TableDivider } from '../../TableDivider/TableDivider';
import { HomologationsReportTable } from '../../HomologationsReportTable/HomologationsReportTable';
import { getHomologationsByApplicant, HomologationsResponse } from '../../../../../services/homologacionesServices';
import { TabProps } from '../types';
import { parseHomologationReport } from '../../../Util/Util';
import { Homologation } from '../../../../../models';
import GridContainer from '../../../../../components/Grid/GridContainer';
import GridItem from '../../../../../components/Grid/GridItem';

type HomologationsByApplicantTabProps = TabProps;
const FILE_SUFIX = 'por_aplicante';

export const HomologationsByApplicantTab: React.FC<HomologationsByApplicantTabProps> = ({
  classes,
  setAlert,
  setLoading,
  setReportData
}) => {
  const [homologationsCount, setHomologationsCount] = useState<number>(0);
  const [homologations, setHomologations] = useState<Homologation[]>([]);
  const [applicantId, setApplicantId] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  const handleHomologationsByApplicant = useCallback(async (queryPage?: number, isReport?: boolean) => {
    if (!applicantId) {
      setAlert(['warning', 'Debe diligenciar todos los filtros']);
      return;
    }

    setLoading(true);

    try {
      const {
        homologations: _homologations,
        homologationsCount: _homologationsCount
      }: HomologationsResponse = await getHomologationsByApplicant(applicantId, { page: queryPage || 0 });

      if (!_homologations.length) {
        setAlert(['warning', 'No se encontraron registros en la base de datos, por favor prueba con otros filtros']);
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
      return;
    } catch {
      setAlert(['error', 'Error consultando homologaciones']);
      setLoading(false);
      return;
    }
  }, [applicantId]);

  useEffect(() => {
    setReportData({
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
          setPage(p + 1);
          handleHomologationsByApplicant(p);
        }}
      />
    </>
  );
};
