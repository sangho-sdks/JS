import fs from 'node:fs';
import path from 'node:path';

function generateTree(dir, prefix = '', isRoot = true, parentDir = '') {
  const items = fs.readdirSync(dir);
  const ignoredFolders = new Set([
    'node_modules', 
    '.pnpm-store',
    '.git', 
    'dist', 
    '__pycache__',
    'LC_MESSAGES',
    '.venv',
    'venv',
    '.env',
    'staticfiles',
    'media',
    '.idea',
    '.vscode',
    'commands'
  ]);
  
  const folders = items.filter(item => {
    const fullPath = path.join(dir, item);
    return fs.statSync(fullPath).isDirectory() && 
           !ignoredFolders.has(item);
  });
  
  // Déterminer quels fichiers afficher
  const currentDirName = path.basename(dir);
  const files = items.filter(item => {
    const fullPath = path.join(dir, item);
    if (!fs.statSync(fullPath).isFile()) return false;
    
    if (isRoot) return true;
    
    if (currentDirName === 'frontend' || currentDirName === 'backend') {
      return true;
    }
    
    const lowerItem = item.toLowerCase();
    return lowerItem.includes('main') || lowerItem.includes('app');
  });

  let result = '';
  
  // Afficher les dossiers d'abord
  for (let index = 0; index < folders.length; index++) {
    const folder = folders[index];
    const isLast = index === folders.length - 1 && files.length === 0;
    result += `${prefix}${isLast ? '└── ' : '├── '}${folder}/\n`;
    
    const newPrefix = prefix + (isLast ? '    ' : '│   ');
    result += generateTree(path.join(dir, folder), newPrefix, false, currentDirName);
  }
  
  // Afficher les fichiers à la fin
  for (let index = 0; index < files.length; index++) {
    const file = files[index];
    const isLast = index === files.length - 1;
    result += `${prefix}${isLast ? '└── ' : '├── '}${file}\n`;
  }
  
  return result;
}

console.log(generateTree('.'));