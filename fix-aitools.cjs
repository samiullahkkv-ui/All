const fs = require('fs');
let content = fs.readFileSync('src/components/AITools.tsx', 'utf8');

// Replace components with function calls
content = content.replace(/const LanguageSelect = \(\) => \(/g, 'const renderLanguageSelect = () => (');
content = content.replace(/<LanguageSelect \/>/g, '{renderLanguageSelect()}');

content = content.replace(/const SubjectSelect = \(\) => \(/g, 'const renderSubjectSelect = () => (');
content = content.replace(/<SubjectSelect \/>/g, '{renderSubjectSelect()}');

content = content.replace(/const ImageUpload = \(\) => \(/g, 'const renderImageUpload = () => (');
content = content.replace(/<ImageUpload \/>/g, '{renderImageUpload()}');

content = content.replace(/const OutputPanel = \(\) => \(/g, 'const renderOutputPanel = () => (');
content = content.replace(/<OutputPanel \/>/g, '{renderOutputPanel()}');

content = content.replace(/const Layout = \(\{ leftPanel, customRightPanel \}: \{ leftPanel: React\.ReactNode, customRightPanel\?: React\.ReactNode \}\) => \(/g, 'const renderLayout = (leftPanel: React.ReactNode, customRightPanel?: React.ReactNode) => (');

// We have many <Layout leftPanel={ ... } /> calls. We need to replace them carefully.
content = content.replace(/<Layout leftPanel=\{/g, 'renderLayout(');

// Also need to handle closing bracket. The closing for <Layout leftPanel={<>...</>} />
content = content.replace(/\n *\} \/>;/g, '\n  );');
content = content.replace(/\n      \} \/>;/g, '\n      );');
content = content.replace(/\n    \} \/>;/g, '\n    );');

// The ai_image_generator layout is returned differently
content = content.replace(/return \(\n *<Layout \n *customRightPanel=\{rightPanel\}\n *leftPanel=\{/g, 'return renderLayout(');
content = content.replace(/\} \/>\n *\);/g, ', rightPanel);');

fs.writeFileSync('src/components/AITools.tsx', content);
