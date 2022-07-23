import fs from 'fs';
import path from 'path';

import templateConfig from './template';
import { transformers, errorHandler } from './helpers';

function main() {
  const name = process.argv[2];

  if (!name) {
    throw new Error('Name is required.')
  }

  const convertedName: string = transformers[templateConfig.fileNameCase](name);
  const fileDir = path.join(__dirname, templateConfig.dir, convertedName);

  if (fs.existsSync(fileDir)) {
    throw new Error('A component with that name already exists.');
  }

  fs.mkdirSync(fileDir, { recursive: true });

  templateConfig.elements.forEach(element => {
    const fileName = `${convertedName}.${element.fileNameExtension}`;
    const fullPath = path.join(fileDir, fileName)
    const content = element.template(name, convertedName);
    fs.writeFile(fullPath, content, {}, errorHandler);
  })
}

main();
