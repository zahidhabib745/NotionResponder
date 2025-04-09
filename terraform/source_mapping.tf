resource "aws_lambda_event_source_mapping" "dynamodb_lambda_trigger"{
    event_source_arn = aws_dynamodb_table.llm_responses.stream_arn
    function_name = aws_lambda_function.retrieve_deepseek_response_and_send_email.function_name
    starting_position = "LATEST"

    batch_size = 1
    maximum_retry_attempts = 3
}