import { CommonModule } from "@angular/common";
import { Component, Input, output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: "app-geo-permission",
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatInputModule],
  templateUrl: "./geo-permission.component.html",
  styleUrl: "./geo-permission.component.css",
})
export class GeoPermissionComponent {
  @Input() geoPermissionState: PermissionState = "denied";
  clickEvent = output<void>();

  onClick() {
    this.clickEvent.emit();
  }

  reloadPage() {
    window.location.reload();
  }
}
