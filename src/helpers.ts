import _ from 'lodash';

import { Config } from './types';

export const transformers: Record<Config['fileNameCase'], (name: string) => string> = {
  'camel': _.camelCase,
  'kebab': _.kebabCase,
  'lower': _.lowerCase,
  'upper': _.upperCase,
  'snake': _.snakeCase,
};

export const errorHandler = (error: any) => {
  if (error) throw error;
};
