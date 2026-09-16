const fs = require('fs');
const path = require('path');

function replaceAlertsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  if (!content.includes('alert(')) return;

  // Determine relative path to src/utils/alerts
  const srcPath = path.resolve('src');
  const dirPath = path.dirname(path.resolve(filePath));
  let relPath = path.relative(dirPath, path.join(srcPath, 'utils/alerts'));
  if (!relPath.startsWith('.')) relPath = './' + relPath;
  relPath = relPath.replace(/\\/g, '/'); // Windows fix

  // Insert import if not exists
  if (!content.includes('showAlert')) {
    const importStmt = `import { showAlert } from '${relPath}';\n`;
    // Add import after other imports
    const importMatch = content.match(/import .*?;?\n/g);
    if (importMatch) {
      const lastImport = importMatch[importMatch.length - 1];
      content = content.replace(lastImport, lastImport + importStmt);
    } else {
      content = importStmt + content;
    }
  }

  // Replace alert('...')
  // Success heuristic: 'éxito', 'exitosamente', 'agregado', 'completada'
  // Others default to error
  const alertRegex = /alert\((.*?)\);?/g;
  content = content.replace(alertRegex, (match, p1) => {
    const p1Lower = p1.toLowerCase();
    if (p1Lower.includes('éxito') || p1Lower.includes('exito') || p1Lower.includes('exitosamente') || p1Lower.includes('agregado') || p1Lower.includes('completada') || p1Lower.includes('exportada') || p1Lower.includes('eliminado')) {
      return `showAlert.success('¡Listo!', ${p1});`;
    } else {
      return `showAlert.error('Aviso', ${p1});`;
    }
  });

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Replaced alerts in ' + filePath);
}

function walk(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      walk(file);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      replaceAlertsInFile(file);
    }
  });
}

walk('src');
