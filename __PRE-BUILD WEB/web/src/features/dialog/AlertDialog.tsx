import { Button, createStyles, Group, Modal, Stack, useMantineTheme } from '@mantine/core';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import { useLocales } from '../../providers/LocaleProvider';
import remarkGfm from 'remark-gfm';
import type { AlertProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';

// brand + backgrounds
const BRAND = {
primary: '#5df542',
  error: '#ff5a5aff',
  info: '#5df542',
} as const;

const BACKGROUNDS: Record<string, string> = {
  error: '#420000ff',
  success: '#2b2e00ff',
  info: '#072e00ff',
  default: '#072e00ff', // fallback
};

const CORNER = { size: 18, thickness: 2 } as const;

const useStyles = createStyles(() => ({
  modal: {
    width: 500,
    padding: 20,
    borderRadius: 0,
    color: '#ffffff',
    fontFamily: 'Roboto',
    boxShadow: '0 10px 50px rgba(0, 0, 0, 0.3)',
    position: 'relative',
    overflow: 'hidden',
  },

  title: {
    color: '#ffffff',
    fontWeight: 700,
    fontSize: 22,
  },

  body: {
    color: '#ffffff',
    fontWeight: 400,
    fontSize: 16,
  },

  // corners
  corner: {
    position: 'absolute',
    width: CORNER.size,
    height: CORNER.size,
    pointerEvents: 'none',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTop: `${CORNER.thickness}px solid`,
    borderLeft: `${CORNER.thickness}px solid`,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTop: `${CORNER.thickness}px solid`,
    borderRight: `${CORNER.thickness}px solid`,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottom: `${CORNER.thickness}px solid`,
    borderLeft: `${CORNER.thickness}px solid`,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottom: `${CORNER.thickness}px solid`,
    borderRight: `${CORNER.thickness}px solid`,
  },
}));

const AlertDialog: React.FC = () => {
  const { locale } = useLocales();
  const { classes, cx } = useStyles();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [dialogData, setDialogData] = useState<AlertProps & { type?: 'error' | 'success' | 'info' | 'default' }>({
    header: '',
    content: '',
    type: 'default',
  });

  const closeAlert = (button: string) => {
    setOpened(false);
    fetchNui('closeAlert', button);
  };

  useNuiEvent('sendAlert', (data: AlertProps & { type?: 'error' | 'success' | 'info' | 'default' }) => {
    setDialogData(data);
    setOpened(true);
  });

  useNuiEvent('closeAlertDialog', () => setOpened(false));

  // background + corner color by type
  const bgColor = BACKGROUNDS[dialogData.type ?? 'default'];
  const cornerColor =
    dialogData.type === 'error'
      ? BRAND.error
      : dialogData.type === 'success'
      ? BRAND.primary
      : BRAND.info;

  return (
    <Modal
      opened={opened}
      centered={dialogData.centered}
      size={dialogData.size || 'md'}
      overflow={dialogData.overflow ? 'inside' : 'outside'}
      closeOnClickOutside={false}
      classNames={{
        modal: classes.modal,
        title: classes.title,
        body: classes.body,
      }}
      sx={{
        '.mantine-Modal-modal': {
          background: bgColor,
        },
      }}
      onClose={() => closeAlert('cancel')}
      withCloseButton={false}
      overlayOpacity={0.5}
      exitTransitionDuration={150}
      transition="fade"
      title={<ReactMarkdown components={MarkdownComponents}>{dialogData.header}</ReactMarkdown>}
    >
      {/* corner-only borders */}
      <span className={cx(classes.corner, classes.topLeft)} style={{ borderColor: cornerColor }} />
      <span className={cx(classes.corner, classes.topRight)} style={{ borderColor: cornerColor }} />
      <span className={cx(classes.corner, classes.bottomLeft)} style={{ borderColor: cornerColor }} />
      <span className={cx(classes.corner, classes.bottomRight)} style={{ borderColor: cornerColor }} />

      <Stack>
        <div style={{ color: '#ffffff', fontSize: 16, fontWeight: 400 }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              ...MarkdownComponents,
              img: ({ ...props }) => (
                <img style={{ maxWidth: '100%', maxHeight: '100%' }} {...props} />
              ),
            }}
          >
            {dialogData.content}
          </ReactMarkdown>
        </div>

        <Group position="right" spacing={10}>
          {dialogData.cancel && (
            <Button uppercase variant="default" onClick={() => closeAlert('cancel')} mr={3}>
              {dialogData.labels?.cancel || locale.ui.cancel}
            </Button>
          )}
          <Button
            uppercase
            variant={dialogData.cancel ? 'light' : 'default'}
            color={dialogData.cancel ? theme.primaryColor : undefined}
            onClick={() => closeAlert('confirm')}
          >
            {dialogData.labels?.confirm || locale.ui.confirm}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default AlertDialog;
