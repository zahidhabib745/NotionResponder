resource "aws_iam_role_policy_attachment" "insert_response_into_dynamodb" {
    for_each = toset([
        aws_iam_policy.insert_into_dynamodb.arn,
        aws_iam_policy.log_to_cloudwatch.arn
    ])

    role = aws_iam_role.insert_deepseek_response.name
    policy_arn = each.value
}

resource "aws_iam_role_policy_attachment" "access_to_dynamodb_to_retrieve_data"{
    for_each = toset([
        aws_iam_policy.retrieve_from_dynamodb.arn,
        aws_iam_policy.log_to_cloudwatch.arn
    ])

    role = aws_iam_role.access_dynamodb_and_ses.name
    policy_arn = each.value
}

resource "aws_iam_role_policy_attachment" "send_emails_using_ses"{
    role = aws_iam_role.access_dynamodb_and_ses.name
    policy_arn = aws_iam_policy.send_email.arn
}

resource "aws_iam_role_policy_attachment" "api_gateway_logs_to_cloudwatch_attachment"{
    role = aws_iam_role.apigateway_logs_cloudwatch.name
    policy_arn = aws_iam_policy.log_to_cloudwatch.arn
}