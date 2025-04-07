export class Client {

    constructor(client){
        this.client = client;
    }

    async send(command){

        let result;

        try{

            result = await this.client.send(command);
        }catch(error){

            console.log("Error message: " + error);

            return {
                statusCode: 500,
                body: "Failed to send from client"
            }
        }

        return result;
    }
}