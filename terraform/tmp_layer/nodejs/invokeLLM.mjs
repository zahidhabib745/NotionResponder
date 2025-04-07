export async function getLLMResponse(request){

    console.log("Request: " + JSON.stringify(request)); 

    let response;

    try{     

        response = await fetch("https://openrouter.ai/api/v1/chat/completions", request);

        if(response.status != 200){

            throw new Error(`Error: ${response.status}`); 
        }

        console.log("Response: " + JSON.stringify(response));
    }catch(error){

        console.log("Error message: " + error);

        return {
            statusCode: 500,
            body: "Response failed to be generated"
        }
    }

    console.log("Still in getLLMResponse: " + JSON.stringify(response));
    return response.json();
}

export function createRequest(question, apiKey){
    
    const request = {
        method: "POST",
        headers: {
            "authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": "deepseek/deepseek-chat:free",
            "messages": [{role: "user", content: question}]
        })
    }

    console.log("Request created");

    return request;
}