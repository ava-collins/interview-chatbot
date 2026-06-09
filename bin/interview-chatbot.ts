#!/usr/bin/env node

import * as cdk from "aws-cdk-lib/core";

import { InterviewChatbotStack } from "../lib/interview-chatbot-stack";

const app = new cdk.App();
new InterviewChatbotStack(app, "InterviewChatbotStack", {
  env: { region: "us-east-1" },
});
