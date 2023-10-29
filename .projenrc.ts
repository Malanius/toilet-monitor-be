import { awscdk } from 'projen';
import { TrailingComma } from 'projen/lib/javascript';

const cdkVersion = '2.103.1';
const powertoolsVersion = '1.14.0';

const project = new awscdk.AwsCdkTypeScriptApp({
  name: 'toilet-monitor-be',
  authorName: 'Malanius Privierre',
  authorEmail: 'malaniusprivierre@gmail.com',
  license: 'MIT',

  cdkVersion,
  cdkVersionPinning: true,

  defaultReleaseBranch: 'main',
  github: false, // disable workflows for now
  projenrcTs: true,

  lambdaOptions: {
    runtime: awscdk.LambdaRuntime.NODEJS_18_X,
    bundlingOptions: {
      externals: [
        '@aws-lambda-powertools/commons',
        '@aws-lambda-powertools/logger',
        '@aws-lambda-powertools/metrics',
        '@aws-lambda-powertools/tracer',
        'aws-sdk',
      ],
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
  },

  jest: true,
  jestOptions: {
    jestConfig: {
      testEnvironment: 'node',
    },
  },

  scripts: {
    precommit: 'lint-staged',
    prepare: 'husky install',
  },

  deps: [
    '@middy/core',
    '@middy/http-error-handler',
    '@middy/util',
    '@aws-sdk/client-api-gateway',
    `@aws-lambda-powertools/commons@${powertoolsVersion}`,
    `@aws-lambda-powertools/logger@${powertoolsVersion}`,
    `@aws-lambda-powertools/metrics@${powertoolsVersion}`,
    `@aws-lambda-powertools/tracer@${powertoolsVersion}`,
  ],

  devDeps: [
    '@commitlint/cli@17.0.2',
    '@commitlint/config-conventional@17.0.2',
    '@types/aws-lambda',
    'cz-conventional-changelog@3.3.0',
    'husky@8.0.1',
    'lint-staged@13.0.1',
  ],

  // Defaults for new CDK 2.83.0 app
  context: {
    '@aws-cdk/aws-lambda:recognizeLayerVersion': true,
    '@aws-cdk/core:checkSecretUsage': true,
    '@aws-cdk/core:target-partitions': ['aws', 'aws-cn'],
    '@aws-cdk-containers/ecs-service-extensions:enableDefaultLogDriver': true,
    '@aws-cdk/aws-ec2:uniqueImdsv2TemplateName': true,
    '@aws-cdk/aws-ecs:arnFormatIncludesClusterName': true,
    '@aws-cdk/aws-iam:minimizePolicies': true,
    '@aws-cdk/core:validateSnapshotRemovalPolicy': true,
    '@aws-cdk/aws-codepipeline:crossAccountKeyAliasStackSafeResourceName': true,
    '@aws-cdk/aws-s3:createDefaultLoggingPolicy': true,
    '@aws-cdk/aws-sns-subscriptions:restrictSqsDescryption': true,
    '@aws-cdk/aws-apigateway:disableCloudWatchRole': true,
    '@aws-cdk/core:enablePartitionLiterals': true,
    '@aws-cdk/aws-events:eventsTargetQueueSameAccount': true,
    '@aws-cdk/aws-iam:standardizedServicePrincipals': true,
    '@aws-cdk/aws-ecs:disableExplicitDeploymentControllerForCircuitBreaker':
      true,
    '@aws-cdk/aws-iam:importedRoleStackSafeDefaultPolicyName': true,
    '@aws-cdk/aws-s3:serverAccessLogsUseBucketPolicy': true,
    '@aws-cdk/aws-route53-patters:useCertificate': true,
    '@aws-cdk/customresources:installLatestAwsSdkDefault': false,
    '@aws-cdk/aws-rds:databaseProxyUniqueResourceName': true,
    '@aws-cdk/aws-codedeploy:removeAlarmsFromDeploymentGroup': true,
    '@aws-cdk/aws-apigateway:authorizerChangeDeploymentLogicalId': true,
    '@aws-cdk/aws-ec2:launchTemplateDefaultUserData': true,
    '@aws-cdk/aws-secretsmanager:useAttachedSecretResourcePolicyForSecretTargetAttachments':
      true,
    '@aws-cdk/aws-redshift:columnId': true,
    '@aws-cdk/aws-stepfunctions-tasks:enableEmrServicePolicyV2': true,
    '@aws-cdk/aws-ec2:restrictDefaultSecurityGroup': true,
    '@aws-cdk/aws-apigateway:requestValidatorUniqueId': true,
    '@aws-cdk/aws-kms:aliasNameRef': true,
  },
});

const prettierIgnored = ['**/*.js', '!.projenrc.js', 'cdk.out/**'];
prettierIgnored.forEach((pattern) => {
  project.prettier?.addIgnorePattern(pattern);
});

project.synth();
