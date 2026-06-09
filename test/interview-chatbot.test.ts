import * as cdk from "aws-cdk-lib";

import { InterviewChatbotStack } from "../lib/interview-chatbot-stack";
import { Template } from "aws-cdk-lib/assertions";
import { test } from "@jest/globals";

test("interview chatbot stack creates core resources", () => {
  const app = new cdk.App();

  const stack = new InterviewChatbotStack(app, "TestInterviewChatbotStack");
  const template = Template.fromStack(stack);

  template.resourceCountIs("AWS::DynamoDB::Table", 1);
  template.resourceCountIs("AWS::Lambda::Function", 3);
  template.resourceCountIs("AWS::CloudFormation::CustomResource", 1);
  template.resourceCountIs("AWS::Logs::LogGroup", 2);
  template.resourceCountIs("AWS::IAM::Role", 4);
  template.resourceCountIs("AWS::IAM::Policy", 3);
  template.resourceCountIs("AWS::Lambda::Permission", 1);
  template.resourceCountIs("AWS::CloudFormation::CustomResource", 1)
  template.resourceCountIs("AWS::Lex::Bot", 1)
  template.resourceCountIs("AWS::Lex::BotVersion", 1)
  template.resourceCountIs("AWS::Lex::BotAlias", 1)
});
