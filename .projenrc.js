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

  context: {
    // Defaults for new CDK 2.60.0 app
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
    '@aws-cdk/aws-ecs:disableExplicitDeploymentControllerForCircuitBreaker': true,
    '@aws-cdk/aws-iam:importedRoleStackSafeDefaultPolicyName': true,
    '@aws-cdk/aws-s3:serverAccessLogsUseBucketPolicy': true,
    '@aws-cdk/customresources:installLatestAwsSdkDefault': false,
  },
});

project.synth();
