import { Box, createStyles } from '@mantine/core';
import { useEffect, useState } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useNuiEvent } from '../../../hooks/useNuiEvent';
import { fetchNui } from '../../../utils/fetchNui';
import { isIconUrl } from '../../../utils/isIconUrl';
import ScaleFade from '../../../transitions/ScaleFade';
import type { RadialMenuItem } from '../../../typings';
import { useLocales } from '../../../providers/LocaleProvider';
import LibIcon from '../../../components/LibIcon';

const useStyles = createStyles((_theme) => {
  const YELLOW = '#5df542';

  return {
    wrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontFamily: '"Inter", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
  },


     /** Group-level styling & hovers for each blade */
  sector: {
    color: '#fff',
    transition: 'filter .12s ease-out',

    '&:hover': {
      cursor: 'pointer',
      filter: 'drop-shadow(0 0 10px #072e00ff)',

      // brighten base on hover
      '.sectorBase': {
        // keep base dark but slightly warmed on hover
        fill: '#093f00ff',
        stroke: '#5df542',
      },
      // keep overlay visible
      '.sectorOverlay': {
        opacity: 0.55,
      },

      '> g > text, > g > svg > path': {
        fill: '#ffffff',
      },
    },

       // active/persist highlight (if you set data-active on the group)
    '&[data-active="true"] .sectorBase': {
      fill: '#072e00ff',
      stroke: '#5df542',
      filter: 'drop-shadow(0 0 14px #5df542)',
    },
    '&[data-active="true"] .sectorOverlay': {
      opacity: 0.6,
    },
    '&[data-active="true"] > g > text': {
      fill: '#ffffff',
      textShadow:
        '0 0 12px #5df542, 0 0 4px #5df542, 0 1px 2px rgba(0,0,0,.85)',
    },
    '&[data-active="true"] > g > svg > path': {
      fill: '#5df542',
      filter: 'drop-shadow(0 0 6px #5df542)',
    },

       // labels
    '> g > text': {
      fill: '#ffffff',
      strokeWidth: 0,
      fontWeight: 700,
      fontFamily: '"Inter", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
      textShadow: '0 1px 2px rgba(0,0,0,.85), 0 0 8px rgba(0,0,0,.45)',
    },
    // icons (if any SVG path)
    '> g > svg > path': {
      fill: '#E6E8EB',
    },
  },

    /** Base shape of a blade: solid dark for readability */
  sectorBase: {
    // solid base = your "linear-gradient(#2a2a2a, #2a2a2a)"
    fill: '#072e00ff',
    // keep a subtle border; slightly warmer like your container example
    stroke: '#5df542',
    strokeWidth: 1,
    transition: 'fill .12s ease-out, stroke .12s ease-out',
  },

   /** Stripes overlay (subtle), sits on top of base */
  sectorOverlay: {
    // this is the "repeating-linear-gradient(...)" equivalent
    fill: 'url(#radialStripes)',
    opacity: 0.5,
    pointerEvents: 'none',
  },

   /** Center hub button */
  centerCircle: {
    // solid dark base for center
    fill: '#072e00ff',
    color: '#2a2a2a',
    stroke: 'rgba(255, 251, 251, 0.28)',
    strokeWidth: 1,
    transition: 'fill .12s ease-out, filter .12s ease-out',
    '&:hover': {
      cursor: 'pointer',
      fill: '#072e00ff',
      filter: 'drop-shadow(0 0 12px #5df542)',
    },
    '&[data-active="true"]': {
      fill: '#5df542',
      filter: 'drop-shadow(0 0 12px #5df542)',
    },
  },



    centerIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  },
  centerIcon: {
    // default brand yellow; we override via prop when hovering X
    color: YELLOW,
    filter: 'drop-shadow(0 0 8px #5df542)',
  },

  };
});

const calculateFontSize = (text: string): number => {
  if (text.length > 20) return 10;
  if (text.length > 15) return 12;
  return 13;
};

