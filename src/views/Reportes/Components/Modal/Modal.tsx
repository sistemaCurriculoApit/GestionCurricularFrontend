import React, { useEffect, useState } from 'react';
import { Modal, Tooltip, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Close, Send } from '@material-ui/icons';
import GridItem from '../../../../components/Grid/GridItem';
import GridContainer from '../../../../components/Grid/GridContainer';
import Card from '../../../../components/Card/Card';
import CardHeader from '../../../../components/Card/CardHeader';
import Button from '../../../../components/CustomButtons/Button';

type ExportModalProps = {
  classes: any,
  paginationReport: any[],
  onDownloadClick: (page: any) => void;
};

type ModalHandler = {
  Modal: React.FC<ExportModalProps>,
  isModalOpen: boolean,
  setIsModalOpen: (open: boolean) => void
};

export const useExportModal = (): ModalHandler => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [pageReportSelected, setPageReportSelected] = useState<any>(null);

  useEffect(() => {
    if (!openModal) {
      setPageReportSelected(null);
    }
  }, [openModal]);

  return {
    isModalOpen: openModal,
    setIsModalOpen: setOpenModal,
    Modal: ({
      classes,
      paginationReport,
      onDownloadClick
    }) => (
      <Modal
        open={openModal}
        className={classes.modalForm}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={classes.centerContent}>
          <GridItem xs={12} sm={8} md={8} >
            <Card className={classes.container}>
              <CardHeader color="success">
                <div className={classes.TitleFilterContainer}>
                  <h4 className={classes.cardTitleWhite}>Descargar reporte</h4>
                  <div className={classes.headerActions}>
                    <Tooltip id="filterTooltip" title="Cerrar" placement="top" classes={{ tooltip: classes.tooltip }}>
                      <div className={classes.buttonHeaderContainer}>
                        <Button
                          key={'filtersButton'}
                          color={'primary'}
                          size="sm"
                          round={true}
                          variant="outlined"
                          justIcon={true}
                          startIcon={<Close />}
                          onClick={() => setOpenModal(false)}
                        />
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </CardHeader >

              <GridContainer>
                <GridItem xs={12} sm={12} md={12} >
                  <br />
                </GridItem>

                <GridItem xs={12} sm={12} md={12} >
                  <Autocomplete
                    id="tags-outlined"
                    options={paginationReport}
                    getOptionLabel={(option) => option && option.label ? option.label : ''}
                    disableClearable={true}
                    filterSelectedOptions={true}
                    onChange={(e, option) => setPageReportSelected(option || {})}
                    value={pageReportSelected}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        id="outlined-rol"
                        label="Rango de datos"
                        variant="outlined"
                        margin="dense"
                        className={classes.CustomTextField}
                      />
                    )}
                  />
                </GridItem>
              </GridContainer>

              <div className={classes.containerFooterModal} >
                <Button
                  key={'filtersButton'}
                  color={'primary'}
                  round={true}
                  variant="outlined"
                  endIcon={<Send />}
                  onClick={() => onDownloadClick(pageReportSelected)} >
                  {'Generar Reporte'}
                </Button>

              </div>

            </Card>
          </GridItem>
        </div>
      </Modal>
    )
  };
};
