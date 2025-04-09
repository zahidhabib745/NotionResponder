import { getRecentInsertion } from '/opt/nodejs/databaseClient.mjs';
import { createSES, 
         assessEmailVerification, 
         assessVerificationAttributes, 
         verifyEmailAddress, 
         createEmail,
         sendEmail
       } from '/opt/nodejs/mailClient.mjs';
import { Client } from '/opt/nodejs/client.mjs';



export const handler = async (event) => {

    const sesClient = new Client(createSES());   

    const recentRecord = getRecentInsertion(event);

    const senderverificationAttributes = await assessVerificationAttributes(sesClient, process.env.sender_email_address);
    const recipientVerificationAttributes = await assessVerificationAttributes(sesClient, process.env.recipient_email_address);

    if(assessEmailVerification(senderverificationAttributes, recipientVerificationAttributes)){

        const response = `Here is the response to your question "${recentRecord.Question.S}": \n ${recentRecord.Response.S}`;

        const email = createEmail(process.env.sender_email_address, process.env.recipient_email_address, recentRecord.Question.S, response);

        try{

            await sendEmail(email, sesClient);
        }catch(error){
                
            console.log("Error message: " + error);

            return {
                statusCode: 500,
                body: "Email failed to be sent"
            }
        }
    }else{

        try{

            await verifyEmailAddress(sesClient, process.env.sender_email_address);
            await verifyEmailAddress(sesClient, process.env.recipient_email_address);
        }catch(error){

            return {
                statusCode: 500,
                body: "Email failed to be sent"
            }
        }
    }
}       