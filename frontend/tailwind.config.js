module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#2F3437',
          overlay: 'rgba(15, 15, 15, 0.6)'
        },
        darkwhite: '#EBEBEB',
        hover: '#44494B',
        printBlack: "#37352F",
        options: {
          toggle: '#CACCCE',
          background: '#3F4447',
          heading: '#EEEFEF',
          hover: '#53575A'
        },
        settings: {
          panel: '#373C3F',
          panelText: '#EDEEEE',
          username: '#AFB1B2',
          panelHover: '#4B5053',
        },
      },
      fontFamily: {
        open: `'Open Sans', sans-serif`,
      },
      screens: {

        'xs': '320px',
        // => @media (min-width: 320px) { ... }

        'sm': '720px',
        // => @media (min-width: 640px) { ... }

        'md': '900px',
        // => @media (min-width: 768px) { ... }

        'lg': '1180px',
        // => @media (min-width: 1024px) { ... }

        'xl': '1280px',
        // => @media (min-width: 1280px) { ... }

        '2xl': '1536px',
        // => @media (min-width: 1536px) { ... }
      },
      boxShadow: {
        'modal': 'rgb(15 15 15 / 10%) 0px 0px 0px 1px, rgb(15 15 15 / 20%) 0px 5px 10px, rgb(15 15 15 / 40%) 0px 15px 40px',
      }
    },
  },
  plugins: [],
}
