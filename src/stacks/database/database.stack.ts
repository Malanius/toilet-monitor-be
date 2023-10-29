import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

import { AppEnv, AppInfo } from '@constants/app-info';

export interface DatabaseProps extends cdk.StackProps, AppInfo {}

export class Database extends cdk.Stack {
  public readonly table: dynamodb.Table;
  constructor(scope: Construct, id: string, props: DatabaseProps) {
    super(scope, id, props);

    const { appEnv } = props;

    this.table = new dynamodb.Table(this, 'Table', {
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      deletionProtection: appEnv === AppEnv.PROD,
      removalPolicy:
        appEnv === AppEnv.DEV
          ? cdk.RemovalPolicy.DESTROY
          : cdk.RemovalPolicy.RETAIN,
    });

    this.table.addGlobalSecondaryIndex({
      indexName: 'gsi1pk-gsi1sk-index',
      partitionKey: { name: 'gsi1pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'gsi1sk', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });
  }
}
