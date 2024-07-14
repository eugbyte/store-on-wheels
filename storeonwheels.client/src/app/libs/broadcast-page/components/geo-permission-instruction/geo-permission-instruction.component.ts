import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: "app-geo-permission-instruction",
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatInputModule],
  templateUrl: "./geo-permission-instruction.component.html",
  styleUrl: "./geo-permission-instruction.component.css",
})
export class GeoPermissionInstructionComponent {
  @Input() geoPermission: PermissionState = "denied";

  reloadPage() {
    window.location.reload();
  }
}
