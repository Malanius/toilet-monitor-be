import { APIGateway } from 'aws-sdk';
import { logger, tracer } from './powertools';

const apiGateway = tracer.captureAWSClient(new APIGateway());

interface ValidationResponse {
  isValid: boolean;
}

interface KeyValidResponse extends ValidationResponse {
  isValid: true;
  keyName: string;
}

interface KeyInvalidResponse extends ValidationResponse {
  isValid: false;
  message: string;
}

export const isValidApiKey = async (
  callingKeyId: string | null
): Promise<KeyValidResponse | KeyInvalidResponse> => {
  if (!callingKeyId) {
    logger.warn('API key ID missing!');
    return {
      isValid: false,
      message: 'API key ID missing!',
    };
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
    throw new Error('Failed to load API key details!');
  }
  logger.appendKeys({ callingKeyName: keyDetails.name });

  if (!keyDetails.name.startsWith('toilet-')) {
    logger.warn(`Invalid key name, should start with 'toilet-'`);
    return {
      isValid: false,
      message: 'API key name invalid!',
    };
  }

  logger.debug('Key found and valid.');
  return {
    isValid: true,
    keyName: keyDetails.name,
  };
};
