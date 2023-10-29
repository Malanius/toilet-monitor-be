import { injectLambdaContext } from '@aws-lambda-powertools/logger';
import { captureLambdaHandler } from '@aws-lambda-powertools/tracer';
import middy from '@middy/core';
import httpErrorHandlerMiddleware from '@middy/http-error-handler';
import type { APIGatewayProxyHandler } from 'aws-lambda';

import { deviceAuthMiddleware } from '@common/device-auth-middleware';
import { DeviceContext } from '@common/device-context';
import { logger, tracer } from '@common/powertools';

const lambdaHandler: APIGatewayProxyHandler = async (
  _event,
  context: DeviceContext
) => {
  logger.info('Ping successful from valid API key.');
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello ${context.deviceName}!`,
    }),
  };
};

export const handler = middy(lambdaHandler)
  .use(captureLambdaHandler(tracer))
  .use(injectLambdaContext(logger, { clearState: true }))
  .use(deviceAuthMiddleware())
  .use(httpErrorHandlerMiddleware());
