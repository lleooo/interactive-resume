// Render resume-print/{en,zh}.html to one-page A4 PDFs with headless Chrome.
// Usage: npm run resume:pdf   (override the browser with CHROME_PATH=/path/to/chrome)
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const templateDir = join(root, 'resume-print');
const outDir = join(root, 'public', 'resume');

const targets = [
  { template: 'en.html', output: 'leo-liu-resume-en.pdf' },
  { template: 'zh.html', output: 'leo-liu-resume-zh.pdf' },
];

function findChrome() {
  if (process.env.CHROME_PATH) {
    if (!existsSync(process.env.CHROME_PATH)) {
      throw new Error(`CHROME_PATH does not exist: ${process.env.CHROME_PATH}`);
    }
    return process.env.CHROME_PATH;
  }
  const macPath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  if (existsSync(macPath)) return macPath;

  for (const name of ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser']) {
    const found = spawnSync('which', [name], { encoding: 'utf8' });
    if (found.status === 0 && found.stdout.trim()) return found.stdout.trim();
  }
  throw new Error('Chrome not found. Set CHROME_PATH to a Chrome/Chromium executable.');
}

const chrome = findChrome();
mkdirSync(outDir, { recursive: true });

for (const { template, output } of targets) {
  const input = pathToFileURL(join(templateDir, template)).href;
  const outFile = join(outDir, output);
  execFileSync(
    chrome,
    [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--allow-file-access-from-files',
      '--no-pdf-header-footer',
      '--run-all-compositor-stages-before-draw',
      `--print-to-pdf=${outFile}`,
      input,
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] },
  );
  if (!existsSync(outFile) || statSync(outFile).size === 0) {
    throw new Error(`Failed to generate ${outFile}`);
  }
  console.log(`✓ ${template} -> ${outFile.replace(`${root}/`, '')}`);
}
