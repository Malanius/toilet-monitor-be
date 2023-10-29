import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { Api } from './api/api.stack';
import { Database } from './database/database.stack';

import { AppInfo } from '@constants/app-info';

interface EnvStackProps extends AppInfo {}

export class EnvStacks extends Construct {
  constructor(scope: Construct, id: string, props: EnvStackProps) {
    super(scope, id);

    const { appName, appEnv } = props;

    new Database(this, 'database', {
      ...props,
      stackName: `${appName}-${appEnv}-database`,
      tags: {
        component: 'database',
      },
    });

    new Api(this, 'api', {
      ...props,
      stackName: `${appName}-${appEnv}-api`,
      tags: {
        component: 'api',
      },
    });

    cdk.Aspects.of(this).add(new cdk.Tag('project', appName));
    cdk.Aspects.of(this).add(new cdk.Tag('env', appEnv));
  }
}
