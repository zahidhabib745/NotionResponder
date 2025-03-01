import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand} from "@aws-sdk/lib-dynamodb";
import { createHash } from "crypto";

export function createDatabase(credentials){

    if(!credentials){
        throw new Error("Please provide AWS credentials");
    }
    
    const client = new DynamoDBClient({
        credentials:{
            accessKeyId: credentials.Credentials.AccessKeyId,
            secretAccessKey: credentials.Credentials.SecretAccessKey,
            sessionToken: credentials.Credentials.SessionToken    
        }
    });

    const documentClient = DynamoDBDocumentClient.from(client);

    return documentClient;
}

export function createRecord(tableName, id, question, response){

    const record = {
         TableName: tableName,
         Item: {
             ResponseId: createHash('sha256').update(id).digest('hex'),
             question: question,
             response: response
         }
    }

    return record;
}

export function createPutCommand(record){

    return new PutCommand(record);
}