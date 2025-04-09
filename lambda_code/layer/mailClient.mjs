import {
    SESClient,
    SendEmailCommand,
    GetIdentityVerificationAttributesCommand,
    VerifyEmailIdentityCommand
} from '@aws-sdk/client-ses';   

export function createSES(){

    const client = new SESClient();
    return client;
}

export async function assessVerificationAttributes(client, emailAddress){  

    const response = await client.send(createGetIdentityVerificationAttributesCommand(emailAddress));

    if(response.VerificationAttributes && response.VerificationAttributes[emailAddress]){

        return response.VerificationAttributes[emailAddress];
    }

    return false;
}

export function assessVerificationStatus(verificationAttributes){

    if(verificationAttributes.VerificationStatus !== "Success" && verificationAttributes.VerificationStatus !== "Pending"){

        return false;
    }

    return true;
}

export function assessEmailVerification(senderVerificationAttributes, recipientVerificationAttributes){     

    if(senderVerificationAttributes && recipientVerificationAttributes){
        
        if(assessVerificationStatus(senderVerificationAttributes) && assessVerificationStatus(recipientVerificationAttributes)){

            return true;
        }
    }

    return false;
}

export async function verifyEmailAddress(client, emailAddress){

    try{

        await client.send(createVerifyEmailIdentityCommand(emailAddress));
    }catch(error){

        throw new Error("Email address verification failed");
    }
}

export function createGetIdentityVerificationAttributesCommand(emailAddress){

    return new GetIdentityVerificationAttributesCommand({
        Identities: [emailAddress]
    });
}

export function createVerifyEmailIdentityCommand(emailAddress){

    return new VerifyEmailIdentityCommand({
        EmailAddress: emailAddress
    });
}

export function createEmail(sender, recipient, subject, body){
    
    const email = {
        Source: sender,
        Destination: {
            ToAddresses: [recipient]
        },
        Message: {
            Subject: {
                Data: subject
            },
            Body: {
                Text: {
                    Data: body
                }
            }
        }
    }

    return email;
}

export async function sendEmail(email, client){

    try{

        await client.send(createSendEmailCommand(email));
    }catch(error){
        
        throw new Error("Email failed to send email");
    }
}

export function createSendEmailCommand(email){

    return new SendEmailCommand(email);
}