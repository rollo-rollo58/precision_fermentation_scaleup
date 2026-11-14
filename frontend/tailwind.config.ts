import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { accent: '#5eead4', ink: '#0b1120' },
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui'] },
    },
  },
  plugins: [],
};
export default config;
