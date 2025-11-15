import { MantineThemeOverride } from '@mantine/core';

export const theme: MantineThemeOverride = {
  colorScheme: 'dark',
  fontFamily: 'Roboto',
  shadows: { sm: '0 10px 50px rgba(0, 0, 0, 0.3)' },
  components: {
    Button: {
      styles: {
        root: {
          border: '1px solid #5df542',
          background: '#072e00ff',
          // boxShadow: '0 10px 50px rgba(0, 0, 0, 0.3)',
          color: '#5df542',

        },
      },
    },
  },
};
