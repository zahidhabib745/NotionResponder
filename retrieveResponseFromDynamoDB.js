import { getRecentInsertion } from './phase1/databaseClient.js';
import { createSES, 
         assessEmailVerification, 
         assessVerificationStatus, 
         verifyEmailAddress, 
         createEmail,
         sendEmail
       } from './phase2/mailClient.js';
import { Client } from './phase1/client.js';
import { createRole, createAssumeRoleCommand } from './phase1/tempCredentials.js';

export const handler = async (event) => {
    
    const stsClient = new Client(createRole());
    const credentials = await stsClient.send(createAssumeRoleCommand());//Need to put ARN and session name

    const sesClient = new Client(createSES(credentials));   

    const recentRecord = getRecentInsertion(event);
    const verificationAttributes = await assessEmailVerification(sesClient);

    if(verificationAttributes){

        if(assessVerificationStatus(verificationAttributes)){

            const response = `Here is the response to you question: \n ${recentRecord.response}`;

            const email = createEmail(recentRecord.emailAddress, recentRecord.emailAddress, recentRecord.question, response);
            await sendEmail(email, sesClient);
        }else{

            await verifyEmailAddress(sesClient, recentRecord.emailAddress);
        }
    }
}       