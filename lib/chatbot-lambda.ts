import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as logs from "aws-cdk-lib/aws-logs";
import * as nodejs from "aws-cdk-lib/aws-lambda-nodejs";

import { Construct } from "constructs";

import path = require("path");

export class InterviewChatbotLambdaFn extends Construct {
  public readonly lambda: lambda.Function;

  constructor(scope: Construct, id: string, tableName: string) {
    super(scope, `${InterviewChatbotLambdaFn.name}--${id}`);

    const chatbotLogGroup = new logs.LogGroup(
      this,
      "InterviewChatbotLambdaLogGroup",
      {
        logGroupName: "interviewChatbotLogs",
        retention: logs.RetentionDays.ONE_MONTH,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      },
    );

    this.lambda = new nodejs.NodejsFunction(this, "InterviewChatbotLambda", {
      runtime: lambda.Runtime.NODEJS_24_X,
      architecture: lambda.Architecture.ARM_64,
      memorySize: 128,
      timeout: cdk.Duration.seconds(10),
      entry: path.join(__dirname, "../resources/chatbot-lambda.ts"),
      handler: "handler",
      logGroup: chatbotLogGroup,
      environment: {
        TABLE_NAME: tableName,
      },
    });
  }
}
