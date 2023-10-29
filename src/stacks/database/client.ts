import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

let client: DynamoDBClient;

//signleton ddb client
export const getDdbClient = () => {
  if (!client) {
    client = new DynamoDBClient({});
  }
  return client;
};
