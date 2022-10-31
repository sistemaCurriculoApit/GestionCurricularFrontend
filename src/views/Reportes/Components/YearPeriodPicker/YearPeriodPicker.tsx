import React, { useState } from 'react';
import moment, { Moment } from 'moment';
import MomentUtils from '@date-io/moment';
import GridItem from '../../../../components/Grid/GridItem';
import { Autocomplete } from '@material-ui/lab';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import { TextField } from '@material-ui/core';

type YearPeriodPickerProps = {
  classes: any,
  sizesYear: { xs: number, sm: number, md: number },
  sizesPeriod: { xs: number, sm: number, md: number }
};

type useYearPeriodPickerProps = (props: YearPeriodPickerProps) => {
  year: Moment,
  period: string,
  YearPeriodPicker: React.FC
};

export const useYearPeriodPicker: useYearPeriodPickerProps = ({
  classes,
  sizesYear: { xs: xsy, sm: smy, md: mdy },
  sizesPeriod: { xs: xsp, sm: smp, md: mdp }
}) => {
  const [advancementYear, setAdvancementYear] = useState<Moment>(moment(new Date()));
  const [period, setPeriod] = useState<string>('1');

  return {
    year: advancementYear,
    period,
    YearPeriodPicker: () => (
      <>
        <GridItem xs={xsy} sm={smy} md={mdy}>
          <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={'sw'} >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <DatePicker
                views={['year']}
                label="Año"
                inputVariant="outlined"
                margin="dense"
                className={classes.CustomTextField}
                format="YYYY"
                value={advancementYear}
                onChange={(newValue: any) => setAdvancementYear(moment(newValue || new Date()))}
                clearable={false}
                clearLabel="Limpiar"
              />
            </div>
          </MuiPickersUtilsProvider>
        </GridItem>

        <GridItem xs={xsp} sm={smp} md={mdp}>
          <Autocomplete
            id="tags-outlined"
            options={['1', '2']}
            getOptionLabel={(option) => option}
            disableClearable={true}
            filterSelectedOptions={true}
            onChange={(e, option) => setPeriod(option || '1')}
            value={period}
            renderInput={(params) => (
              <TextField
                {...params}
                id="outlined-estado-solicitud"
                label="Periodo"
                variant="outlined"
                margin="dense"
                className={classes.CustomTextField}
              />
            )}
          />
        </GridItem>
      </>
    )
  };
};
