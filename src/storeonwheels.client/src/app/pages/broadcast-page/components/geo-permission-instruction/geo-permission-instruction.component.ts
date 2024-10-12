import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { GeoPermission } from "~/app/pages/broadcast-page/services";

@Component({
  selector: "app-geo-permission-instruction",
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatInputModule],
  templateUrl: "./geo-permission-instruction.component.html",
  styleUrl: "./geo-permission-instruction.component.css",
})
export class GeoPermissionInstructionComponent {
  @Input() geoPermission: GeoPermission = "denied";
  permissionTexts = new Map<GeoPermission, string>([
    ["prompt", "The application will request geolocation permission."],
    ["granted", "Permission granted."],
    ["temp_granted", "Permission temporarily granted."],
    ["denied", "Permission denied."],
    ["temp_denied", "Permission temporarily denied"],
  ]);

  reloadPage() {
    window.location.reload();
  }
}
