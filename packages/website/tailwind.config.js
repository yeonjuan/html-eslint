/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: {
          200: "#F4F6F8",
          300: "#E8EBEF",
          500: "#8A91A4",
          600: "#707990",
        },
        black: {
          300: "#C6C7C8",
          500: "#6e6e6e",
          700: "#525658",
          900: "#1D1D1D",
        },
        accent: "#6750D2",
      },
    },
  },
};
