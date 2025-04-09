resource "aws_api_gateway_account" "api_gateway_account"{
    cloudwatch_role_arn = aws_iam_role.apigateway_logs_cloudwatch.arn
}

resource "aws_apigatewayv2_api" "notion_responder" {
    name = "NotionResponder"
    protocol_type = "HTTP"
    description = "This api is responsible for sending questions from Notion and receiving answers from DeepSeek."
    tags = {
        project = "NotionResponder-IAC"
    }
}

resource "aws_apigatewayv2_route" "single_response_route"{
    api_id = aws_apigatewayv2_api.notion_responder.id
    route_key = "POST /single_response/{question}"
    target = "integrations/${aws_apigatewayv2_integration.single_response_integration.id}"
}

resource "aws_apigatewayv2_integration" "single_response_integration" {
    api_id = aws_apigatewayv2_api.notion_responder.id
    integration_type = "AWS_PROXY"
    integration_method = "POST"
    integration_uri = aws_lambda_function.invoke_and_store_deepseek_reponse.invoke_arn
}

resource "aws_apigatewayv2_stage" "notion_responder_stage"{
    api_id = aws_apigatewayv2_api.notion_responder.id
    name = "Dev"
    deployment_id = aws_apigatewayv2_deployment.notion_responder_deployment.id

    access_log_settings {
        destination_arn = aws_cloudwatch_log_group.notion_responder_log_group.arn
        format = jsonencode({
            requestId = "$context.requestId",
            requestTime = "$context.requestTime",
            sourceIp = "$context.identity.sourceIp",
            httpMethod = "$context.httpMethod",
            routeKey = "$context.routeKey",
            status = "$context.status",
            responseLength = "$context.responseLength",
            integrationErrorMessage = "$context.integrationErrorMessage"
            resourcePath = "$context.resourcePath"
            protocol = "$context.protocol"
        })
    }
}

resource "aws_apigatewayv2_deployment" "notion_responder_deployment"{
    api_id = aws_apigatewayv2_api.notion_responder.id
    description = "Deployment for the NotionResponder API"

    triggers = {
        redeployment = sha1(join(",", [
            jsonencode(aws_apigatewayv2_route.single_response_route),
            jsonencode(aws_apigatewayv2_integration.single_response_integration)
        ]))
    }

    depends_on = [ 
        aws_apigatewayv2_route.single_response_route,
        aws_apigatewayv2_integration.single_response_integration
     ]
}