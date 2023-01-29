import { injectLambdaContext } from '@aws-lambda-powertools/logger';
import { captureLambdaHandler } from '@aws-lambda-powertools/tracer';
import middy from '@middy/core';
import { APIGatewayProxyHandler } from 'aws-lambda';

import { isValidApiKey } from '../../common/api-key-validation';
import { logger, tracer } from '../../common/powertools';

const lambdaHandler: APIGatewayProxyHandler = async (event, _context) => {
  const callingKeyId = event.requestContext.identity.apiKeyId;
  const keyValidation = await isValidApiKey(callingKeyId);

  if (!keyValidation.isValid) {
    logger.warn('Ping unsuccesful from invalid API key.');
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: keyValidation.message,
      }),
    };
  }

  logger.info('Ping successful from valid API key.');
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello ${keyValidation.keyName}!`,
    }),
  };
};

export const handler = middy(lambdaHandler)
  .use(captureLambdaHandler(tracer))
  .use(injectLambdaContext(logger, { clearState: true }));
