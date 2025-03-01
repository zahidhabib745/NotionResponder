resource "aws_apigateway2_api" "single_response" {
    name = "NotionResponder"
    protocol_type = "HTTP"
    description = "This api is responsible for sending questions from Notion and receiving answers from DeepSeek."
    tags = {
        project = "NotionResponder-IAC"
    }
}

resource "aws_apigateway2_integration" "single_response_integration" {
    api_id = aws_apigateway2_api.single_response.api_id
    integration_type = "AWS_PROXY"
    integration_method = "POST"
    integration_uri = aws_lambda_function.invoke_and_store_deepseek_reponse.invoke_arn
    
}