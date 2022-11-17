import React from 'react';
import Button from '../../../../components/CustomButtons/Button';
import GridItem from '../../../../components/Grid/GridItem';
import { Send } from '@material-ui/icons';

export const SearchButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <GridItem
    xs={12}
    sm={12}
    md={2} >
    <Button
      key={'filtersButton'}
      color={'primary'}
      round={true}
      variant="outlined"
      endIcon={<Send />}
      onClick={onClick}
    />
  </GridItem>
);
