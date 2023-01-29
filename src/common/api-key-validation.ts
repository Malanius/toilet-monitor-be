import { APIGateway } from 'aws-sdk';

const apiGateway = new APIGateway();

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
  console.log('Validating API key ID:', callingKeyId);

  if (!callingKeyId) {
    return {
      isValid: false,
      message: 'API key ID missing!',
    };
  }

  const keyDetails = await apiGateway
    .getApiKey({ apiKey: callingKeyId })
    .promise();

  // Need to check for undefined here because the API Gateway SDK doesn't
  // althoug key name is required when creating an API key.
  if (!keyDetails || !keyDetails.name) {
    throw new Error('Failed to load API key details!');
  }

  if (!keyDetails.name.startsWith('toilet-')) {
    return {
      isValid: false,
      message: 'API key name invalid!',
    };
  }

  return {
    isValid: true,
    keyName: keyDetails.name,
  };
};
