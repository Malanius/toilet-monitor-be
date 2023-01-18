import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

import { PingFunction } from './ping-function';

import { AppInfo } from '../../constants/app-info';

export interface StackNameProps extends cdk.StackProps, AppInfo {}

export class ApiGw extends cdk.Stack {
  public readonly api: apigateway.RestApi;
  constructor(scope: Construct, id: string, props: StackNameProps) {
    super(scope, id, props);

    const { appName, appEnv } = props;
    const region = cdk.Stack.of(this).region;
    const partition = cdk.Stack.of(this).partition;

    const api = new apigateway.RestApi(this, 'api', {
      restApiName: `${appName}-${appEnv}`,
      endpointTypes: [apigateway.EndpointType.EDGE],
      apiKeySourceType: apigateway.ApiKeySourceType.HEADER,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
      deployOptions: {
        stageName: appEnv,
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        tracingEnabled: true,
      },
    });
    this.api = api;

    // API keys don't work without a usage plan
    const plan = api.addUsagePlan('ApiUsagePlan', {
      name: `${appName}-${appEnv}-usage-plan`,
    });

    plan.addApiStage({
      stage: api.deploymentStage,
    });

    const pingHandler = new PingFunction(this, 'PingHandler', {
      functionName: `${appName}-${appEnv}-ping`,
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
