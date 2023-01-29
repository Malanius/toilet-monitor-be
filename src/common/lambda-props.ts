import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as logs from 'aws-cdk-lib/aws-logs';

export const commonLambdaFunctionProps = {
  architecture: lambda.Architecture.ARM_64,
  memorySize: 128,
  tracing: lambda.Tracing.ACTIVE,
  insightsVersion: lambda.LambdaInsightsVersion.VERSION_1_0_135_0,
  logRetention: logs.RetentionDays.THREE_MONTHS,
};
