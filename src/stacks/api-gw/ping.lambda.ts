import { APIGatewayProxyHandler } from 'aws-lambda';
import { isValidApiKey } from '../../common/api-key-validation';

export const handler: APIGatewayProxyHandler = async (event, context) => {
  console.log('event', event);
  console.log('context', context);

  const callingKeyId = event.requestContext.identity.apiKeyId;
  const keyValidation = await isValidApiKey(callingKeyId);

  if (!keyValidation.isValid) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: keyValidation.message,
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello ${keyValidation.keyName}!`,
    }),
  };
};
