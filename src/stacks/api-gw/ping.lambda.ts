import assert from 'assert';

import { APIGatewayProxyHandler } from 'aws-lambda';
import { APIGateway } from 'aws-sdk';

const apiGateway = new APIGateway();

export const handler: APIGatewayProxyHandler = async (event, context) => {
  console.log('event', event);
  console.log('context', context);

  // TODO: exvtract key conversion to a separate function
  const callingKeyId = event.requestContext.identity.apiKeyId;
  // TODO: replace asserts with proper validation
  assert(callingKeyId, 'API key ID missing!');
  console.log('callingKeyId', callingKeyId);

  const keyDetails = await apiGateway
    .getApiKey({ apiKey: callingKeyId })
    .promise();

  console.log('keyDetails', keyDetails);

  // TODO: replace asserts with proper validation
  assert(keyDetails, 'API key details missing!');
  assert(keyDetails.name, 'API key name missing!');
  assert(keyDetails.name.startsWith('toilet-'), 'API key name invalid!');

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello ${keyDetails.name}!`,
    }),
  };
};
