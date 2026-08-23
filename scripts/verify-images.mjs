import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const publicDir = path.join(root, 'public');
const imageDir = path.join(publicDir, 'images');
const sourceRoots = [path.join(root, 'src'), path.join(root, 'index.html')];

const failures = [];
const warnings = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const stat = fs.statSync(dir);
  if (stat.isFile()) return [dir];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const imageFiles = walk(imageDir);
if (!imageFiles.length) failures.push('public/images is missing or empty.');

for (const file of imageFiles) {
  const rel = path.relative(root, file).replaceAll('\\', '/');
  const name = path.basename(file);
  const ext = path.extname(file).toLowerCase();

  if (/watermark|watermarked/i.test(name)) {
    failures.push(`Watermarked asset found: ${rel}`);
  }
  if (ext !== '.webp') {
    failures.push(`Non-WebP asset found in public/images: ${rel}`);
  }
  if (fs.statSync(file).size === 0) {
    failures.push(`Empty image file: ${rel}`);
  }
}

const sourceFiles = sourceRoots.flatMap((target) => walk(target)).filter((file) =>
  /\.(tsx?|jsx?|html)$/.test(file),
);

const referenced = new Set();
const imagePathRegex = /["'`](\/images\/[^"'`?#\s)]+)["'`]/g;

for (const file of sourceFiles) {
  const text = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = imagePathRegex.exec(text))) {
    referenced.add(match[1]);
  }
}

for (const webPath of [...referenced].sort()) {
  const diskPath = path.join(publicDir, webPath.replace(/^\//, ''));
  if (!fs.existsSync(diskPath)) {
    failures.push(`Broken image reference: ${webPath}`);
  }
}

const manifest = path.join(root, 'src', 'config', 'images.ts');
if (fs.existsSync(manifest)) {
  const text = fs.readFileSync(manifest, 'utf8');
  const templateRegex = /\$\{BASE\}(\/[^`]+?\.(?:webp|png|jpe?g|jfif))/gi;
  let match;
  while ((match = templateRegex.exec(text))) {
    const webPath = `/images${match[1]}`;
    referenced.add(webPath);
    const diskPath = path.join(publicDir, webPath.replace(/^\//, ''));
    if (!fs.existsSync(diskPath)) failures.push(`Broken image manifest reference: ${webPath}`);
  }
}

const referencedFiles = new Set([...referenced].map((p) => p.replace(/^\/images\//, '')));
for (const file of imageFiles) {
  const rel = path.relative(imageDir, file).replaceAll('\\', '/');
  if (!referencedFiles.has(rel)) warnings.push(`Unused image: /images/${rel}`);
}

console.log(`Image audit: ${imageFiles.length} assets, ${referenced.size} referenced paths.`);
if (warnings.length) {
  console.log(`Warnings (${warnings.length}):`);
  for (const warning of warnings) console.log(`- ${warning}`);
}

if (failures.length) {
  console.error(`Failures (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Image audit passed: no broken references, watermarked files, empty files, or legacy image formats.');
