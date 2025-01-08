import ejs from 'ejs';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function generatePortfolio(data) {
  const templateDir = path.join(__dirname, '../templates');
  const outputDir = path.join(process.cwd(), 'dist');

  await fs.ensureDir(outputDir);

  await fs.copy(
    path.join(templateDir, 'assets'),
    path.join(outputDir, 'assets'),
    { overwrite: true }
  );

  const template = await fs.readFile(
    path.join(templateDir, 'index.ejs'),
    'utf-8'
  );
  const html = ejs.render(template, data);

  await fs.writeFile(
    path.join(outputDir, 'index.html'),
    html
  );
}
