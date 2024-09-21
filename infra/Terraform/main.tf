terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=3.52.0"
    }
  }
  # comment out when needing to initialize the storage account for the first time to start the .tfstate
  # backend "azurerm" {
  #   resource_group_name  = "rg-storeonwheels-prod-sea"
  #   storage_account_name = "ststoreonwheelsprodsea"
  #   container_name       = "stc-storeonwheels-prod-sea"
  #   key                  = "terraform.tfstate"
  # }
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

