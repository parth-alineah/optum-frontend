/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    backgroundImage: {},
    colors: {
      pink: {
        // main: '#e20074',
        main: '#e20074',
        light: '#e20074',
        dark: '#e20074',
      },
      darkBlue: {
        // main: '#003876',
        main: '#3441a4',
        light: '#3441a4',
        dark: '#3441a4',
      },
      midBlue: {
        main: '#d9e3f8',
        light: '#d9e3f8',
        dark: '#d9e3f8',
        // dark: '#004DAA',
      },
      blue: {
        main: '#095aac',
        light: '#095aac',
        dark: '#095aac',
      },
      lightBlue: {
        main: '#d9e3f8',
        light: '#d9e3f8',
        dark: '#d9e3f8',
      },
      lightGray: {
        main: '#F5F5F5',
        light: '#F5F5F5',
        dark: '#F5F5F5',
      },
      gray: {
        main: '#d4d4d4',
        light: '#d4d4d4',
        dark: '#d4d4d4',
      },
      midGray: {
        main: '#c1c1c4',
        light: '#c1c1c4',
        dark: '#c1c1c4',
      },
      darkGray: {
        main: '#787d78',
        light: '#787d78',
        dark: '#787d78',
      },
      darkestGray: {
        main: '#434655',
        light: '#434655',
        dark: '#434655',
      },
      orange: {
        main: '#FF0000',
        light: '#FF0000',
        dark: '#FF0000',
      },
      lightOrange: {
        main: '#de605d',
        light: '#de605d',
        dark: '#de605d',
      },
      green: {
        main: '#08ac20',
        light: '#08ac20',
        dark: '#08ac20',
      },
      lightGreen: {
        main: '#006571',
        light: '#006571',
        dark: '#006571',
      },
      yellow: {
        main: '#f0c51a',
        light: '#f0c51a',
        dark: '#f0c51a',
      },
      lime: {
        main: '#f6f9f7',
        light: '#f6f9f7',
        dark: '#f6f9f7',
      },
      white: {
        main: '#ffffff',
        light: '#ffffff',
        dark: '#ffffff',
      },
      black: {
        main: '#2B2A2A',
        light: '#2B2A2A',
        dark: '#2B2A2A',
      },
    },
    extend: {
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fit, minmax(300px,1fr))',
      },
      spacing: {
        container: `max(
            1rem,
            calc((100vw - calc(1440px - 1rem * 2)) / 2)
            )`,
        'btw-container': `max(
              1rem,
              calc((100vw - calc(1440px - 0.5rem * 2)) / 2)
              )`,
      },
      keyframes: {
        spin: {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
      },
      animation: {
        loading: 'spin 1.3s linear infinite',
      },
      aspectRatio: {
        planCardRatio: '2/3',
      },
      fontFamily: {
        sans: ['Roboto'],
      },
      boxShadow: {
        'box-out': `0px 2px 4px rgba(0, 0, 0, 0.4), 0px 7px 13px -3px rgba(0, 0, 0, 0.3), inset 0px -3px 0px rgba(0, 0, 0, 0.2)`,
        'box-in': `#d4d4d4 100px -100px 136px -128px inset`,
      },
    },
  },
  plugins: [],
}
