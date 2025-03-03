import { Client } from './phase1/client.js';
import { createDatabase, createRecord, createPutCommand } from './phase1/databaseClient.js';
import { createRole, createAssumeRoleCommand } from './phase1/tempCredentials.js';
import { getLLMResponse, createRequest } from './phase1/invokeLLM.js';

export const handler = async (event) => {

    //Here I am formatting the question to be passed to the LLM model
    const question = event.pathParameters.question;
    question = question.replace(/-/g, " ");
    question += "?";

    //Here I am sending the request to the LLM Model
    const response = await getLLMResponse(createRequest(question, process.env.API_KEY));

    const stsClient = new Client(createRole());
    //After creating the STS client I am using it to create temporary credentials so I can make use of DynamoDB
    const assumedRoleCredentials = await stsClient.send(createAssumeRoleCommand("arn:aws:iam::123456789012:role/roleName", "roleSessionName"));

    const dbClient = new Client(createDatabase(assumedRoleCredentials));
    const record = createRecord("QuestionsDB", "id", question, response.choices[0].message.content);
    //After I have created the database client using the temporary credentials I am using it to insert the record to the database
    await dbClient.send(createPutCommand(record));

    return {
        statusCode: 200,
        body: JSON.stringify(response.choices[0].message.content)
    }
}