import { test } from "@jest/globals";
import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";

import { InterviewChatbotStack } from "../lib/interview-chatbot-stack";

test("interview chatbot stack creates core resources", () => {
  const app = new cdk.App();

  const stack = new InterviewChatbotStack(app, "TestInterviewChatbotStack");
  const template = Template.fromStack(stack);

  template.resourceCountIs("AWS::DynamoDB::Table", 1);
  template.resourceCountIs("AWS::Lambda::Function", 3);
  template.resourceCountIs("AWS::CloudFormation::CustomResource", 1);
});
