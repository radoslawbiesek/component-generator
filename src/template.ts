import { Config, GenerateElement } from './index';

// Component
const generateComponent: GenerateElement = ({ name, siblings }) => `import * as React from 'react';

import styles from './${siblings.styles.fileName}';

type ${name}Props = {};

const ${name} = ({ }: ${name}Props) => {
  return <div class={styles.${name}}>${name} works!</div>;
};

export default ${name};
`;

// Styles
const generateStyles: GenerateElement = ({ name }) => `.${name} {}`;

// Test
const generateTest: GenerateElement = ({ name, siblings }) => `import * as React from 'react';
import { render, screen } from '@testing-library/react';

import ${siblings.component.name} from './${siblings.component.fileName}';

describe('${name}', () => {
  it('renders', () => {
    render(<${name} />);

    expect(screen.getByText('${name}')).toBeInTheDocument();
  });
});

`;

// Page Component
const generatePage: GenerateElement = ({ name }) => `import * as React from 'react';

const ${name} = () => {
  return <div>${name} works!</div>;
};

export default ${name};
`;

const config: Config = {
  component: {
    dir: 'src/components',
    fileNameCase: 'kebab',
    elements: [
      {
        alias: 'component',
        generateElement: generateComponent,
        fileNameExtension: '.tsx',
      },
      {
        alias: 'styles',
        generateElement: generateStyles,
        fileNameExtension: '.module.scss',
      },
      {
        alias: 'test',
        generateElement: generateTest,
        fileNameExtension: '.test.ts',
      }
    ]
  },
  page: {
    dir: 'src/pages',
    fileNameCase: 'kebab',
    elements: [
      {
        alias: 'page',
        generateElement: generatePage,
        fileNameExtension: '.tsx',
      },
    ]
  }
};

export default config;
