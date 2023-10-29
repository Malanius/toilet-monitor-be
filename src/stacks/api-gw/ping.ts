import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

import { PingFunction } from './ping-function';

import { commonLambdaFunctionProps } from '../../common/lambda-props';
import {
  powertoolsConfig,
  powertoolsLayerArn,
} from '../../common/powertools-config';
import { AppInfo } from '../../constants/app-info';

export interface PingProps extends AppInfo {
  api: apigateway.RestApi;
}

export class Ping extends Construct {
  constructor(scope: Construct, id: string, props: PingProps) {
    super(scope, id);

    const { appName, appEnv, api } = props;
    const region = cdk.Stack.of(this).region;
    const partition = cdk.Stack.of(this).partition;

    const powertoolsLayer = lambda.LayerVersion.fromLayerVersionArn(
      this,
      'PowertoolsLayer',
      powertoolsLayerArn(region)
    );

    const pingHandler = new PingFunction(this, 'PingHandler', {
      functionName: `${appName}-${appEnv}-ping`,
      ...commonLambdaFunctionProps,
      layers: [powertoolsLayer],
      environment: {
        ...powertoolsConfig(appName, appEnv, 'ping'),
      },
    });

    pingHandler.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['apigateway:GET'],
        resources: [`arn:${partition}:apigateway:${region}::/apikeys/*`],
      })
    );

    // /ping
    const pingResource = api.root.addResource('ping');
    const pingIntegration = new apigateway.LambdaIntegration(pingHandler, {
      allowTestInvoke: true,
      proxy: true,
    });
    pingResource.addMethod('GET', pingIntegration, {
      apiKeyRequired: true,
    });
  }
}
