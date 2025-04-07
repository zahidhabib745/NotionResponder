locals {
    invoke_and_store_deepseek_reponse = "invoke_and_store_deepseek_response"
    retrieve_deepseek_response_and_send_email = "retrieve_deepseek_response_and_send_email"
    notion_responder = "NotionResponder"
}

resource "aws_cloudwatch_log_group" "invoke_and_store_deepseek_response_logs"{
    name = "/aws/lambda/${local.invoke_and_store_deepseek_reponse}"
    retention_in_days = 14
}

resource "aws_cloudwatch_log_group" "retrieve_deepseek_response_and_send_email_logs"{
    name = "/aws/lambda/${local.retrieve_deepseek_response_and_send_email}"
    retention_in_days = 14
}

resource "aws_cloudwatch_log_group" "notion_responder_log_group"{
    name = "/aws/apigateway/${local.notion_responder}"
    retention_in_days = 14
}