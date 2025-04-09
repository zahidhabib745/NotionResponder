variable "api_key" {
 type = string
 description = "This contains the API key for the lambda function."
 default = "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" 
 sensitive = true
}

variable "node_modules_path" {
  type = string
  description = "This is the path to the node_modules folder."
  default = "../lambda_code/node_modules"
}

variable "layer_path" {
  type = string
  description = "This is the path to the layer folder."
  default = "../lambda_code/layer"
}

variable "package_lock_json_path" {
  type = string
  description = "This is the path to the package-lock.json file."
  default = "../lambda_code/package-lock.json"
}

variable "invokeDeepSeek_path"{
  type = string
  description = "This is the path to the invokeDeepSeek file."
  default = "../lambda_code/invokeDeepSeek.mjs"
}

variable "retrieveResponseFromDynamoDB_path"{
  type = string
  description = "This is the path to the retrieveResponseFromDynamoDB file."
  default = "../lambda_code/retrieveResponseFromDynamoDB.mjs"
}

variable "sender_email_address" {
  type = string
  description = "This is the email address of the sender."
  default = "moezahidhabib@gmail.com" 
}

variable "recipient_email_address" {
  type = string
  description = "This is the email address of the recipient."
  default = "kinghabz14@gmail.com"
}
