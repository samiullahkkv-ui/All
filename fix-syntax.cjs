const fs = require('fs');
let content = fs.readFileSync('src/components/AITools.tsx', 'utf8');

content = content.replace(/          <\/>\n        \}\n      \/>\n    \);/g, '          </>\n  , rightPanel);');

fs.writeFileSync('src/components/AITools.tsx', content);
