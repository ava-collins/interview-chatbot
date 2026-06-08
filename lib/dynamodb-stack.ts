import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

import { Construct } from "constructs";

export class AboutMeTable extends Construct {
  public readonly table: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    // Always prepend id with classname for better debugging
    super(scope, `${AboutMeTable.name}--${id}`);

    this.table = new dynamodb.Table(this, "AboutMeTable", {
      partitionKey: { name: "question", type: dynamodb.AttributeType.STRING },
      tableName: "AboutMeTable",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: cdk.aws_dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    new cdk.CfnOutput(this, "AboutMeTableName", {
      value: this.table.tableName,
      description: "Name of interview chatbot table",
    });
  }
}
