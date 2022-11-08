import React, { useMemo } from 'react';
import { FormControl, InputLabel, MenuItem, Select as MaterialSelect, SelectChangeEvent } from '@mui/material';

type SelectProps = {
  name: string,
  label: string,
  value: string,
  options: string[],
  onChange?: ((event: SelectChangeEvent<string>, child: React.ReactNode) => void),
  display?: (option: string) => string,
  xs?: object,
}

export const Select: React.FC<SelectProps> = ({
  name,
  value,
  label,
  options,
  onChange,
  display = (item: string) => item,
  xs
}) => {
  const nameTag = useMemo(() => name.trim().split(' ').join(''), [name])

  return (
    <FormControl size="small" sx={{
      justifyContent: 'center',
      '& > label.MuiFormLabel-root': { top: '0.5rem' },
      ...xs
    }}>
      <InputLabel id={`${nameTag}-label`}>{label}</InputLabel>
      <MaterialSelect
        labelId={`${nameTag}-label`}
        id={nameTag}
        value={value}
        label={label}
        onChange={onChange}
      >
        {options.map((item: string, i: number) => (
          <MenuItem key={`${name}-option-${i}`} value={item}>{display(item)}</MenuItem>
        ))}
      </MaterialSelect>
    </ FormControl>
  )
}