import React from 'react';
import { Button, createStyles } from '@mantine/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  icon: IconProp;
  canClose?: boolean;
  iconSize: number;
  handleClick: () => void;
}

const BRAND = {
  primary: '#5df542',
} as const;

const useStyles = createStyles((theme, params: { canClose?: boolean }) => ({
  button: {
    flex: '1 15%',
    alignSelf: 'stretch',
    height: 'auto',
    textAlign: 'center',
    justifyContent: 'center',
    padding: 6,
    position: 'relative',
    background: '#072e00ff',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    borderRadius: 0,
    color: '#ffffff',
    transition: 'all 0.2s ease',

    // Corners hidden initially
    '&::before, &::after, & .corner-bl, & .corner-br': {
      opacity: 0,
      transition: 'opacity 0.2s ease',
    },

    // top-left
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: 10,
      height: 10,
      borderTop: `2px solid ${BRAND.primary}`,
      borderLeft: `2px solid ${BRAND.primary}`,
      pointerEvents: 'none',
    },

    // top-right
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      width: 10,
      height: 10,
      borderTop: `2px solid ${BRAND.primary}`,
      borderRight: `2px solid ${BRAND.primary}`,
      pointerEvents: 'none',
    },

    // bottom-left
    '& .corner-bl': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: 10,
      height: 10,
      borderBottom: `2px solid ${BRAND.primary}`,
      borderLeft: `2px solid ${BRAND.primary}`,
      pointerEvents: 'none',
    },

    // bottom-right
    '& .corner-br': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 10,
      height: 10,
      borderBottom: `2px solid ${BRAND.primary}`,
      borderRight: `2px solid ${BRAND.primary}`,
      pointerEvents: 'none',
    },

    '&:hover': {
      background: '#072e00ff',
      borderColor: BRAND.primary,
      cursor: params.canClose === false ? 'not-allowed' : 'pointer',
    },

    // Show corners only on hover
    '&:hover::before, &:hover::after, &:hover .corner-bl, &:hover .corner-br': {
      opacity: 1,
    },

    '&:active': {
      background: `${BRAND.primary}40`,
      borderColor: BRAND.primary,
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  root: {
    border: 'none',
    borderRadius: 0,
    background: 'transparent',
    boxShadow: 'none',
  },
  label: {
    color: '#ffffff',
    fontWeight: 600,
  },
}));

const HeaderButton: React.FC<Props> = ({ icon, canClose, iconSize, handleClick }) => {
  const { classes } = useStyles({ canClose });

  return (
    <Button
      variant="default"
      className={classes.button}
      classNames={{ label: classes.label, root: classes.root }}
      disabled={canClose === false}
      onClick={handleClick}
    >
      <LibIcon icon={icon} fontSize={iconSize} fixedWidth />
      {/* Corner spans */}
      <span className="corner-bl" />
      <span className="corner-br" />
    </Button>
  );
};

export default HeaderButton;
