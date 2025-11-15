import { Box, createStyles, Group, Progress, Stack, Text } from '@mantine/core';
import React, { forwardRef } from 'react';
import CustomCheckbox from './CustomCheckbox';
import type { MenuItem } from '../../../typings';
import { isIconUrl } from '../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import LibIcon from '../../../components/LibIcon';

interface Props {
  item: MenuItem;
  index: number;
  scrollIndex: number;
  checked: boolean;
}

const BRAND = {
  primary: '#5df542',
} as const;

const CORNER = { size: 20, thickness: 2 } as const;

const useStyles = createStyles((theme, params: { iconColor?: string }) => ({
  buttonContainer: {
    position: 'relative',
    background: '#072e00ff',
    // border: '1px solid rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
    padding: 6,
    height: 65,
    scrollMargin: 8,
    transition: 'all 0.2s ease',

    '& .corner': {
      opacity: 0,
      transition: 'opacity 0.2s ease',
    },

    '&:hover .corner': {
      opacity: 1,
    },

    '&:hover': {
      borderColor: BRAND.primary,
      background: '#333333aa',
      cursor: 'pointer',
    },

    '&:active': {
      transform: 'scale(0.98)',
      filter: 'brightness(0.9)',
    },

    '&:focus': {
      borderColor: BRAND.primary,
      boxShadow: `0 0 10px ${BRAND.primary}60`,
      outline: 'none',
      '& .corner': {
        opacity: 1,
      },
    },
  },

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

  iconImage: {
    maxWidth: 32,
  },
  buttonWrapper: {
    paddingLeft: 5,
    paddingRight: 12,
    height: '100%',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    width: 32,
    height: 32,
  },
  icon: {
    fontSize: 24,
    color: params.iconColor || 'white',
  },
  label: {
    color: 'white',
    textTransform: 'uppercase',
    fontSize: 12,
    verticalAlign: 'middle',
  },
  chevronIcon: {
    fontSize: 14,
    color: 'white',
  },
  scrollIndexValue: {
    color: 'white',
    textTransform: 'uppercase',
    fontSize: 14,
  },
  progressStack: {
    width: '100%',
    marginRight: 5,
  },
  progressLabel: {
    verticalAlign: 'middle',
    marginBottom: 3,
    color: 'white',
    fontSize: 12,
  },
}));

const ListItem = forwardRef<Array<HTMLDivElement | null>, Props>(
  ({ item, index, scrollIndex, checked }, ref) => {
    const { classes, cx } = useStyles({ iconColor: item.iconColor });

    return (
      <Box
        tabIndex={index}
        className={classes.buttonContainer}
        key={`item-${index}`}
        ref={(element: HTMLDivElement) => {
          if (ref)
            // @ts-ignore
            return (ref.current = [...ref.current, element]);
        }}
      >
        {/* Hover corners */}
        <span className={cx(classes.corner, 'corner', classes.topLeft)} />
        <span className={cx(classes.corner, 'corner', classes.topRight)} />
        <span className={cx(classes.corner, 'corner', classes.bottomLeft)} />
        <span className={cx(classes.corner, 'corner', classes.bottomRight)} />

        <Group spacing={15} noWrap className={classes.buttonWrapper}>
          {item.icon && (
            <Box className={classes.iconContainer}>
              {typeof item.icon === 'string' && isIconUrl(item.icon) ? (
                <img src={item.icon} alt="Missing image" className={classes.iconImage} />
              ) : (
                <LibIcon
                  icon={item.icon as IconProp}
                  className={classes.icon}
                  fixedWidth
                  animation={item.iconAnimation}
                />
              )}
            </Box>
          )}

          {Array.isArray(item.values) ? (
            <Group position="apart" w="100%">
              <Stack spacing={0} justify="space-between">
                <Text className={classes.label}>{item.label}</Text>
                <Text>
                  {typeof item.values[scrollIndex] === 'object'
                    ? // @ts-ignore
                      item.values[scrollIndex].label
                    : item.values[scrollIndex]}
                </Text>
              </Stack>
              <Group spacing={1} position="center">
                <LibIcon icon="chevron-left" className={classes.chevronIcon} />
                <Text className={classes.scrollIndexValue}>
                  {scrollIndex + 1}/{item.values.length}
                </Text>
                <LibIcon icon="chevron-right" className={classes.chevronIcon} />
              </Group>
            </Group>
          ) : item.checked !== undefined ? (
            <Group position="apart" w="100%">
              <Text>{item.label}</Text>
              <CustomCheckbox checked={checked} />
            </Group>
          ) : item.progress !== undefined ? (
            <Stack className={classes.progressStack} spacing={0}>
              <Text className={classes.progressLabel}>{item.label}</Text>
              <Progress
                value={item.progress}
                color={item.colorScheme || 'dark.0'}
                styles={(theme) => ({
                  root: { backgroundColor: theme.colors.dark[3] },
                })}
              />
            </Stack>
          ) : (
            <Text>{item.label}</Text>
          )}
        </Group>
      </Box>
    );
  }
);

export default React.memo(ListItem);
