locals{
    database_role_arn = aws_iam_role.insert_deepseek_response.arn
    invokeDeepSeek = "invokeDeepSeek"

    ses_role_arn = aws_iam_role.access_dynamodb_and_ses.arn
    retrieveResponseFromDynamoDB = "retrieveResponseFromDynamoDB"
}

resource "aws_lambda_function" "invoke_and_store_deepseek_reponse" {
    function_name = "invoke_and_store_deepseek_response"
    filename = data.archive_file.invoke_and_store_deepseek_response_archive.output_path
    role = aws_iam_role.insert_deepseek_response.arn
    handler = "invokeDeepSeek.handler"
    source_code_hash = data.archive_file.invoke_and_store_deepseek_response_archive.output_base64sha256
    runtime = "nodejs20.x"
    timeout = 180

    layers = [
      aws_lambda_layer_version.node_modules_layer.arn,
      aws_lambda_layer_version.custom_layer.arn
    ]

    depends_on = [aws_cloudwatch_log_group.invoke_and_store_deepseek_response_logs]

    environment {
      variables = {
        API_KEY = var.api_key
        database_role_arn = local.database_role_arn
        sessionName = local.invokeDeepSeek
      }
    }
}

resource "aws_lambda_function" "retrieve_deepseek_response_and_send_email"{
    function_name = "retrieve_deepseek_response_and_send_email"
    filename = data.archive_file.retrieve_deepseek_response_and_send_email_archive.output_path
    role = aws_iam_role.access_dynamodb_and_ses.arn
    handler = "retrieveResponseFromDynamoDB.handler"
    source_code_hash = data.archive_file.retrieve_deepseek_response_and_send_email_archive.output_base64sha256
    runtime = "nodejs20.x"

    layers = [
      aws_lambda_layer_version.node_modules_layer.arn,
      aws_lambda_layer_version.custom_layer.arn
    ]

    depends_on = [aws_cloudwatch_log_group.retrieve_deepseek_response_and_send_email_logs]

    environment {
      variables = {
        ses_role_arn = local.ses_role_arn
        sessionName = local.retrieveResponseFromDynamoDB
        sender_email_address = var.sender_email_address
        recipient_email_address = var.recipient_email_address
      }
    }
}

data "archive_file" "invoke_and_store_deepseek_response_archive" {
    type = "zip"
    source_file = "${var.invokeDeepSeek_path}"
    output_path = "${path.module}/invokeDeepSeek.zip"
}

data "archive_file" "retrieve_deepseek_response_and_send_email_archive" {
    type = "zip"
    source_file = "${var.retrieveResponseFromDynamoDB_path}"
    output_path = "${path.module}/retrieveResponseFromDynamoDB.zip"
}