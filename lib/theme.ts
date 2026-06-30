import { createTheme } from '@mantine/core';

// Theme Praxis — light, accent xanh gần token cũ (#185FA5), bo góc mềm.
export const theme = createTheme({
  primaryColor: 'blue',
  primaryShade: { light: 7 },
  defaultRadius: 'md',
  fontFamily: '-apple-system, system-ui, "Segoe UI", Roboto, sans-serif',
  fontFamilyMonospace: 'ui-monospace, "SF Mono", Menlo, monospace',
  headings: {
    fontWeight: '650',
    sizes: {
      h1: { fontSize: '1.7rem', lineHeight: '1.25' },
      h2: { fontSize: '1.3rem' },
      h3: { fontSize: '1.1rem' },
    },
  },
});
