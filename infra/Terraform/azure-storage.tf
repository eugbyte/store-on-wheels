# Create a Storage account
resource "azurerm_storage_account" "terraform_state" {
  name                     = "ststoreonwheelsprodsea"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  tags = {
    environment = "my-terraform-env"
  }
}

# Create a Storage container
resource "azurerm_storage_container" "terraform_state" {
  name                  = "stc-storeonwheels-prod-sea"
  storage_account_name  = azurerm_storage_account.terraform_state.name
  container_access_type = "private"
}
