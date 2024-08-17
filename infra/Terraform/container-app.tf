# Azure Container Registry (ACR)
resource "azurerm_container_registry" "acr" {
  # acrStoreonwheelsProdSea
  name                = "acrstoreonwheelsprodsea"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Basic"
  admin_enabled       = true
}

locals {
  image = "storeonwheelsserver"
}

resource "null_resource" "build_docker_image" {
  provisioner "local-exec" {
    environment = {
      "IMAGE" = "${local.image}"
    }
    working_dir = "../.."
    command     = "docker compose build"
  }
  depends_on = [azurerm_container_registry.acr]
}

resource "null_resource" "push_docker_image" {
  provisioner "local-exec" {
    command = <<-EOT
        az acr login --name ${azurerm_container_registry.acr.name}
        docker tag storeonwheelsserver "${azurerm_container_registry.acr.login_server}/${local.image}"
        docker push "${azurerm_container_registry.acr.login_server}/${local.image}"
    EOT
  }
  depends_on = [null_resource.build_docker_image]
}

resource "azurerm_container_app_environment" "env" {
  name                       = "ca-env-storeonwheels-prod-sea"
  location                   = azurerm_resource_group.rg.location
  resource_group_name        = azurerm_resource_group.rg.name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.analytics.id
}

resource "azurerm_container_app" "app" {
  name                         = "ca-storeonwheels-prod-sea"
  container_app_environment_id = azurerm_container_app_environment.env.id
  resource_group_name          = azurerm_resource_group.rg.name
  revision_mode                = "Single"

  template {
    container {
      name   = "storeonwheelsserver"
      image  = "${azurerm_container_registry.acr.login_server}/${local.image}"
      cpu    = 0.5
      memory = "1Gi"
    }
  }

  ingress {
    allow_insecure_connections = false
    external_enabled           = true
    target_port                = 4000
    # ws connection not distributed to message queues yet
    traffic_weight {
      percentage = 100
    }
  }

  depends_on = [null_resource.push_docker_image]
}
