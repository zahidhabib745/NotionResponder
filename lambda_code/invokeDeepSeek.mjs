import { Client } from '/opt/nodejs/client.mjs';
import { createDatabase, createRecord, createPutCommand } from '/opt/nodejs/databaseClient.mjs';
import { getLLMResponse, createRequest } from '/opt/nodejs/invokeLLM.mjs';

export const handler = async (event) => {

    let response;

    //Here I am formatting the question to be passed to the LLM model
    let question = event.pathParameters.question;
    question = question.replace(/-/g, " ");
    question += "?";

    //Here I am sending the request to the LLM Model

    try{

        response = await getLLMResponse(createRequest(question, process.env.API_KEY));

        const dbClient = new Client(createDatabase());
        const record = createRecord("LLM_Responses", "id", question, response.choices[0].message.content);
        
        //After I have created the database client using the temporary credentials I am using it to insert the record to the database
        await dbClient.send(createPutCommand(record));
    }catch(error){


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