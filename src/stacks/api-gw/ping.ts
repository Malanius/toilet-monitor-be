import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

import { PingFunction } from './ping-function';

import { AppInfo } from '../../constants/app-info';
import { commonLambdaFunctionProps } from '../../common/lambda-props';

export interface PingProps extends AppInfo {
  api: apigateway.RestApi;
}

export class Ping extends Construct {
  constructor(scope: Construct, id: string, props: PingProps) {
    super(scope, id);

    const { appName, appEnv, api } = props;
    const region = cdk.Stack.of(this).region;
    const partition = cdk.Stack.of(this).partition;

    const pingHandler = new PingFunction(this, 'PingHandler', {
      functionName: `${appName}-${appEnv}-ping`,
      ...commonLambdaFunctionProps,
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
      passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
      requestTemplates: {
        'application/json': '{"statusCode": 200}',
      },
    });
    pingResource.addMethod('GET', pingIntegration, {
      apiKeyRequired: true,
      methodResponses: [
        {
          statusCode: '200',
        },
      ],
    });
  }
}
