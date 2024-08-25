output "acr_name" {
  description = "Name of ACR"
  value       = azurerm_container_registry.acr.name
}

output "login_server" {
  description = "acr docker repo url"
  value       = azurerm_container_registry.acr.login_server
}