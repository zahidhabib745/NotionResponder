output "api_gateway_url" {
  value = "${aws_apigatewayv2_api.notion_responder.api_endpoint}/${aws_apigatewayv2_stage.notion_responder_stage.name}"
  description = "This is the URL of the API Gateway Stage."
}

output "api_gateway_endpoint" {
  value = "${aws_apigatewayv2_api.notion_responder.api_endpoint}/${aws_apigatewayv2_stage.notion_responder_stage.name}/single_response/{proxy+}"
  description = "This is the end point of the API Gateway."
}