resource "aws_iam_policy" "insert_into_dynamodb" {
    name = "insert_LLM_response_into_dynamodb"
    description = "Allow lambda to insert LLM response into DynamoDB"
    policy = jsonencode(
        {
            Version = "2012-10-17",
            Statement = [
                {
                    Action = [
                        "dynamodb:PutItem"
                    ],
                    Effect = "Allow",
                    Resource = aws_dynamodb_table.llm_responses.arn
                }
            ]
        }
    )
}

resource "aws_iam_policy" "retrieve_from_dynamodb"{
    name = "retrieve_from_dynamodb"
    description = "Allows lambda to retrieve LLM response from DynamoDB stream."
    policy = jsonencode({
        Version = "2012-10-17",
        Statement = [
            {
                Effect = "Allow",
                Resource = aws_dynamodb_table.llm_responses.stream_arn,
                Action = [
                    "dynamodb:GetRecords",
                    "dynamodb:GetShardIterator",
                    "dynamodb:DescribeStream",
                    "dynamodb:ListStreams"
                ]
            }
        ]
    })
}

resource "aws_iam_policy" "send_email"{
    name = "send_email_using_ses"
    description = "This permission policy allows a resource to send emails to any email identity."
    policy = jsonencode({
        Version = "2012-10-17",
        Statement = [
            {
                Effect = "Allow",
                Resource = "*",
                Action = [
                    "ses:VerifyEmailIdentity",
                    "ses:GetIdentityVerificationAttributes",
                    "ses:ListIdentities",
                    "ses:SendEmail"
                ]
            }
        ]
    })
}

resource "aws_iam_policy" "log_to_cloudwatch"{
    name = "notion_responder_logs_cloudwatch"
    description = "This permission policy allows a resource to log to cloudwatch."
    policy = jsonencode({
        Version = "2012-10-17",
        Statement = [
            {
                Effect = "Allow",
                Action = [
                    "logs:CreateLogGroup",
                    "logs:CreateLogStream",
                    "logs:PutLogEvents",
                    "logs:GetLogEvents",
                    "logs:FilterLogEvents",
                    "logs:DescribeLogStreams",
                    "logs:DescribeLogGroups"
                ],
                Resource = "*"
            }
        ]
    })
}

resource "aws_lambda_permission" "notion_responder_invoke_and_store_deepseek_response" {
  statement_id = "AllowExecutionFromAPIGateway"
  action = "lambda:InvokeFunction"
  function_name = aws_lambda_function.invoke_and_store_deepseek_reponse.function_name
  principal = "apigateway.amazonaws.com"
  source_arn = "${aws_apigatewayv2_api.notion_responder.execution_arn}/*/*"
}

