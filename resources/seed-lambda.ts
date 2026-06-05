import {
  DynamoDBDocumentClient,
  TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const dynamodb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const tableName = process.env.TABLE_NAME;

type QuestionType = {
  question: string;
  answer: string;
};

const questions: QuestionType[] = [
  {
    question: "How many years of JavaScript experience do you have?",
    answer: "14 years",
  },
  {
    question: "How many years of React experience do you have?",
    answer: "10 years",
  },
  {
    question: "How many years of node experience do you have?",
    answer: "6 years",
  },
];

export const handler = async () => {
  try {
    if (!tableName) {
      throw new Error("TABLE_NAME environment variable is not set");
    }

    await dynamodb.send(
      new TransactWriteCommand({
        TransactItems: questions.map((item) => ({
          Put: {
            TableName: tableName,
            Item: item,
            ConditionExpression: "attribute_not_exists(question)",
          },
        })),
      }),
    );

    return {
      statusCode: 200,
      body: "done",
    };
  } catch (e) {
    console.error(e);
    throw e;
  }
};
