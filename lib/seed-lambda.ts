import * as lambda from "aws-cdk-lib/aws-lambda";
import * as nodejs from "aws-cdk-lib/aws-lambda-nodejs";

import { Construct } from "constructs";

import path = require("path");

export class SeedDynamodbLambda extends Construct {
  public readonly lambda: lambda.Function;

  constructor(scope: Construct, id: string, tableName: string) {
    super(scope, `${SeedDynamodbLambda.name}--${id}`);

    this.lambda = new nodejs.NodejsFunction(this, "SeedLambda", {
      runtime: lambda.Runtime.NODEJS_24_X,
      entry: path.join(__dirname, "../resources/seed-lambda.ts"),
      handler: "handler",
      environment: {
        TABLE_NAME: tableName,
      },
    });
  }
}
