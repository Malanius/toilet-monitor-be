import { injectLambdaContext } from '@aws-lambda-powertools/logger';
import { captureLambdaHandler } from '@aws-lambda-powertools/tracer';
import middy from '@middy/core';
import httpErrorHandlerMiddleware from '@middy/http-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import validator from '@middy/validator';
import { transpileSchema } from '@middy/validator/transpile';
import type { APIGatewayProxyHandler } from 'aws-lambda';

import { deviceAuthMiddleware } from '@common/device-auth-middleware';
import { DeviceContext } from '@common/device-context';
import { logger, tracer } from '@common/powertools';

const inputSchema = {
  type: 'object',
  required: ['body'],
  properties: {
    body: {
      type: 'object',
      required: ['status'],
      properties: {
        status: { enum: ['FREE', 'OCCUPIED'] },
      },
    },
  },
};

type StatusBody = {
  status: 'FREE' | 'OCCUPIED';
};

const lambdaHandler: APIGatewayProxyHandler = async (
  event,
  context: DeviceContext
) => {
  const { status } = event.body as unknown as StatusBody;
  logger.info(`Status of ${context.deviceName} changed to ${status}`);
  return {
    statusCode: 204,
    body: '',
  };
};

export const handler = middy(lambdaHandler)
  .use(captureLambdaHandler(tracer))
  .use(injectLambdaContext(logger, { clearState: true }))
  .use(deviceAuthMiddleware())
  .use(httpHeaderNormalizer())
  .use(httpEventNormalizer())
  .use(httpJsonBodyParser())
  .use(validator({ eventSchema: transpileSchema(inputSchema) }))
  .use(httpErrorHandlerMiddleware());
