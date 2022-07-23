type FileConfig = {
  template: (name: string, fileName: string) => string,
  fileNameExtension: string,
}

export type Config = {
  dir: string;
  fileNameCase: 'camel' | 'kebab' | 'snake' | 'upper' | 'lower';
  elements: FileConfig[];
};