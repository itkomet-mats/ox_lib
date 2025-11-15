import { useNuiEvent } from '../../hooks/useNuiEvent';
import { toast, Toaster } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { Box, Center, createStyles, Group, keyframes, RingProgress, Stack, Text, ThemeIcon } from '@mantine/core';
import React, { useState } from 'react';
import tinycolor from 'tinycolor2';
import type { NotificationProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';
import LibIcon from '../../components/LibIcon';

// colors
const BRAND = {
  primary: '#5df542',
  error: '#ff5a5aff',
  info: '#5df542',
} as const;

// semi-transparent background variants
const BACKGROUNDS: Record<string, string> = {
  error: '#420000ff',
  success: '#072e00ff',
  info: '#072e00ff',
  default: '#072e00ff', // fallback
};

const CORNER = { size: 18, thickness: 2 } as const;

const useStyles = createStyles(() => ({
  container: {
    width: 400,
    height: 'fit-content',
    borderRadius: 0,
    color: 'white',
    padding: 12,
    fontFamily: 'Roboto',
    boxShadow: '0 10px 50px rgba(0, 0, 0, 0.3)',
    position: 'relative',
    overflow: 'hidden',
  },


  // text
  title: {
    fontWeight: 500,
    fontSize: 18,
    lineHeight: 'normal',
       transform: 'perspective(1000px) rotateY(-4deg)',
  },
  description: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Roboto',
    lineHeight: 'normal',
       transform: 'perspective(1000px) rotateY(-4deg)',
  },
  descriptionOnly: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Roboto',
    lineHeight: 'normal',
       transform: 'perspective(1000px) rotateY(-4deg)',
  },

  // corner pieces
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

const createAnimation = (from: string, to: string, visible: boolean) =>
  keyframes({
    from: {
      opacity: visible ? 0 : 1,
      transform: `translate${from}`,
    },
    to: {
      opacity: visible ? 1 : 0,
      transform: `translate${to}`,
    },
  });

const getAnimation = (visible: boolean, position: string) => {
  const animationOptions = visible ? '0.2s ease-out forwards' : '0.4s ease-in forwards';
  let animation: { from: string; to: string };

  if (visible) {
    animation = position.includes('bottom')
      ? { from: 'Y(30px)', to: 'Y(0px)' }
      : { from: 'Y(-30px)', to: 'Y(0px)' };
  } else {
    if (position.includes('right')) {
      animation = { from: 'X(0px)', to: 'X(100%)' };
    } else if (position.includes('left')) {
      animation = { from: 'X(0px)', to: 'X(-100%)' };
    } else if (position === 'top-center') {
      animation = { from: 'Y(0px)', to: 'Y(-100%)' };
    } else if (position === 'bottom') {
      animation = { from: 'Y(0px)', to: 'Y(100%)' };
    } else {
      animation = { from: 'X(0px)', to: 'X(100%)' };
    }
  }

  return `${createAnimation(animation.from, animation.to, visible)} ${animationOptions}`;
};

const durationCircle = keyframes({
  '0%': { strokeDasharray: `0, ${15.1 * 2 * Math.PI}` },
  '100%': { strokeDasharray: `${15.1 * 2 * Math.PI}, 0` },
});

const Notifications: React.FC = () => {
  const { classes, cx } = useStyles();
  const [toastKey, setToastKey] = useState(0);

  useNuiEvent<NotificationProps>('notify', (data) => {
    if (!data.title && !data.description) return;

    const toastId = data.id?.toString();
    const duration = data.duration || 3000;

    let iconColor: string;
    let position = data.position || 'top-right';

    data.showDuration = data.showDuration !== undefined ? data.showDuration : true;

    if (toastId) setToastKey((prevKey) => prevKey + 1);

    // Backwards compat
    switch (position) {
      case 'top':
        position = 'top-center';
        break;
      case 'bottom':
        position = 'bottom-center';
        break;
    }

    if (!data.icon) {
      switch (data.type) {
        case 'error':
          data.icon = 'circle-xmark';
          break;
        case 'success':
          data.icon = 'circle-check';
          break;
        case 'warning':
          data.icon = 'circle-exclamation';
          break;
        default:
          data.icon = 'circle-info';
          break;
      }
    }

    if (!data.iconColor) {
      switch (data.type) {
        case 'error':
          iconColor = 'rgba(255, 255, 255, 1)';
          break;
        case 'success':
          iconColor = 'rgba(255, 255, 255, 1)';
          break;
        case 'warning':
          iconColor = 'rgba(255, 255, 255, 1)';
          break;
        default:
          iconColor = 'white.6';
          break;
      }
    } else {
      iconColor = tinycolor(data.iconColor).toRgbString();
    }

    // backgrounds + corner color
    const bgColor = BACKGROUNDS[data.type ?? 'default'] || BACKGROUNDS.default;
    const cornerColor =
      data.type === 'error'
        ? BRAND.error
        : data.type === 'success'
        ? BRAND.primary
        : BRAND.info;

    toast.custom(
      (t) => (
        <Box
          sx={{
            animation: getAnimation(t.visible, position),
            background: bgColor,
            ...data.style,
          }}
          className={classes.container}
        >
          {/* corner-only borders */}
          <span className={cx(classes.corner, classes.topLeft)} style={{ borderColor: cornerColor }} />
          <span className={cx(classes.corner, classes.topRight)} style={{ borderColor: cornerColor }} />
          <span className={cx(classes.corner, classes.bottomLeft)} style={{ borderColor: cornerColor }} />
          <span className={cx(classes.corner, classes.bottomRight)} style={{ borderColor: cornerColor }} />

          <Group noWrap spacing={12}>
            {data.icon && (
              <>
                {data.showDuration ? (
                  <RingProgress
                    key={toastKey}
                    size={38}
                    thickness={2}
                    sections={[{ value: 100, color: iconColor }]}
                    style={{
                      alignSelf:
                        !data.alignIcon || data.alignIcon === 'center' ? 'center' : 'start',
                    }}
                    styles={{
                      root: {
                        '> svg > circle:nth-of-type(2)': {
                          animation: `${durationCircle} linear forwards reverse`,
                          animationDuration: `${duration}ms`,
                        },
                        margin: -3,
                      },
                    }}
                    label={
                      <Center>
                        <ThemeIcon
                          color={iconColor}
                          radius="xl"
                          size={32}
                          variant={
                            tinycolor(iconColor).getAlpha() < 0 ? undefined : 'light'
                          }
                        >
                          <LibIcon
                            icon={data.icon}
                            fixedWidth
                            color={iconColor}
                            animation={data.iconAnimation}
                          />
                        </ThemeIcon>
                      </Center>
                    }
                  />
                ) : (
                  <ThemeIcon
                    color={iconColor}
                    radius="xl"
                    size={32}
                    variant={tinycolor(iconColor).getAlpha() < 0 ? undefined : 'light'}
                    style={{
                      alignSelf:
                        !data.alignIcon || data.alignIcon === 'center' ? 'center' : 'start',
                    }}
                  >
                    <LibIcon
                      icon={data.icon}
                      fixedWidth
                      color={iconColor}
                      animation={data.iconAnimation}
                    />
                  </ThemeIcon>
                )}
              </>
            )}
            <Stack spacing={0}>
              {data.title && <Text className={classes.title}>{data.title}</Text>}
              {data.description && (
                <ReactMarkdown
                  components={MarkdownComponents}
                  className={`${
                    !data.title ? classes.descriptionOnly : classes.description
                  } description`}
                >
                  {data.description}
                </ReactMarkdown>
              )}
            </Stack>
          </Group>
        </Box>
      ),
      {
        id: toastId,
        duration,
        position,
      }
    );
  });

  return <Toaster />;
};

export default Notifications;