const splitTextIntoLines = (text: string, maxCharPerLine: number = 15): string[] => {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    if (currentLine.length + words[i].length + 1 <= maxCharPerLine) {
      currentLine += ' ' + words[i];
    } else {
      lines.push(currentLine);
      currentLine = words[i];
    }
  }
  lines.push(currentLine);
  return lines;
};

const PAGE_ITEMS = 6;
const degToRad = (deg: number) => deg * (Math.PI / 180);

// ring wedge path (donut blade)
const donutSectorPath = (
  cx: number, cy: number,
  innerR: number, outerR: number,
  sweepDeg: number
) => {
  const ang = degToRad(sweepDeg);
  const large = sweepDeg > 180 ? 1 : 0;

  const sxOuter = cx + outerR;
  const syOuter = cy;
  const exOuter = cx + outerR * Math.cos(-ang);
  const eyOuter = cy + outerR * Math.sin(-ang);

  const exInner = cx + innerR * Math.cos(-ang);
  const eyInner = cy + innerR * Math.sin(-ang);
  const sxInner = cx + innerR;
  const syInner = cy;

  return [
    `M ${sxInner} ${syInner}`,
    `L ${sxOuter} ${syOuter}`,
    `A ${outerR} ${outerR} 0 ${large} 0 ${exOuter} ${eyOuter}`,
    `L ${exInner} ${eyInner}`,
    `A ${innerR} ${innerR} 0 ${large} 1 ${sxInner} ${syInner}`,
    `Z`,
  ].join(' ');
};

