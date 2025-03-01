import {STSClient, AssumeRoleCommand} from "@aws-sdk/client-sts";

export function createRole(){

    return new STSClient();
}

export function createAssumeRoleCommand(roleArn, roleSessionName){

    return new AssumeRoleCommand(roleArn, roleSessionName);
}