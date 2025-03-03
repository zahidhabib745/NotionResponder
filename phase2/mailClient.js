import {
    SESClient,
    SendEmailCommand,
    GetIdentityVerificationAttributesCommand,
    VerifyEmailIdentityCommand
} from '@aws-sdk/client-ses';   

export function createSES(credentials){

    if(!credentials){
        throw new Error("Please provide AWS credentials");
    }

    const client = new SESClient({
        credentials:{
            accessKeyId: credentials.Credentails.AccessKeyId,
            secretAccessKey: credentials.Credentails.secretAccessKey,
            sessionToken: credentials.Credentails.SessionToken
        }
    });

    return client;
}

export async function assessEmailVerification(client){  

    const response = await client.send(createGetIdentityVerificationAttributesCommand(emailAddress));

    if(response.VerificationAttributes && response.VerificationAttributes[emailAddress]){

        return response.VerificationAttributes[emailAddress];
    }

    return false;
}

export function assessVerificationStatus(verificationAttributes){

    if(verificationAttributes.VerificationStatus !== "Success" || verificationAttributes.VerificationStatus !== "Pending"){

        return false;
    }

    return true;
}

export async function verifyEmailAddress(client, emailAddress){

    await client.send(createVerifyEmailIdentityCommand(emailAddress));
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