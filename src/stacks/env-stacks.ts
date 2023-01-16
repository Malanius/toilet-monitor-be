import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { AppInfo } from '../constants/app-info';

interface EnvStackProps extends AppInfo {}

class PlaceholderStact extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);
  }
}

export class EnvStacks extends Construct {
  constructor(scope: Construct, id: string, props: EnvStackProps) {
    super(scope, id);

    const { appName, appEnv } = props;

    new PlaceholderStact(this, 'placeholder', {
      stackName: `${appName}-${appEnv}-placeholder`,
      tags: {
        component: 'placeholder',
      },
    });

    cdk.Aspects.of(this).add(new cdk.Tag('project', appName));
    cdk.Aspects.of(this).add(new cdk.Tag('env', appEnv));
  }
}
