output "acr_name" {
  description = "Name of ACR"
  value       = azurerm_container_registry.acr.name
}

output "login_server" {
  description = "acr docker repo url"
  value       = azurerm_container_registry.acr.login_server
}

output "container_app_url" {
  value = azurerm_container_app.app.latest_revision_fqdn
  description = "The URL of the Azure Container App"
}