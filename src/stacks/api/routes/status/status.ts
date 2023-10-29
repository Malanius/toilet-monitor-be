import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

import { StatusFunction } from './status-function';

import { commonLambdaFunctionProps } from '@common/lambda-props';
import {
  powertoolsConfig,
  powertoolsLayerArn,
} from '@common/powertools-config';
import { AppInfo } from '@constants/app-info';

export interface StatusProps extends AppInfo {
  api: apigateway.RestApi;
}

export class Status extends Construct {
  constructor(scope: Construct, id: string, props: StatusProps) {
    super(scope, id);

    const { appName, appEnv, api } = props;
    const region = cdk.Stack.of(this).region;
    const partition = cdk.Stack.of(this).partition;

    const powertoolsLayer = lambda.LayerVersion.fromLayerVersionArn(
      this,
      'PowertoolsLayer',
      powertoolsLayerArn(region)
    );

    const statusHandler = new StatusFunction(this, 'StatusHandler', {
      functionName: `${appName}-${appEnv}-status`,
      ...commonLambdaFunctionProps,
      layers: [powertoolsLayer],
      environment: {
        ...powertoolsConfig(appName, appEnv, 'status'),
      },
    });

    statusHandler.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['apigateway:GET'],
        resources: [`arn:${partition}:apigateway:${region}::/apikeys/*`],
      })
    );

    // /status
    const statusResource = api.root.addResource('status');
    const statusIntegration = new apigateway.LambdaIntegration(statusHandler, {
      allowTestInvoke: true,
      proxy: true,
    });
    statusResource.addMethod('POST', statusIntegration, {
      apiKeyRequired: true,
    });
  }
}
