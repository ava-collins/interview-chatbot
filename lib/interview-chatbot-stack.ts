import * as cdk from "aws-cdk-lib";

import { AboutMeTable } from "./dynamodb-stack";
import { Construct } from "constructs";
import { InterviewChatbotLambdaFn } from "./chatbot-lambda";
import { SeedDynamodbLambda } from "./seed-lambda";

export class InterviewChatbotStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, `${InterviewChatbotLambdaFn.name}--${id}`, props);

    const aboutMeTable = new AboutMeTable(this, "AboutMeTableConstruct");

    const chatbotLambda = new InterviewChatbotLambdaFn(
      this,
      "ChatbotLambdaConstruct",
      aboutMeTable.table.tableName,
    );

    aboutMeTable.table.grantReadData(chatbotLambda.lambda);

    const seedLambda = new SeedDynamodbLambda(
      this,
      "SeedLambdaConstruct",
      aboutMeTable.table.tableName,
    );

    aboutMeTable.table.grantWriteData(seedLambda.lambda);

    // Create custom resource to execute seed lambda during stack deployment
    const customResourceProvider = new cdk.custom_resources.Provider(
      this,
      "SeedProvider",
      {
        onEventHandler: seedLambda.lambda,
      },
    );

    new cdk.CustomResource(this, "SeedResource", {
      serviceToken: customResourceProvider.serviceToken,
    });
  }
}
