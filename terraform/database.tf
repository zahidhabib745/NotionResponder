resource "aws_dynamodb_table" "llm_responses"{
    name = "LLM_Responses"
    billing_mode = "PAY_PER_REQUEST"
    hash_key = "Id"

    attribute {
      name = "Id"
      type = "S"
    }
    
    stream_enabled = true
    stream_view_type = "NEW_AND_OLD_IMAGES"
}