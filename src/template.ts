import { Config } from './types';

// React Component
const componentTemplate = (name: string, fileName: string) => `import * as React from 'react';

import styles from './${fileName}.module.scss';

type ${name}Props = {};

const ${name} = ({ }: ${name}Props) => {
  return <div class={styles.${name}}>${name} works!</div>;
};

export default ${name};
`;

// Styles
const stylesTemplate = (name: string) => `.${name} {}`;

// Test
const testTemplate = (name: string, fileName: string) => `import * as React from 'react';
import { render, screen } from '@testing-library/react';

import ${name} from './${fileName}';

describe('${name}', () => {
  it('renders', () => {
    render(<${name} />);

    expect(screen.getByText('${name}')).toBeInTheDocument();
  });
});

`;

const config: Config = {
  dir: 'src/components',
  fileNameCase: 'kebab',
  elements: [
    {
      template: componentTemplate,
      fileNameExtension: 'tsx',
    },
    {
      template: stylesTemplate,
      fileNameExtension: 'module.scss',
    },
    {
      template: testTemplate,
      fileNameExtension: 'ts',
    }
  ]
};

export default config;