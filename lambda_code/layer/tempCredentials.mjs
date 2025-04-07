import {STSClient, AssumeRoleCommand} from "@aws-sdk/client-sts";

export function createRole(){

    console.log("Creating sts client");
    return new STSClient();
}

export function createAssumeRoleCommand(roleArn, roleSessionName){

    const params = {
        RoleArn: roleArn,
        RoleSessionName: roleSessionName
    }

    console.log("Creating assume role command: " + roleArn + " " + roleSessionName);
    return new AssumeRoleCommand(params);
}