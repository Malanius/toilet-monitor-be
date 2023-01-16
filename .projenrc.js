const { awscdk } = require('projen');
const { TrailingComma } = require('projen/lib/javascript');

const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.60.0',
  defaultReleaseBranch: 'main',
  name: 'toilet-monitor-be',
  github: false, // disable workflows for now
  license: 'MIT',
  authorName: 'Malanius Privierre',
  authorEmail: 'malaniusprivierre@gmail.com',

  lambdaOptions: {
    runtime: awscdk.LambdaRuntime.NODEJS_16_X,
    bundlingOptions: {
      externals: ['aws-sdk'],
      sourcemap: true,
    },
  },

  prettier: true,
  prettierOptions: {
    settings: {
      singleQuote: true,
      bracketSpacing: true,
      trailingComma: TrailingComma.ES5,
    },
    ignoreFiles: ['**/*.js', '!.projenrc.js', 'cdk.out/**'],
  },

  jest: true,
  jestOptions: {
    jestConfig: {
      testEnvironment: 'node',
    },
  },

  deps: [
    '@types/aws-lambda', // This has to be there so eslint doesn't complain on import
  ],

  devDeps: ['@types/aws-lambda', '@types/aws-sdk'],
});

project.synth();
