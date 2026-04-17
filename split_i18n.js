const fs = require('fs');
const path = require('path');

function splitFile(lang) {
  const filePath = path.join(__dirname, 'src/i18n/locales', `${lang}.ts`);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Create directories
  const baseDir = path.join(__dirname, 'src/i18n/locales', lang);
  const toolsDir = path.join(baseDir, 'tools');
  if (!fs.existsSync(toolsDir)) fs.mkdirSync(toolsDir, { recursive: true });

  // Extract common parts (seo, common, home)
  const commonMatch = content.match(/export default {([\s\S]*?)tools: {/);
  if (commonMatch) {
    let commonContent = 'export default {' + commonMatch[1].trim();
    // Remove the trailing comma if it exists
    if (commonContent.endsWith(',')) commonContent = commonContent.slice(0, -1);
    commonContent += '\n};';
    fs.writeFileSync(path.join(baseDir, 'common.ts'), commonContent);
  }

  // Extract tools
  const toolsSection = content.match(/tools: {([\s\S]*)}\s*};/);
  if (toolsSection) {
    const toolsStr = toolsSection[1].trim();
    // Split by top-level keys in the tools object
    // Regex matches: 'id': { ... } OR id: { ... }
    const toolRegex = /['"]?([\w-]+)['"]?:\s*{([\s\S]*?)},\n\s*(?=['"]?[\w-]+['"]?:\s*{|$)/g;
    let match;
    while ((match = toolRegex.exec(toolsStr + ',\n')) !== null) {
      const id = match[1];
      const toolBody = match[2].trim();
      const toolContent = `export default {\n  ${toolBody}\n};`;
      fs.writeFileSync(path.join(toolsDir, `${id}.ts`), toolContent);
    }
  }

  // Create index.ts
  const indexContent = `import common from './common';\n\nconst toolModules = import.meta.glob('./tools/*.ts', { eager: true });\nconst tools = {};\n\nfor (const path in toolModules) {\n  const fileName = path.split('/').pop()?.replace('.ts', '');\n  if (fileName) {\n    tools[fileName] = toolModules[path].default;\n  }\n}\n\nexport default {\n  ...common,\n  tools\n};`;
  fs.writeFileSync(path.join(baseDir, 'index.ts'), indexContent);
}

splitFile('zh');
splitFile('en');
console.log('Split completed successfully.');
