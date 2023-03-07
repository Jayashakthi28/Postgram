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
        postBox: {min:"0px",max:"500px"},
        // => @media (min-width: 1280px) { ... }
      },
      boxShadow:{
        "card":"rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
        "hover":"rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px"
      }
    },
  },
  plugins: [],
};
