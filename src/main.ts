import { App } from 'aws-cdk-lib';

import { PROJECT, supportedEnvs } from './constants/app-info';
import { EnvStacks } from './stacks/env-stacks';

const app = new App();

supportedEnvs.forEach((appEnv) => {
  new EnvStacks(app, appEnv, {
    appName: PROJECT,
    appEnv,
  });
});

app.synth();
