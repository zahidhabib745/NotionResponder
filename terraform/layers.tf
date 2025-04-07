resource "aws_lambda_layer_version" "node_modules_layer"{
    layer_name = "node_modules_layer"
    description = "Layer containing the node modules."
    filename = data.archive_file.node_modules_layer.output_path
    source_code_hash = data.archive_file.node_modules_layer.output_base64sha256
    compatible_runtimes = ["nodejs20.x"]
}

resource "aws_lambda_layer_version" "custom_layer" {
    layer_name = "custom_layer"
    description = "Layer containing the custom code."
    filename = data.archive_file.custom_layer.output_path
    source_code_hash = data.archive_file.custom_layer.output_base64sha256
    compatible_runtimes = ["nodejs20.x"]
}
    
resource "null_resource" "prepare_node_modules_layer"{
    triggers = {
        node_modules_hash = filemd5(var.package_lock_json_path)
    }

    provisioner "local-exec" {
      command = <<EOT
        mkdir -p ${path.module}/tmp/nodejs
        cp -r ${var.node_modules_path} ${path.module}/tmp/nodejs
      EOT

      interpreter = [ "bash", "-c"]
    }
}

resource "null_resource" "prepare_custom_layer"{

    triggers = {
        layer_hash = sha256(join("", [
          for f in fileset(var.layer_path, "**"): filesha256("${var.layer_path}/${f}")
        ]))
    }
    provisioner "local-exec" {
      command = <<EOT
        mkdir -p ${path.module}/tmp_layer/nodejs
        cp -r ${var.layer_path}/* ${path.module}/tmp_layer/nodejs
      EOT

      interpreter = [ "bash", "-c"]
    }
}

data "archive_file" "node_modules_layer" {
    type = "zip"
    source_dir = "${path.module}/tmp"
    output_path = "${path.module}/node_modules_layer.zip"
    depends_on = [ null_resource.prepare_node_modules_layer ]
}

data "archive_file" "custom_layer"{
    type = "zip"
    source_dir = "${path.module}/tmp_layer"
    output_path = "${path.module}/lambda_layer.zip"
    depends_on = [ null_resource.prepare_custom_layer ]
}