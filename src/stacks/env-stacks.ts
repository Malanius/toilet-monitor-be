import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { ApiGw } from './api-gw/api-gw-stack';
import { Database } from './database/database';

import { AppInfo } from '../constants/app-info';

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

    new ApiGw(this, 'api-gw', {
      ...props,
      stackName: `${appName}-${appEnv}-api-gw`,
      tags: {
        component: 'api-gw',
      },
    });

    cdk.Aspects.of(this).add(new cdk.Tag('project', appName));
    cdk.Aspects.of(this).add(new cdk.Tag('env', appEnv));
  }
}
