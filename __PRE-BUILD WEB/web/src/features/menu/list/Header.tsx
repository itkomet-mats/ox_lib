import { Box, createStyles, Text } from '@mantine/core';
import React from 'react';

const BRAND = {
  primary: '#5df542',
} as const;

const CORNER = { size: 16, thickness: 2 } as const;

const useStyles = createStyles(() => ({
  container: {
    position: 'relative',
    textAlign: 'center',
    marginBottom: 10,
    background: '#072e00ff',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
    height: 60,
    width: 384,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
  },

  heading: {
    fontSize: 24,
    textTransform: 'uppercase',
    fontWeight: 500,
    color: '#5df542',
    letterSpacing: 1,
  },

  // Corner elements (always visible)
  corner: {
    position: 'absolute',
    width: CORNER.size,
    height: CORNER.size,
    pointerEvents: 'none',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTop: `${CORNER.thickness}px solid ${BRAND.primary}`,
    borderLeft: `${CORNER.thickness}px solid ${BRAND.primary}`,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTop: `${CORNER.thickness}px solid ${BRAND.primary}`,
    borderRight: `${CORNER.thickness}px solid ${BRAND.primary}`,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottom: `${CORNER.thickness}px solid ${BRAND.primary}`,
    borderLeft: `${CORNER.thickness}px solid ${BRAND.primary}`,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottom: `${CORNER.thickness}px solid ${BRAND.primary}`,
    borderRight: `${CORNER.thickness}px solid ${BRAND.primary}`,
  },
}));

const Header: React.FC<{ title: string }> = ({ title }) => {
  const { classes, cx } = useStyles();

  return (
    <Box className={classes.container}>
      {/* Permanent green corners */}
      <span className={cx(classes.corner, classes.topLeft)} />
      <span className={cx(classes.corner, classes.topRight)} />
      <span className={cx(classes.corner, classes.bottomLeft)} />
      <span className={cx(classes.corner, classes.bottomRight)} />

      <Text className={classes.heading}>{title}</Text>
    </Box>
  );
};

export default React.memo(Header);
