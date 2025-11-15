import { Checkbox, createStyles } from '@mantine/core';
import React from 'react';

const useStyles = createStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: 20,
    height: 20,
    background: '#072e00ff',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    borderRadius: 4,
    transition: 'all 0.15s ease',

    '&:hover': {
      borderColor: '#5df542',
    },

    '&:checked': {
      backgroundColor: '#072e00ff',
      borderColor: '#5df542',
    },

    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },

    '&:focus-visible': {
      outline: 'none',
      boxShadow: '0 0 0 2px rgba(0,0,0,0.55), 0 0 0 4px #072e00ff',
    },
  },
  inner: {
    '> svg > path': {
      fill: '#2a2a2a', // dark checkmark against lime background
    },
  },
}));

const CustomCheckbox: React.FC<{ checked: boolean }> = ({ checked }) => {
  const { classes } = useStyles();

  return (
    <Checkbox
      checked={checked}
      size="md"
      radius="sm"
      classNames={{ root: classes.root, input: classes.input, inner: classes.inner }}
    />
  );
};

export default CustomCheckbox;
