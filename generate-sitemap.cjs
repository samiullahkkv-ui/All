const fs = require('fs');
// We need to parse toolsData.ts
const content = fs.readFileSync('src/toolsData.ts', 'utf-8');

const regex = /id:\s*['"]([^'"]+)['"]/g;
let match;
const toolIds = [];
while ((match = regex.exec(content)) !== null) {
  toolIds.push(match[1]);
}

const categories = [
  'text-tools',
  'developer',
  'generators',
  'calculators',
  'converters',
  'media-tools',
  'document-tools',
  'web-tools',
  'ai-tools'
];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://alltool-phi.vercel.app/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
`;

for (const cat of categories) {
  xml += `  <url>
    <loc>https://alltool-phi.vercel.app/category/${cat}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
}

for (const id of toolIds) {
  xml += `  <url>
    <loc>https://alltool-phi.vercel.app/tools/${id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
}

xml += `</urlset>`;

fs.writeFileSync('public/sitemap.xml', xml);
