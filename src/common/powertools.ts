import { Logger } from '@aws-lambda-powertools/logger';
import { Tracer } from '@aws-lambda-powertools/tracer';

const defaultValues = {
  region: process.env.AWS_REGION || 'N/A',
  executionEnv: process.env.AWS_EXECUTION_ENV || 'N/A',
  appName: process.env.APP_NAME || 'N/A',
  appEnv: process.env.APP_ENV || 'N/A',
};

const logger = new Logger({
  persistentLogAttributes: {
    ...defaultValues,
  },
});

const tracer = new Tracer();

export { logger, tracer };
