import fs from 'node:fs/promises';
import path from 'node:path';

(async function generateCache() {
  const files = await fs.readdir(
    path.resolve(process.cwd(), './public/sounds')
  );
  const audios = files.filter(
    (f) => path.extname(f) === '.wav' || path.extname(f) === '.mp3'
  );

  await fs.writeFile(
    path.resolve(process.cwd(), './public/cache.json'),
    JSON.stringify(audios),
    'utf8'
  );
})();
