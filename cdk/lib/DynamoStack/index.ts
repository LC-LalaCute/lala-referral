import { CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';


export class DynamoStack extends Stack {
  pingTable: Table;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.pingTable = new Table(this, 'ping-items', {
      partitionKey: {
        name: 'itemId',
        type: AttributeType.STRING
      },
      tableName: 'ping-items',
      removalPolicy: RemovalPolicy.DESTROY,
    });


    this.exportValue(this.pingTable.tableArn);
  }
}
