import { MiddyLikeRequest } from '@aws-lambda-powertools/commons';
import { MiddlewareObj } from '@middy/core';
import { createError } from '@middy/util';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { APIGateway } from 'aws-sdk';
import { DeviceContext } from './device-context';

import { logger, tracer } from './powertools';

const apiGateway = tracer.captureAWSClient(new APIGateway());
const KEY_PREFIX = process.env.KEY_PREFIX || 'toilet-';

export const deviceAuthMiddleware = (): MiddlewareObj => {
  const validateKeyBefore = async (
    request: MiddyLikeRequest
  ): Promise<void> => {
    const event = request.event as APIGatewayProxyEvent;
    const callingKeyId = event.requestContext.identity.apiKeyId;
    if (!callingKeyId) {
      logger.warn('API key ID missing!');
      throw createError(401, 'API key ID missing!');
    }
    logger.appendKeys({ callingKeyId });

    logger.debug('Retrieving key ID info.');
    const keyDetails = await apiGateway
      .getApiKey({ apiKey: callingKeyId })
      .promise();

    // Need to check for undefined here because the API Gateway SDK doesn't
    // althoug key name is required when creating an API key.
    if (!keyDetails || !keyDetails.name) {
      logger.error('Failed to load API key details!');
      throw createError(500, 'Failed to load API key details!');
    }
    logger.appendKeys({ callingKeyName: keyDetails.name });

    if (!keyDetails.name.startsWith(KEY_PREFIX)) {
      logger.warn(`Invalid key name, should start with '${KEY_PREFIX}'`);
      throw createError(403, 'Key is not authorized for this service.');
    }
    logger.debug('Key found and valid.');

    const context = request.context as DeviceContext;
    context.deviceName = keyDetails.name;
  };

  return {
    before: validateKeyBefore,
  };
};
