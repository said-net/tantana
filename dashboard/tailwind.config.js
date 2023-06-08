const withMT = require("@material-tailwind/react/utils/withMT");
 
module.exports = withMT({
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
    },
    screens:{
      laptop: {max: '1350px'},
      laptop2: {max: '1100px'},
      laptop22: {max: '950px'},
      laptop3: {max: '830px'},
      tablet: {max: '768px'},
      tablet2: {max: '599px'},
      phone: {max: '500px'},
    }
  },
  plugins: [],
});