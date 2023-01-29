import { MiddyLikeRequest } from '@aws-lambda-powertools/commons';
import { MiddlewareObj } from '@middy/core';
import { createError } from '@middy/util';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { APIGateway } from 'aws-sdk';
import { DeviceContext } from './device-context';

import { logger, tracer } from './powertools';

const apiGateway = tracer.captureAWSClient(new APIGateway());
const KEY_PREFIX = process.env.KEY_PREFIX || 'toilet-';

// TODO: maybe figure out a way to use middy cache instead of this?
//    Documentation on this is missing, so probably would have to reverse engineer that.
const cachedKeys: { [key: string]: string } = {};

const fetchApiKey = async (callingKeyId: string): Promise<string> => {
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

  cachedKeys[callingKeyId] = keyDetails.name;
  return keyDetails.name;
};

export const deviceAuthMiddleware = (): MiddlewareObj => {
  const validateKeyBefore = async (
    request: MiddyLikeRequest
  ): Promise<void> => {
    const event = request.event as APIGatewayProxyEvent;
    const callingKeyId = event.requestContext.identity.apiKeyId;
    if (!callingKeyId) {
      // This should not happen behind API GW as endpoinds should have API key required
      // but may on direct invoke or test invoke without proper payload.
      logger.warn('API key ID missing!');
      throw createError(401, 'API key ID missing!');
    }
    logger.appendKeys({ callingKeyId });

    let keyName = cachedKeys[callingKeyId];
    if (!keyName) {
      keyName = await fetchApiKey(callingKeyId);
    }
    logger.appendKeys({ callingKeyName: keyName });

    if (!keyName.startsWith(KEY_PREFIX)) {
      logger.warn(`Invalid key name, should start with '${KEY_PREFIX}'`);
      throw createError(403, 'Key is not authorized for this service.');
    }
    logger.debug('Key found and valid.');

    const context = request.context as DeviceContext;
    context.deviceName = keyName;
  };

  return {
    before: validateKeyBefore,
  };
};
