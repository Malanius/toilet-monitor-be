import { awscdk } from 'projen';
import { TrailingComma } from 'projen/lib/javascript';

const cdkVersion = '2.62.2';

const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion,
  name: 'toilet-monitor-be',
  authorName: 'Malanius Privierre',
  authorEmail: 'malaniusprivierre@gmail.com',
  license: 'MIT',

  defaultReleaseBranch: 'main',
  github: false, // disable workflows for now
  projenrcTs: true,

  lambdaOptions: {
    runtime: awscdk.LambdaRuntime.NODEJS_16_X,
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
    // Theese has to be there so eslint doesn't complain on import in lambda functions
    '@aws-lambda-powertools/commons',
    '@aws-lambda-powertools/logger',
    '@aws-lambda-powertools/metrics',
    '@aws-lambda-powertools/tracer',
    '@middy/core',
    '@middy/http-error-handler',
    '@middy/util',
    '@types/aws-lambda',
    'aws-sdk',
  ],

  devDeps: [
    '@commitlint/cli@17.0.2',
    '@commitlint/config-conventional@17.0.2',
    'cz-conventional-changelog@3.3.0',
    'husky@8.0.1',
    'lint-staged@13.0.1',
  ],

  context: {
    // Defaults for new CDK 2.62.2 app
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
  },
});

const prettierIgnored = ['**/*.js', '!.projenrc.js', 'cdk.out/**'];
prettierIgnored.forEach((pattern) => {
  project.prettier?.addIgnorePattern(pattern);
});

project.synth();
