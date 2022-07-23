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

export type Config = {
  dir: string;
  fileNameCase: FileNameCase;
  elements: {
    alias: string;
    generateElement: GenerateElement,
    fileNameExtension: string,
  }[];
};

function main() {
  const name = process.argv[2];

  if (!name) {
    throw new Error('Name is required.')
  }

  const convertedName = convertName(templateConfig.fileNameCase, name);
  const fileDir = path.join(__dirname, templateConfig.dir, convertedName);

  if (fs.existsSync(fileDir)) {
    throw new Error('A component with that name already exists.');
  }

  fs.mkdirSync(fileDir, { recursive: true });

  const fileMap: Record<string, BaseElementInfo> = {};

  templateConfig.elements.forEach(element => {
    const fileName = `${convertedName}${element.fileNameExtension}`;

    fileMap[element.alias] = {
      name,
      convertedName,
      fileName,
    }
  });

  templateConfig.elements.forEach(currentElement => {
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