const RadialMenu: React.FC = () => {
  const { classes } = useStyles();
  const { locale } = useLocales();
  const newDimension = 350 * 1.1025;

  const [visible, setVisible] = useState(false);
  const [centerHover, setCenterHover] = useState(false); // for X hover color
  const [menuItems, setMenuItems] = useState<RadialMenuItem[]>([]);
  const [menu, setMenu] = useState<{ items: RadialMenuItem[]; sub?: boolean; page: number }>({
    items: [],
    sub: false,
    page: 1,
  });

  const changePage = async (increment?: boolean) => {
    setVisible(false);
    const didTransition: boolean = await fetchNui('radialTransition');
    if (!didTransition) return;
    setVisible(true);
    setMenu({ ...menu, page: increment ? menu.page + 1 : menu.page - 1 });
  };

  useEffect(() => {
    if (menu.items.length <= PAGE_ITEMS) return setMenuItems(menu.items);
    const items = menu.items.slice(
      PAGE_ITEMS * (menu.page - 1) - (menu.page - 1),
      PAGE_ITEMS * menu.page - menu.page + 1
    );
    if (PAGE_ITEMS * menu.page - menu.page + 1 < menu.items.length) {
      items[items.length - 1] = { icon: 'ellipsis-h', label: locale.ui.more, isMore: true };
    }
    setMenuItems(items);
  }, [menu.items, menu.page]);

  useNuiEvent('openRadialMenu', async (data: { items: RadialMenuItem[]; sub?: boolean; option?: string } | false) => {
    if (!data) return setVisible(false);
    let initialPage = 1;
    if (data.option) {
      data.items.findIndex(
        (item, index) => item.menu == data.option && (initialPage = Math.floor(index / PAGE_ITEMS) + 1)
      );
    }
    setMenu({ ...data, page: initialPage });
    setVisible(true);
  });

  useNuiEvent('refreshItems', (data: RadialMenuItem[]) => {
    setMenu({ ...menu, items: data });
  });

  return (
    <>
      <Box
        className={classes.wrapper}
        onContextMenu={async () => {
          if (menu.page > 1) await changePage();
          else if (menu.sub) fetchNui('radialBack');
        }}
      >
        <ScaleFade visible={visible}>
          <svg
            style={{ overflow: 'visible' }}
            width={`${newDimension}px`}
            height={`${newDimension}px`}
            viewBox="0 0 350 350"
            transform="rotate(90)"
          >

            {/* NOTE: no background circle at all (kept fully transparent by removing it) */}

            {menuItems.map((item, index) => {
              const count = menuItems.length < 3 ? 3 : menuItems.length;
              const pieAngle = 360 / count;
              const angle = degToRad(pieAngle / 2 + 90);

              // Wider ring geometry (thicker blades)
              const OUTER = 170;
              const INNER = 80;
              const RADIAL_GAP = 6;
              const midRadius = (INNER + OUTER) / 2;

              const iconYOffset = splitTextIntoLines(item.label, 15).length > 3 ? 3 : 0;
              const iconX = 175 + Math.sin(angle) * midRadius;
              const iconY = 175 + Math.cos(angle) * midRadius + iconYOffset;

              const iconWidth = Math.min(Math.max(item.iconWidth || 50, 0), 100);
              const iconHeight = Math.min(Math.max(item.iconHeight || 50, 0), 100);

              return (
                <g
                  key={index}
                  transform={`rotate(-${index * pieAngle} 175 175)`}
                  className={classes.sector}
                  onClick={async () => {
                    const clickIndex = menu.page === 1 ? index : PAGE_ITEMS * (menu.page - 1) - (menu.page - 1) + index;
                    if (!item.isMore) fetchNui('radialClick', clickIndex);
                    else await changePage(true);
                  }}
                >
                  {/* DARK base + subtle striped overlay */}
                  <path className={`${classes.sectorBase} sectorBase`} d={donutSectorPath(175, 175, INNER + RADIAL_GAP, OUTER - RADIAL_GAP, pieAngle)} />
                  <path className={classes.sectorOverlay} d={donutSectorPath(175, 175, INNER + RADIAL_GAP, OUTER - RADIAL_GAP, pieAngle)} />

                  {/* Icon + text */}
                  <g transform={`rotate(${index * pieAngle - 90} ${iconX} ${iconY})`} pointerEvents="none">
                    {typeof item.icon === 'string' && isIconUrl(item.icon) ? (
                      <image
                        href={item.icon}
                        width={iconWidth}
                        height={iconHeight}
                        x={iconX - iconWidth / 2}
                        y={iconY - iconHeight / 2 - iconHeight / 4}
                      />
                    ) : (
                      <LibIcon
                        x={iconX - 14.5}
                        y={iconY - 17.5}
                        icon={item.icon as IconProp}
                        width={30}
                        height={30}
                        fixedWidth
                      />
                    )}
                    <text
                      x={iconX}
                      y={iconY + (splitTextIntoLines(item.label, 15).length > 2 ? 15 : 28)}
                      fill="#fff"
                      textAnchor="middle"
                      fontSize={calculateFontSize(item.label)}
                      pointerEvents="none"
                      lengthAdjust="spacingAndGlyphs"
                    >
                      {splitTextIntoLines(item.label, 15).map((line, i) => (
                        <tspan x={iconX} dy={i === 0 ? 0 : '1.2em'} key={i}>
                          {line}
                        </tspan>
                      ))}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Center hub */}
            <g
              transform={`translate(175, 175)`}
              onMouseEnter={() => setCenterHover(true)}
              onMouseLeave={() => setCenterHover(false)}
              onClick={async () => {
                if (menu.page > 1) await changePage();
                else {
                  if (menu.sub) fetchNui('radialBack');
                  else {
                    setVisible(false);
                    fetchNui('radialClose');
                  }
                }
              }}
            >
              <circle r={28} className={classes.centerCircle} />
            </g>
          </svg>

          <div className={classes.centerIconContainer}>
            <LibIcon
              icon={!menu.sub && menu.page < 2 ? 'xmark' : 'arrow-rotate-left'}
              fixedWidth
              className={classes.centerIcon}
              color={
                (!menu.sub && menu.page < 2 && centerHover)
                  ? '#2a2a2a'   // X turns dark on hover
                  : '#FFFC68'   // default brand yellow
              }
              style={{
                filter:
                  (!menu.sub && menu.page < 2 && centerHover)
                    ? 'none'
                    : 'drop-shadow(0 0 8px rgba(255,252,104,.9))',
              }}
              size="2x"
            />
          </div>
        </ScaleFade>
      </Box>
    </>
  );
};

export default RadialMenu;
