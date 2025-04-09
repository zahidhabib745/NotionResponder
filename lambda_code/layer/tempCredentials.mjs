import {STSClient, AssumeRoleCommand} from "@aws-sdk/client-sts";

export function createRole(){

    return new STSClient();
}

export function createAssumeRoleCommand(roleArn, roleSessionName){

    const params = {
        RoleArn: roleArn,
        RoleSessionName: roleSessionName
    }

    return new AssumeRoleCommand(params);
}