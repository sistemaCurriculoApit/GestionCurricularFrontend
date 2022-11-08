import React, { useState } from 'react';
import { Modal, Tooltip } from '@material-ui/core';
import { Close, GetApp } from '@material-ui/icons';
import { ExpandibleTable } from '../ExpandibleTable/ExpandibleTable';
import { SubjectBasicInfo } from '../SubjectBasicInfo/SubjectBasicInfo';
import Button from '../../../../components/CustomButtons/Button';
import GridItem from '../../../../components/Grid/GridItem';
import GridContainer from '../../../../components/Grid/GridContainer';
import CardHeader from '../../../../components/Card/CardHeader';
import Card from '../../../../components/Card/Card';
import Table from '../../../../components/Table/Table';

type ContentProps = {
  classes: any;
  subject: any;
  subjectTypes: any[];
  subjectTypesSelected: any;
};

type SubjectModalProps = ContentProps & {
  downloadCourseFormat: (...params: any[]) => void;
  cleanSubject: () => void;
};

type useSubjectModalProps = {
  Modal: React.FC<SubjectModalProps>;
  setIsModalOpen: (open: boolean) => void;
};

const Content: React.FC<ContentProps> = ({ subject, classes, subjectTypes, subjectTypesSelected }) => {
  if (!subject._id) {
    return <h2 style={{ textAlign: 'center' }}>No se encontraron detalles de la asignatura</h2>;
  }

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <h4 className={classes.cardTitleBlack}>Información de asignatura</h4>
      </GridItem>

      <SubjectBasicInfo subject={subject} subjectTypesSelected={subjectTypesSelected} />

      <ExpandibleTable data={subject} />

      <GridItem xs={12} sm={12} md={12}>
        <h4 style={{ padding: '1rem 0' }} className={classes.cardTitleBlack}>Contenidos de asignatura</h4>
      </GridItem>

      <GridItem xs={12} sm={12} md={12}>
        <Table
          tableHeaderColor="success"
          tableHead={[
            'Código',
            'Nombre',
            'Descripción',
          ]}
          tableData={subject.contenido.map((contenido: any) => [
            contenido.codigo, contenido.nombre, contenido.descripcion
          ])}
        />
      </GridItem>

      <GridItem xs={12} sm={12} md={12} >
        <br />
      </GridItem>

      <GridItem xs={12} sm={12} md={12} >
        <hr />
      </GridItem>

      <GridItem xs={12} sm={12} md={12}>
        <h4 className={classes.cardTitleBlack}>Asignaturas equivalentes</h4>
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <Table
          tableHeaderColor="success"
          tableHead={[
            'Código de plan',
            'Código',
            'Nombre',
            'Creditos',
            'Intensidad Horaria'
          ]}
          tableData={subject.equivalencia.map(({ codigoPlan, asignatura }: any) => [
            codigoPlan, asignatura.codigo, asignatura.nombre, asignatura.cantidadCredito, asignatura.intensidadHoraria
          ])}
        />
      </GridItem>

      <GridItem xs={12} sm={12} md={12} >
        <br />
      </GridItem>

      <GridItem xs={12} sm={12} md={12} >
        <hr />
      </GridItem>

      <GridItem xs={12} sm={12} md={12}>
        <h4 className={classes.cardTitleBlack}>Información Docentes</h4>
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <Table
          tableHeaderColor="success"
          tableHead={[
            'Nombre',
            'Correo'
          ]}
          tableData={subject.docente.map((docente: any) => [
            docente.nombre, docente.correo
          ])}
        />
      </GridItem>

      <GridItem xs={12} sm={12} md={12} >
        <br />
      </GridItem>

    </GridContainer>
  );
};

export const useSubjectModal = (): useSubjectModalProps => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return {
    setIsModalOpen,
    Modal: ({
      classes,
      subject,
      subjectTypes,
      subjectTypesSelected,
      downloadCourseFormat,
      cleanSubject
    }) => {
      return (
        <Modal
          open={isModalOpen}
          className={classes.modalForm}
        >
          <div className={classes.centerContent}>
            <GridItem xs={12} sm={8} md={8} >
              <Card className={classes.container}>
                <CardHeader color="success">
                  <div className={classes.TitleFilterContainer}>
                    <div className={classes.headerActions}>
                      <Tooltip id="filterTooltip" title="Descargar formato de asignatura" placement="top" classes={{ tooltip: classes.tooltip }}>
                        <div>
                          <Button key={'filtersButton'} color={'secondary'} size="md" round={true} variant="outlined" justIcon={true} startIcon={<GetApp />}
                            onClick={() => { downloadCourseFormat(null, true); }} />
                        </div>
                      </Tooltip>
                    </div>
                    <h4 className={classes.cardTitleWhite}>Detalle de asignatura</h4>
                    <div className={classes.headerActions}>
                      <Tooltip id="filterTooltip" title="Cerrar" placement="top" classes={{ tooltip: classes.tooltip }}>
                        <div className={classes.buttonHeaderContainer}>
                          <Button key={'filtersButton'} color={'primary'} size="sm" round={true} variant="outlined" justIcon={true} startIcon={<Close />}
                            onClick={() => { cleanSubject(); }} />
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                </CardHeader >
                <div className={classes.containerFormModal} >
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12} >
                      <Content
                        classes={classes}
                        subject={subject}
                        subjectTypes={subjectTypes}
                        subjectTypesSelected={subjectTypesSelected}
                      />
                    </GridItem>
                  </GridContainer>
                </div>
              </Card>
            </GridItem>
          </div>
        </Modal>
      );
    }

  };
};
