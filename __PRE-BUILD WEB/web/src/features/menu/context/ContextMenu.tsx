import { useNuiEvent } from '../../../hooks/useNuiEvent';
import { Box, createStyles, Flex, Stack, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { ContextMenuProps } from '../../../typings';
import ContextButton from './components/ContextButton';
import { fetchNui } from '../../../utils/fetchNui';
import ReactMarkdown from 'react-markdown';
import HeaderButton from './components/HeaderButton';
import ScaleFade from '../../../transitions/ScaleFade';
import MarkdownComponents from '../../../config/MarkdownComponents';

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>('openContext', { id: id, back: true });
};

const useStyles = createStyles((theme) => ({
  container: {
    position: 'absolute',
    top: '15%',
    right: '25%',
    width: 320,
    height: 580,
    borderRadius: '8px',
  },

  header: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
    borderRadius: '8px',
  },

  titleContainer: {
    flex: '1 85%',
    background: '#072e00ff',
    borderRadius: 0,
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    padding: 6,
    transition: 'all 0.2s ease',

    // top-left
    '&::before, &::after, & .corner-bl, & .corner-br': {
      opacity: 0,
      transition: 'opacity 0.2s ease',
    },

    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: 18,
      height: 18,
      borderTop: '2px solid #5df542',
      borderLeft: '2px solid #5df542',
      pointerEvents: 'none',
    },

    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      width: 18,
      height: 18,
      borderTop: '2px solid #5df542',
      borderRight: '2px solid #5df542',
      pointerEvents: 'none',
    },

    '& .corner-bl': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: 18,
      height: 18,
      borderBottom: '2px solid #5df542',
      borderLeft: '2px solid #5df542',
      pointerEvents: 'none',
    },

    '& .corner-br': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 18,
      height: 18,
      borderBottom: '2px solid #5df542',
      borderRight: '2px solid #5df542',
      pointerEvents: 'none',
    },

    '&:hover::before, &:hover::after, &:hover .corner-bl, &:hover .corner-br': {
      opacity: 1,
    },
  },

  titleText: {
    color: '#ffffff',
    padding: 6,
    textAlign: 'center',
  },

  buttonsContainer: {
    height: 560,
    overflowY: 'scroll',
    borderRadius: 8,
  },

  buttonsFlexWrapper: {
    gap: 3,
  },
}));


const ContextMenu: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuProps>({
    title: '',
    options: { '': { description: '', metadata: [] } },
  });

  const closeContext = () => {
    if (contextMenu.canClose === false) return;
    setVisible(false);
    fetchNui('closeContext');
  };

  // Hides the context menu on ESC
  useEffect(() => {
    if (!visible) return;

    const keyHandler = (e: KeyboardEvent) => {
      if (['Escape'].includes(e.code)) closeContext();
    };

    window.addEventListener('keydown', keyHandler);

    return () => window.removeEventListener('keydown', keyHandler);
  }, [visible]);

  useNuiEvent('hideContext', () => setVisible(false));

  useNuiEvent<ContextMenuProps>('showContext', async (data) => {
    if (visible) {
      setVisible(false);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    setContextMenu(data);
    setVisible(true);
  });

  return (
    <Box className={classes.container}>
      <ScaleFade visible={visible}>
        <Flex className={classes.header}>
          {contextMenu.menu && (
            <HeaderButton icon="chevron-left" iconSize={16} handleClick={() => openMenu(contextMenu.menu)} />
          )}
          <Box className={classes.titleContainer}>
  <Text className={classes.titleText}>
    <ReactMarkdown components={MarkdownComponents}>{contextMenu.title}</ReactMarkdown>
  </Text>
  <span className="corner-bl" />
  <span className="corner-br" />
</Box>

          <HeaderButton icon="xmark" canClose={contextMenu.canClose} iconSize={18} handleClick={closeContext} />
        </Flex>
        <Box className={classes.buttonsContainer}>
          <Stack className={classes.buttonsFlexWrapper}>
            {Object.entries(contextMenu.options).map((option, index) => (
              <ContextButton option={option} key={`context-item-${index}`} />
            ))}
          </Stack>
        </Box>
      </ScaleFade>
    </Box>
  );
};

export default ContextMenu;
