import React from 'react';
import { Box, createStyles, Text } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type { CircleProgressbarProps } from '../../typings';

const useStyles = createStyles(() => ({
  wrapper: {
    position: 'fixed',
    left: 0,
    right: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    bottom: '5%',
    width: '19%',
    zIndex: 5,
    fontFamily: '"Inter", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
    fontSize: '1.7vh',
    pointerEvents: 'none',
  },
  container: {
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6vh',
    userSelect: 'none',
  },
  labelsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: '1.7vh',
    lineHeight: '4vh',
    color: '#5df542',
    fontWeight: 900,
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.85), 0 0 8px rgba(0, 0, 0, 0.45)',
  },
  pct: {
    fontSize: '1.7vh',
    lineHeight: '4vh',
    color: '#5df542',
    fontWeight: 700,
    // neon + dark outline for contrast
    textShadow:
      '0 0 12px rgba(0, 0, 0, 0.56), 0 0 4px rgba(0, 0, 0, 0.64), 0 1px 2px rgba(0, 0, 0, 0.72)',
  },
  progressBarContainer: {
      background: `
  #072e00ff
`,
    backgroundBlendMode: 'overlay',
    height: '0.9vh',
    position: 'relative',
    display: 'block',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    backgroundColor: '#5df542',
    width: '0%',
    height: '0.9vh',
    borderRadius: 4,
    transition: 'width 0.3s',
    transitionTimingFunction: 'ease-out',
    // stronger green glow to match the % text
    boxShadow:
      '0 0 22px rgba(11, 239, 11, 0.95), 0 0 12px rgba(30, 239, 11, 0.85), 0 0 30px rgba(109, 255, 73, 0.85)',
    filter: 'drop-shadow(0 0 10px rgba(143, 255, 91, 0.82))',
  },
}));



const CircleProgressbar: React.FC = () => {
  const { classes } = useStyles();

  const [visible, setVisible] = React.useState(false);
  const [label, setLabel] = React.useState('');
  const [percent, setPercent] = React.useState(0);
  const [wasCancelled, setWasCancelled] = React.useState(false);

  const rafRef = React.useRef<number | null>(null);
  const startRef = React.useRef<number>(0);
  const durationRef = React.useRef<number>(0);

  const stopAnim = React.useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const finish = React.useCallback(() => {
    stopAnim();
    setVisible(false); // triggers onExitComplete (success)
  }, [stopAnim]);

  useNuiEvent('progressCancel', () => {
    setWasCancelled(true);
    stopAnim();
    setPercent(0);
    setVisible(false); // do NOT call progressComplete on cancel
  });

  useNuiEvent<CircleProgressbarProps>('circleProgress', (data) => {
    // Always place at the same bottom location as the regular bar
    setWasCancelled(false);
    setLabel(data.label || '');
    durationRef.current = data.duration || 0;
    setPercent(0);
    setVisible(true);

    stopAnim();
    startRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const total = Math.max(0, durationRef.current);
      const p = total > 0 ? Math.min(1, elapsed / total) : 1;
      setPercent(Math.round(p * 100));
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        finish();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  });

  const handleExitComplete = React.useCallback(() => {
    if (!wasCancelled) fetchNui('progressComplete');
  }, [wasCancelled]);

  React.useEffect(() => () => stopAnim(), [stopAnim]);

  return (
    <Box className={classes.wrapper}>
      <ScaleFade visible={visible} onExitComplete={handleExitComplete}>
        <Box className={classes.container}>
          <Box className={classes.labelsRow}>
            <Text className={classes.label}>{label || 'Working...'}</Text>
            <Text className={classes.pct}>{percent}%</Text>
          </Box>
          <Box className={classes.progressBarContainer}>
            <Box className={classes.progressBar} sx={{ width: `${percent}%` }} />
          </Box>
        </Box>
      </ScaleFade>
    </Box>
  );
};

export default CircleProgressbar;
