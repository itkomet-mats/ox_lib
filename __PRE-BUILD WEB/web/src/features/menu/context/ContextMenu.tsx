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
    // background: 'rgba(255, 255, 255, 0.15)',
    
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
    
    
  },
  titleContainer: {
    flex: '1 85%',
    background: 'rgba(255, 255, 255, 0.205)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    // borderRadius: '8px',
    backgroundImage: 'url(/src/blur.png)',
    backgroundRepeat: 'repeat',
    backgroundSize: 'auto',
    backgroundPosition: 'center',
    backgroundBlendMode: 'overlay',
    
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

  // button: {
  //   background: 'rgba(0, 0, 0, 0.3)',
  // },
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
