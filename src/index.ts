import fs from 'fs';
import path from 'path';

import _ from 'lodash';

import templateConfig from './template';

type BaseElementInfo = {
  name: string;
  convertedName: string;
  fileName: string;
}

type ElementInfo = BaseElementInfo & {
  siblings: Record<string, BaseElementInfo>;
}

export type GenerateElement = (element: ElementInfo) => string;

export type Config = Record<string, {
  dir: string;
  fileNameCase: FileNameCase;
  elements: {
    alias: string;
    generateElement: GenerateElement,
    fileNameExtension: string,
  }[];
}>;

function main() {
  const types = Object.keys(templateConfig);
  const type = process.argv[2];

  if (!type || !types.includes(type)) {
    const message = `Invalid type. Possible choices: ${types.join(', ')}.`;
    throw new Error(message);
  }

  const config = templateConfig[type];

  const arg = process.argv[3];

  if (!arg) {
    throw new Error('Name is required.')
  }

  const paths = arg.split('/');

  const name = paths.slice(-1)[0];
  const rest = paths.slice(0, -1);

  const convertedName = convertName(config.fileNameCase, name);
  const fileDir = path.join(__dirname, config.dir, ...rest, convertedName);

  if (fs.existsSync(fileDir)) {
    throw new Error('A component with that name already exists.');
  }

  fs.mkdirSync(fileDir, { recursive: true });

  const fileMap: Record<string, BaseElementInfo> = {};

  config.elements.forEach(element => {
    const fileName = `${convertedName}${element.fileNameExtension}`;

    fileMap[element.alias] = {
      name,
      convertedName,
      fileName,
    }
  });

  config.elements.forEach(currentElement => {
    const templateObj: ElementInfo = {
      ...fileMap[currentElement.alias],
      siblings: _.omit(fileMap, [currentElement.alias])
    };

    const fullPath = path.join(fileDir, fileMap[currentElement.alias].fileName);
    const content = currentElement.generateElement(templateObj);
    fs.writeFile(fullPath, content, {}, (err) => { if (err) throw err; });
  })
}

main();

type FileNameCase = 'firstUpper' | 'camel' | 'kebab' | 'snake' | 'upper' | 'lower';
function convertName(fileNameCase: FileNameCase, name: string) {
  if (fileNameCase === 'firstUpper') {
    return _.upperFirst(name);
  }

  return _[`${fileNameCase}Case`](name);
}
