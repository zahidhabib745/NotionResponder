resource "aws_apigateway2_api" "notion_responder" { //Here I am specifying the HTTP API
    name = "NotionResponder"
    protocol_type = "HTTP"
    description = "This api is responsible for sending questions from Notion and receiving answers from DeepSeek."
    tags = {
        project = "NotionResponder-IAC"
    }
}

resource "aws_apigateway2_route" "single_response_route"{ //Here I am specifying the route where the POST request will be sent so the integration can receive it
    api_id = aws_apigateway2_api.notion_responder.api_id
    route_key = "POST /single_response/{proxy+}"
    target = "integrations/${aws_apigateway2_integration.single_response_integration.id}"
}

resource "aws_apigateway2_integration" "single_response_integration" {//Here I am specifying the backend to be called
    api_id = aws_apigateway2_api.single_response.api_id
    integration_type = "AWS_PROXY"
    integration_method = "POST"
    integration_uri = aws_lambda_function.invoke_and_store_deepseek_reponse.invoke_arn
}