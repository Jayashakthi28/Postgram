/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        bubbler: ["Bubbler"],
        patrick: ["Patrick"],
        pacifico: ["Pacifico"],
        righteous: ["Righteous"],
        sofiasans: ["Sofiasans"],
      },
      screens: {
        sm: { min: "0px", max: "767px" },
        // => @media (min-width: 640px) { ... }

        md: "768px",
        // => @media (min-width: 768px) { ... }

        lg: "1024px",
        // => @media (min-width: 1024px) { ... }

        xl: "1280px",
        // => @media (min-width: 1280px) { ... }
      },
    },
  },
  plugins: [],
};
