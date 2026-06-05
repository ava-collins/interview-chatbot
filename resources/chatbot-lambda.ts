import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const dynamodb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const tableName = process.env.TABLE_NAME;

type LexEvent = {
  inputTranscript?: string;
  sessionState: {
    intent: {
      name: string;
    };
  };
};

type AboutMeItem = {
  question?: string;
  answer?: string;
};

function closeResponse(
  event: LexEvent,
  state: "Fulfilled" | "Failed",
  message: string,
) {
  return {
    sessionState: {
      dialogAction: { type: "Close" },
      intent: {
        name: event.sessionState.intent.name,
        state,
      },
    },
    messages: [{ contentType: "PlainText", content: message }],
  };
}

export const handler = async (event: LexEvent) => {
  try {
    if (!tableName) {
      throw new Error("TABLE_NAME environment variable is not set");
    }
    const userQuestion = event.inputTranscript?.toLocaleLowerCase() ?? "";

    const response = await dynamodb.send(
      // reads every item in table, only use for small datasets
      new ScanCommand({
        TableName: tableName,
      }),
    );

    const items = (response.Items ?? []) as AboutMeItem[];

    for (const item of items) {
      if (userQuestion === item.question?.toLowerCase()) {
        return closeResponse(
          event,
          "Fulfilled",
          item.answer ?? "No answer configured",
        );
      }
    }
    return closeResponse(
      event,
      "Fulfilled",
      `I'm sorry, I could not find an answer to your question`,
    );
  } catch (e) {
    console.error(`Error ${JSON.stringify(e)}`);

    return closeResponse(
      event,
      "Failed",
      "An error occurred while processing your request",
    );
  }
};
