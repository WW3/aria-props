const fs = require('fs');
const path = require('path');
const { validateDataset } = require('./validate-dataset-schema');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    ensureDir(dest);
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
    return;
  }
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function minifyHtml(html) {
  const preserve = [];
  let working = html.replace(/<(script|style|pre|textarea)\b[^>]*>[\s\S]*?<\/\1>/gi, (m) => {
    const key = `___BLOCK_${preserve.length}___`;
    preserve.push(m);
    return key;
  });

  working = working
    .replace(/<!--([\s\S]*?)-->/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\n{2,}/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/>\s+</g, '><')
    .trim();

  return working.replace(/___BLOCK_(\d+)___/g, (_, i) => preserve[Number(i)]);
}

function main() {
  const root = process.cwd();
  const dist = path.join(root, 'dist');
  const datasetPath = path.join(root, 'aria13-dataset.json');
  const indexPath = path.join(root, 'index.html');

  const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
  validateDataset(dataset);

  ensureDir(dist);
  ensureDir(path.join(dist, 'vendor'));

  const html = fs.readFileSync(indexPath, 'utf8');
  const minified = minifyHtml(html);
  fs.writeFileSync(path.join(dist, 'index.min.html'), minified);

  fs.copyFileSync(datasetPath, path.join(dist, 'aria13-dataset.json'));
  copyRecursive(path.join(root, 'vendor'), path.join(dist, 'vendor'));

  console.log('Release build complete: dist/index.min.html');
}

if (require.main === module) {
  main();
}
