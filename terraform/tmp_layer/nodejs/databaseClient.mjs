import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand} from "@aws-sdk/lib-dynamodb";
import { createHash } from "crypto";

export function createDatabase(){

    const client = new DynamoDBClient();

    const documentClient = DynamoDBDocumentClient.from(client);

    console.log("Database client created");
    return documentClient;
}

export function createRecord(tableName, id, question, response){

    const record = {
         TableName: tableName,
         Item: {
             Id: createHash('sha256').update(id).digest('hex'),
             Question: question,
             Response: response
         }
    }

    console.log("Record created");
    return record;
}

export function createPutCommand(record){

    console.log("Put command created");
    return new PutCommand(record);
}

export function getRecentInsertion(record){

    console.log("Getting record from recent stream insertion");
    return record.Records[0].dynamodb["NewImage"];
}