import { Client } from '/opt/nodejs/client.mjs';
import { createDatabase, createRecord, createPutCommand } from '/opt/nodejs/databaseClient.mjs';
import { getLLMResponse, createRequest } from '/opt/nodejs/invokeLLM.mjs';

export const handler = async (event) => {

    let response;

    //Here I am formatting the question to be passed to the LLM model
    let question = event.pathParameters.question;
    question = question.replace(/-/g, " ");
    question += "?";

    console.log("Question: ", question);
    console.log("API Key: " + process.env.API_KEY);
    console.log("Database Role ARN: " + process.env.database_role_arn);
    console.log("Session Name: " + process.env.sessionName);

    //Here I am sending the request to the LLM Model

    try{

        response = await getLLMResponse(createRequest(question, process.env.API_KEY));
        console.log("Received response: " + JSON.stringify(response));

        const dbClient = new Client(createDatabase());
        const record = createRecord("LLM_Responses", "id", question, response.choices[0].message.content);
        console.log("Record: " + JSON.stringify(record));
        //After I have created the database client using the temporary credentials I am using it to insert the record to the database
        await dbClient.send(createPutCommand(record));
        console.log("Sent record to database");
    }catch(error){

        console.log("Error message handler: " + error);

        return {
            statusCode: 500,
            body: "Response failed to be generated"
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify(response.choices[0].message.content)
    }
}