/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},

    screens: {
      vsm: "500px",
      sm: "640px",
      md: "768px",
      "2md": "890px",
      lg: "1024px",
      "2lg": "1300px",
      xl: "1536px",
    },
  },
  plugins: [require("tailwindcss")],
};
