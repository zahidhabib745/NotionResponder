import {
    SESClient,
    SendEmailCommand,
    GetIdentityVerificationAttributesCommand,
    VerifyEmailIdentityCommand
} from '@aws-sdk/client-ses';   

export function createSES(){

    const client = new SESClient();
    console.log("SES client created");
    return client;
}

export async function assessVerificationAttributes(client, emailAddress){  

    const response = await client.send(createGetIdentityVerificationAttributesCommand(emailAddress));

    if(response.VerificationAttributes && response.VerificationAttributes[emailAddress]){

        console.log("Email address verified");
        return response.VerificationAttributes[emailAddress];
    }

    console.log("Email address not verified"); 
    return false;
}

export function assessVerificationStatus(verificationAttributes){

    if(verificationAttributes.VerificationStatus !== "Success" && verificationAttributes.VerificationStatus !== "Pending"){

        console.log("Verification status not successful or pending");
        return false;
    }

    console.log("Verification status successful or pending");
    return true;
}

export function assessEmailVerification(senderVerificationAttributes, recipientVerificationAttributes){     

    if(senderVerificationAttributes && recipientVerificationAttributes){
        
        if(assessVerificationStatus(senderVerificationAttributes) && assessVerificationStatus(recipientVerificationAttributes)){

            console.log("Email verification successful, returning true");
            return true;
        }
    }

    console.log("Email verification failed, returning false");
    return false;
}

export async function verifyEmailAddress(client, emailAddress){

    try{

        await client.send(createVerifyEmailIdentityCommand(emailAddress));
        console.log("Email address verification initiated");    
    }catch(error){

        throw new Error("Email address verification failed");
    }
}

export function createGetIdentityVerificationAttributesCommand(emailAddress){

    console.log("Creating get identity verification attributes command");
    return new GetIdentityVerificationAttributesCommand({
        Identities: [emailAddress]
    });
}

export function createVerifyEmailIdentityCommand(emailAddress){

    console.log("Creating verify email identity command");
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

    console.log("Email created");
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

    console.log("Creating send email command");
    return new SendEmailCommand(email);
}