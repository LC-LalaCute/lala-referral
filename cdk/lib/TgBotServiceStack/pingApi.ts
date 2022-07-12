import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

const lambdasPath = join(__dirname, '../../src/lambdas');
const lambdasApiPath = join(lambdasPath, 'api');

interface PingApiProps {
  readonly pingTable: Table;
}

export class PingApi extends Construct {
  constructor(scope: Construct, id: string, props: PingApiProps) {
    const {pingTable} = props;
    super(scope, id);


    const lambdaProps: NodejsFunctionProps = {
      runtime: lambda.Runtime.NODEJS_16_X, 
      bundling: {
        externalModules: [
          'aws-sdk', 
        ],
      },
      depsLockFilePath: join(lambdasPath, 'package-lock.json'),
      environment: {
        TABLE_NAME: pingTable.tableName,
      },
    }

    const pingHandler = new NodejsFunction(this, "PingHandler", {
      ...lambdaProps,
      entry: join(lambdasApiPath, 'ping.ts'),
    });

    const api = new apigateway.RestApi(this, "ping-api", {
      restApiName: "Tg bot Service",
      description: "Testing"
    });

    const getWidgetsIntegration = new apigateway.LambdaIntegration(pingHandler);

    pingTable.grantReadWriteData(pingHandler);

    api.root.addMethod("GET", getWidgetsIntegration);
  }
}
