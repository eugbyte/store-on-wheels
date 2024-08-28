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

# [Use multiple provisoners to run multiple commands in local exec](https://tinyurl.com/mrjw6rkf)
resource "null_resource" "publish_docker_image" {
  triggers = {
    always_run = "${timestamp()}"
  }

  provisioner "local-exec" {
    environment = {
      "IMAGE" = "${local.image}"
    }
    working_dir = "../.."
    command     = "docker compose build"
  }

  provisioner "local-exec" {
    command = "az acr login --name ${azurerm_container_registry.acr.name}"
  }

  provisioner "local-exec" {
    command = "docker tag ${local.image} ${azurerm_container_registry.acr.login_server}/${local.image}"
  }

  provisioner "local-exec" {
    command = "docker image ls"
  }

  provisioner "local-exec" {
    command = "docker push ${azurerm_container_registry.acr.login_server}/${local.image}"
  }

  depends_on = [azurerm_container_registry.acr]
}

resource "azurerm_container_app_environment" "env" {
  name                       = "ca-env-storeonwheels-prod-sea"
  location                   = azurerm_resource_group.rg.location
  resource_group_name        = azurerm_resource_group.rg.name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.analytics.id

  depends_on = [null_resource.publish_docker_image]
}

resource "azurerm_user_assigned_identity" "uami" {
  name                = "uami-storeonwheels-prod-sea"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location

  depends_on = [null_resource.publish_docker_image]
}

resource "azurerm_role_assignment" "acr_pull" {
  principal_id         = azurerm_user_assigned_identity.uami.principal_id
  role_definition_name = "AcrPull"
  scope                = azurerm_container_registry.acr.id
}

resource "azurerm_container_app" "app" {
  name                         = "ca-storeonwheels-prod-sea"
  container_app_environment_id = azurerm_container_app_environment.env.id
  resource_group_name          = azurerm_resource_group.rg.name
  revision_mode                = "Single"

  # needed for authentication when pulling from private ACR 
  # https://azureway.cloud/azure-container-apps-creating-using-terraform-part-1/
  registry {
    server   = azurerm_container_registry.acr.login_server
    identity = azurerm_user_assigned_identity.uami.id
  }

  # needed for container app to access other Microsoft Entra protected resources
  # https://learn.microsoft.com/en-us/azure/container-apps/managed-identity?tabs=portal%2Cdotnet
  identity {
    type = "UserAssigned"
    identity_ids = [
      azurerm_user_assigned_identity.uami.id
    ]
  }

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
      latest_revision = true
      percentage      = 100
    }
  }
}
