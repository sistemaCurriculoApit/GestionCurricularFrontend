import React, { useEffect, useState } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { Select } from '../../../../components';

type YearPeriodPickerProps = {
  onChange: (year: string, period: string) => void,
  getPeriods: (signal?: AbortSignal) => Promise<string[]>,
  setLoading?: (loading: boolean) => void,
  width?: number,
};

export const YearPeriodPicker: React.FC<YearPeriodPickerProps> = ({
  onChange,
  getPeriods,
  setLoading = () => { },
  width = 150
}) => {
  const [yearPeriod, setYearPeriod] = useState<string>('');
  const [periods, setPeriods] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    const controller: AbortController = new AbortController();
    const signal: AbortSignal = controller.signal;

    getPeriods(signal).then((_periods) => {
      setPeriods(_periods);
      setLoading(false);
    });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const [year, period] = !yearPeriod ? [] : yearPeriod.split('-').map((val: string) => val.trim());
    onChange(year, period);
  }, [yearPeriod]);

  useEffect(() => {
    if (periods && periods.length) {
      setYearPeriod(periods[0]);
    }
  }, [periods]);

  return (
    <>
      <Select
        name="year-period-select"
        label="Año - Periodo"
        onChange={(e: SelectChangeEvent<string>) => setYearPeriod(e.target.value)}
        value={yearPeriod}
        options={periods}
        xs={{ minWidth: width }}
      />
    </>
  );
};
