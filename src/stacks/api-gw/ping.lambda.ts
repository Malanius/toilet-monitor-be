import { APIGatewayProxyHandler } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (event, context) => {
  console.log('event', event);
  console.log('context', context);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello!',
      callingKey: event.headers['x-api-key'],
    }),
  };
};
