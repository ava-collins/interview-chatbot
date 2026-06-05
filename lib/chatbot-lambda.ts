import * as lambda from "aws-cdk-lib/aws-lambda";
import * as nodejs from "aws-cdk-lib/aws-lambda-nodejs";

import { Construct } from "constructs";

import path = require("path");

export class InterviewChatbotLambdaFn extends Construct {
  public readonly lambda: lambda.Function;

  constructor(scope: Construct, id: string, tableName: string) {
    super(scope, `${InterviewChatbotLambdaFn.name}--${id}`);

    this.lambda = new nodejs.NodejsFunction(this, "InterviewChatbotLambda", {
      runtime: lambda.Runtime.NODEJS_24_X,
      entry: path.join(__dirname, "../resources/chatbot-lambda.ts"),
      handler: "handler",
      environment: {
        TABLE_NAME: tableName,
      },
    });
  }
}
