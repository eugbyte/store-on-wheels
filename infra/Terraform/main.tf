terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=3.52.0"
    }
  }
}

provider "azurerm" {
  features {}
}

# Create a resource group
resource "azurerm_resource_group" "rg" {
  name     = "rg-storeonwheels-prod-sea"
  location = "Southeast Asia"
}
resource "azurerm_log_analytics_workspace" "analytics" {
  name                = "log-storeonwheels-prod-sea"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
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
      name   = "storeonwheels.server"
      image  = "nginx:latest"
      cpu    = 0.5
      memory = "0.5Gi"
    }
  }

  ingress {
    allow_insecure_connections = false
    external_enabled           = true
    target_port                = 80
    # ws connection not distributed to message queues yet
    traffic_weight {
      percentage = 100
    }
  }
}