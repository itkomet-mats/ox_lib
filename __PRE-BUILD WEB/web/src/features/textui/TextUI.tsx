import React from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { Box, createStyles, Group } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import ScaleFade from '../../transitions/ScaleFade';
import remarkGfm from 'remark-gfm';
import type { TextUiPosition, TextUiProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';
import LibIcon from '../../components/LibIcon';

const BRAND = {
  primary: '#5df542',
} as const;

const CORNER = { size: 14, thickness: 2 } as const;

const useStyles = createStyles((theme, params: { position?: TextUiPosition }) => ({
  wrapper: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems:
      params.position === 'top-center'
        ? 'baseline'
        : params.position === 'bottom-center'
        ? 'flex-end'
        : 'center',
    justifyContent:
      params.position === 'right-center'
        ? 'flex-end'
        : params.position === 'left-center'
        ? 'flex-start'
        : 'center',
  },

  container: {
    position: 'relative',
    fontSize: 16,
    padding: 12,
    margin: 8,
    background: `
      #072e00ff
    `,
    backgroundBlendMode: 'overlay',
    border: '1px solid rgba(255, 248, 156, 0)',
    borderRadius: '8px',
    color: '#5df542',
    textShadow: '0 0 4px rgba(0, 0, 0, 0.7)',
    boxShadow: '0 10px 50px rgba(0, 0, 0, 0.3)',
  },

  // Always-visible green corners
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

const TextUI: React.FC = () => {
  const [data, setData] = React.useState<TextUiProps>({
    text: '',
    position: 'right-center',
  });
  const [visible, setVisible] = React.useState(false);
  const { classes, cx } = useStyles({ position: data.position });

  useNuiEvent<TextUiProps>('textUi', (data) => {
    if (!data.position) data.position = 'right-center';
    setData(data);
    setVisible(true);
  });

  useNuiEvent('textUiHide', () => setVisible(false));

  return (
    <Box className={classes.wrapper}>
      <ScaleFade visible={visible}>
        <Box style={data.style} className={classes.container}>
          {/* Always-visible ox_lib-style corners */}
          <span className={cx(classes.corner, classes.topLeft)} />
          <span className={cx(classes.corner, classes.topRight)} />
          <span className={cx(classes.corner, classes.bottomLeft)} />
          <span className={cx(classes.corner, classes.bottomRight)} />

          <Group spacing={12}>
            {data.icon && (
              <LibIcon
                icon={data.icon}
                fixedWidth
                size="lg"
                animation={data.iconAnimation}
                style={{
                  color: data.iconColor,
                  alignSelf:
                    !data.alignIcon || data.alignIcon === 'center' ? 'center' : 'start',
                }}
              />
            )}
            <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
              {data.text}
            </ReactMarkdown>
          </Group>
        </Box>
      </ScaleFade>
    </Box>
  );
};

export default TextUI;
