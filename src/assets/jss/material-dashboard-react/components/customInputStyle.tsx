import {
  primaryColor,
  dangerColor,
  successColor,
  grayColor,
  defaultFont
} from '../../material-dashboard-react';

import { createStyles } from '@material-ui/core';

const customInputStyle = createStyles({
  disabled: {
    '&:before': {
      backgroundColor: 'transparent !important'
    }
  },
  underline: {
    '&:hover:not($disabled):before,&:before': {
      borderColor: grayColor[4] + ' !important',
      borderWidth: '1px !important'
    },
    '&:after': {
      borderColor: primaryColor[0]
    }
  },
  underlineError: {
    '&:after': {
      borderColor: dangerColor[0]
    }
  },
  underlineSuccess: {
    '&:after': {
      borderColor: successColor[0]
    }
  },
  labelRoot: {
    ...defaultFont,
    color: grayColor[3] + ' !important',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '1.42857'
  },
  labelRootError: {
    color: dangerColor[0]
  },
  labelRootSuccess: {
    color: successColor[0]
  },
  feedback: {
    position: 'absolute',
    top: '18px',
    right: '0',
    zIndex: 2,
    display: 'block',
    width: '24px',
    height: '24px',
    textAlign: 'center',
    pointerEvents: 'none'
  },
  marginTop: {
    marginTop: '16px'
  },
  formControl: {
    paddingBottom: '10px',
    margin: '27px 0 0 0',
    position: 'relative',
    verticalAlign: 'unset'
  }
});

export const CustomSearchTextField = createStyles({
  input: {
    margin: '0px 5px',
    '& label.Mui-focused': {
      color: '#fff',
    },
    '& label.MuiFormLabel-root': {
      color: '#fff',
    },
    '& .MuiInputBase-input': {
      color: '#fff',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#fff',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#fff',
      },
      '&:hover fieldset': {
        borderColor: '#fff',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#fff',
      },
    },
  }
});

export const CustomTextField = createStyles({
  input: {
    margin: '5px 5px',
    width:'100%',
    '& label.Mui-focused': {
      color: '#000',
    },
    '& label.MuiFormLabel-root': {
      color: '#000',
    },
    '& .MuiInputBase-input': {
      color: '#000',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#000',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#000',
      },
      '&:hover fieldset': {
        borderColor: '#000',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#000',
      },
    },
  }
});

export default customInputStyle;
