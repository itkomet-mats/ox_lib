import React from 'react';
import {
  Button,
  createStyles,
  Group,
  HoverCard,
  Image,
  Progress,
  Stack,
  Text,
} from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import { ContextMenuProps, Option } from '../../../../typings';
import { fetchNui } from '../../../../utils/fetchNui';
import { isIconUrl } from '../../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import MarkdownComponents from '../../../../config/MarkdownComponents';
import LibIcon from '../../../../components/LibIcon';

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>('openContext', { id: id, back: false });
};

const clickContext = (id: string) => {
  fetchNui('clickContext', id);
};

const BRAND = {
  primary: '#5df542',
  error: '#ff5a5aff',
  info: '#5df542',
} as const;

const BACKGROUND = '#072e00ff';
const CORNER = { size: 14, thickness: 2 } as const;

const useStyles = createStyles((theme, params: { disabled?: boolean; readOnly?: boolean }) => ({
  inner: {
    justifyContent: 'flex-start',
  },
  label: {
    width: '100%',
    color: '#ffffff',
    whiteSpace: 'pre-wrap',
  },

  button: {
    position: 'relative',
    height: 'fit-content',
    width: '100%',
    background: '#072e00ff',
    border: `1px solid rgba(255,255,255,0.2)`,
    borderRadius: 0,
    color: '#ffffff',
    padding: 10,
    transition: 'all 0.2s ease',

    '&:hover': {
      background: '#072e00ff',
      // borderColor: BRAND.primary,
      cursor: params.readOnly ? 'unset' : 'pointer',
    },

    '&:active': {
      background: `${BRAND.primary}100`,
      // borderColor: BRAND.primary,
    },

    '&:disabled': {
      background: '#2a2a2a',
      borderColor: 'rgba(255,255,255,0.25)',
      opacity: 0.5,
      cursor: 'not-allowed',
    },

    // Hide corners initially
    '& .corner': {
      opacity: 0,
      transition: 'opacity 0.2s ease',
    },

    // Show corners on hover
    '&:hover .corner': {
      opacity: 1,
    },
  },

  // Corner elements
 corner: {
  position: 'absolute',
  width: CORNER.size,
  height: CORNER.size,
  pointerEvents: 'none',
  borderColor: BRAND.primary, // ✅ use variable, not string
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


  iconImage: {
    maxWidth: '25px',
    color: '#ffffff',
  },
  description: {
    color: '#cccccc',
    fontSize: 12,
  },
  dropdown: {
    padding: 10,
    color: '#ffffff',
    background: BACKGROUND,
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: 0,
    fontSize: 14,
    maxWidth: 256,
    width: 'fit-content',
  },
  buttonStack: {
    gap: 4,
    flex: '1',
  },
  buttonGroup: {
    gap: 4,
    flexWrap: 'nowrap',
  },
  buttonIconContainer: {
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTitleText: {
    overflowWrap: 'break-word',
    color: '#ffffff',
  },
  buttonArrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 25,
    height: 25,
  },
}));

const ContextButton: React.FC<{
  option: [string, Option];
}> = ({ option }) => {
  const button = option[1];
  const buttonKey = option[0];
  const { classes, cx } = useStyles({
    disabled: button.disabled,
    readOnly: button.readOnly,
  });

  return (
    <HoverCard
      position="right-start"
      disabled={button.disabled || !(button.metadata || button.image)}
      openDelay={200}
    >
      <HoverCard.Target>
        <Button
          classNames={{
            inner: classes.inner,
            label: classes.label,
            root: classes.button,
          }}
          onClick={() =>
            !button.disabled && !button.readOnly
              ? button.menu
                ? openMenu(button.menu)
                : clickContext(buttonKey)
              : null
          }
          variant="default"
          disabled={button.disabled}
        >
          {/* Hover corners */}
          <span className={cx(classes.corner, 'corner', classes.topLeft)} />
          <span className={cx(classes.corner, 'corner', classes.topRight)} />
          <span className={cx(classes.corner, 'corner', classes.bottomLeft)} />
          <span className={cx(classes.corner, 'corner', classes.bottomRight)} />

          <Group position="apart" w="100%" noWrap>
            <Stack className={classes.buttonStack}>
              {(button.title || Number.isNaN(+buttonKey)) && (
                <Group className={classes.buttonGroup}>
                  {button?.icon && (
                    <Stack className={classes.buttonIconContainer}>
                      {typeof button.icon === 'string' && isIconUrl(button.icon) ? (
                        <img
                          src={button.icon}
                          className={classes.iconImage}
                          alt="Missing img"
                        />
                      ) : (
                        <LibIcon
                          icon={button.icon as IconProp}
                          fixedWidth
                          size="lg"
                          style={{ color: button.iconColor }}
                          animation={button.iconAnimation}
                        />
                      )}
                    </Stack>
                  )}
                  <Text className={classes.buttonTitleText}>
                    <ReactMarkdown components={MarkdownComponents}>
                      {button.title || buttonKey}
                    </ReactMarkdown>
                  </Text>
                </Group>
              )}
              {button.description && (
                <Text className={classes.description}>
                  <ReactMarkdown components={MarkdownComponents}>
                    {button.description}
                  </ReactMarkdown>
                </Text>
              )}
              {button.progress !== undefined && (
                <Progress
                  value={button.progress}
                  size="sm"
                  color={button.colorScheme || 'dark.3'}
                />
              )}
            </Stack>

            {(button.menu || button.arrow) && button.arrow !== false && (
              <Stack className={classes.buttonArrowContainer}>
                <LibIcon icon="chevron-right" fixedWidth />
              </Stack>
            )}
          </Group>
        </Button>
      </HoverCard.Target>

      <HoverCard.Dropdown className={classes.dropdown}>
        {button.image && <Image src={button.image} />}
        {Array.isArray(button.metadata) ? (
          button.metadata.map(
            (
              metadata:
                | string
                | { label: string; value?: any; progress?: number; colorScheme?: string },
              index: number
            ) => (
              <React.Fragment key={`context-metadata-${index}`}>
                <Text>
                  {typeof metadata === 'string'
                    ? metadata
                    : `${metadata.label}: ${metadata?.value ?? ''}`}
                </Text>
                {typeof metadata === 'object' && metadata.progress !== undefined && (
                  <Progress
                    value={metadata.progress}
                    size="sm"
                    color={
                      metadata.colorScheme || button.colorScheme || 'dark.3'
                    }
                  />
                )}
              </React.Fragment>
            )
          )
        ) : (
          <>
            {typeof button.metadata === 'object' &&
              Object.entries(button.metadata).map(([key, val], index) => (
                <Text key={`context-metadata-${index}`}>
                  {key}: {val}
                </Text>
              ))}
          </>
        )}
      </HoverCard.Dropdown>
    </HoverCard>
  );
};

export default ContextButton;
