const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

const newCSS = `
html, body {
  max-width: 100vw;
  overflow-x: hidden !important;
  position: relative;
}

#root {
  max-width: 100vw;
  overflow-x: hidden !important;
}

` + css;

fs.writeFileSync('src/index.css', newCSS);
