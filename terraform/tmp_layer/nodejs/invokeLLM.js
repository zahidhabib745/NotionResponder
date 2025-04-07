export async function getLLMResponse(request){

    try{     

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", request);

        if(response.status != 200){

            throw new Error(`Error: ${response.status}`); 
        }
    }catch(error){

        console.log("Error message: " + error);

        return {
            statusCode: 500,
            body: "Response failed to be generated"
        }
    }

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

    return request;
}