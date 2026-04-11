const fs = require('fs');
const path = require('path');

function processFile(content) {
    // 2. Convert import x from 'y'
    content = content.replace(/import\s+(\w+)\s+from\s+['"]([^'"]+)['"];?/g, 'const $1 = require("$2");');
    
    // 3. Convert import { x, y } from 'z'
    content = content.replace(/import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"];?/g, 'const {$1} = require("$2");');
    
    // 4. Convert export default x
    content = content.replace(/export\s+default\s+(\w+);?/g, 'module.exports = $1;');
    
    // 5. Convert export const x = ...
    content = content.replace(/export\s+const\s+(\w+)\s*=/g, 'exports.$1 =');
    
    // Also handle export { x, y }; at the end of files if they exist
    // Not explicitly seen, but just in case
    return content;
}

const basePath = `c:\\3Y2S Hostel managment\\Bagaya Payment\\Backend\\src`;
const destPath = `c:\\3Y2S Hostel managment\\Backend`;

const mapping = [
  { src: 'models', dest: 'Model' },
  { src: 'controllers', dest: 'Controlers' },
  { src: 'routes', dest: 'Route' },
  { src: 'middleware', dest: 'Middleware' },
  { src: 'services', dest: 'services' },
  { src: 'utils', dest: 'utils' }
];

mapping.forEach(m => {
  const dirPath = path.join(basePath, m.src);
  const targetPath = path.join(destPath, m.dest);
  
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }

  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
      if (file.endsWith('.js')) {
        let content = fs.readFileSync(path.join(dirPath, file), 'utf8');
        content = processFile(content);
        
        // fix relative paths
        content = content.replace(/\.\.\/models\//g, '../Model/');
        content = content.replace(/\.\.\/controllers\//g, '../Controlers/');
        content = content.replace(/\.\.\/routes\//g, '../Route/');
        content = content.replace(/\.\.\/middleware\//g, '../Middleware/');
        
        fs.writeFileSync(path.join(targetPath, file), content);
        console.log(`Copied and converted: ${file} -> ${targetPath}`);
      }
    });
  }
});
