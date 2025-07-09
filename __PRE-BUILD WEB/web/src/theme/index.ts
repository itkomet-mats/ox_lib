import { MantineThemeOverride } from '@mantine/core';

export const theme: MantineThemeOverride = {
  colorScheme: 'dark',
  fontFamily: 'Roboto',
  shadows: { sm: '0 10px 50px rgba(0, 0, 0, 0.3)' },
  components: {
    Button: {
      styles: {
        root: {
          border: '1px solid rgba(225, 255, 141, 0.61)',
          background: 'rgba(225, 255, 141, 0.16)',
          // boxShadow: '0 10px 50px rgba(0, 0, 0, 0.3)',
          color: 'rgb(224, 255, 141)',

        },
      },
    },
  },
};
