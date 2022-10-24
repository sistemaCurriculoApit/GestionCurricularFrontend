import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '../../../../components/CustomButtons/Button';
import { AttachFile } from '@material-ui/icons';

export const ReportButton: React.FC<any> = ({ classes, onClick }) => (
  <div className={classes.containerFloatButton}>
    <Tooltip id="addTooltip" title="Generar Reporte" placement="left" classes={{ tooltip: classes.tooltip }}>
      <div>
        <Button
          key={'searchButton'}
          color={'primary'}
          round={true}
          justIcon={true}
          startIcon={<AttachFile />}
          onClick={onClick} />
      </div>
    </Tooltip>
  </div>
);
