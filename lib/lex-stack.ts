import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lex from "aws-cdk-lib/aws-lex";

import { Construct } from "constructs";

export class LexStack extends Construct {
  public readonly bot: lex.CfnBot;

  constructor(scope: Construct, id: string, lambdaArn: string) {
    super(scope, `${LexStack.name}-${id}`);

    const lexRole = new iam.Role(this, "LexRole", {
      assumedBy: new iam.ServicePrincipal("lex.amazonaws.com"),
    });

    lexRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaRole"),
    );

    this.bot = new lex.CfnBot(this, "LexBot", {
      name: "InterviewChatbot",
      roleArn: lexRole.roleArn,
      dataPrivacy: {
        ChildDirected: false,
      },
      idleSessionTtlInSeconds: 300,
      botLocales: [
        {
          localeId: "en_US",
          nluConfidenceThreshold: 0.4,
          intents: [
            {
              name: "AboutMeIntent",
              fulfillmentCodeHook: {
                enabled: true,
              },
              sampleUtterances: [
                {
                  utterance:
                    "How many years of JavaScript experience do you have?",
                },
                {
                  utterance: "How many years of React experience do you have?",
                },
                { utterance: "How many years of node experience do you have?" },
              ],
            },
            {
              name: "FallbackIntent",
              description: "Default fallback intent",
              parentIntentSignature: "AMAZON.FallbackIntent",
              fulfillmentCodeHook: { enabled: true },
            },
          ],
        },
      ],
      autoBuildBotLocales: true,
      testBotAliasSettings: {
        botAliasLocaleSettings: [
          {
            localeId: "en_US",
            botAliasLocaleSetting: {
              enabled: true,
              codeHookSpecification: {
                lambdaCodeHook: {
                  lambdaArn: lambdaArn,
                  codeHookInterfaceVersion: "1.0",
                },
              },
            },
          },
        ],
      },
    });

    const botVersion = new lex.CfnBotVersion(this, "InterviewChatbotVersion", {
      botId: this.bot.attrId,
      botVersionLocaleSpecification: [
        {
          localeId: "en_US",
          botVersionLocaleDetails: {
            sourceBotVersion: "DRAFT",
          },
        },
      ],
    });

    const botAlias = new lex.CfnBotAlias(this, "TestInterviewChatbotAlias", {
      botId: this.bot.attrId,
      botAliasName: "TestInterviewChatbotAlias",
      botVersion: botVersion.attrBotVersion,
      botAliasLocaleSettings: [
        {
          localeId: "en_US",
          botAliasLocaleSetting: {
            enabled: true,
            codeHookSpecification: {
              lambdaCodeHook: {
                codeHookInterfaceVersion: "1.0",
                lambdaArn: lambdaArn,
              },
            },
          },
        },
      ],
    });

    new cdk.CfnOutput(this, "LexBotAlias", {
      value: botAlias.attrBotAliasId,
      description: "Alias ID for Lex interview chatbot",
    });
  }
}
