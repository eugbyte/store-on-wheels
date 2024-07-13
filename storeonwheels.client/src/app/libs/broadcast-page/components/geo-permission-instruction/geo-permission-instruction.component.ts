import { CommonModule } from "@angular/common";
import {
  Component,
  Input,
  Signal as ReadOnlySignal,
  signal,
} from "@angular/core";
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
  @Input() geoPermission: ReadOnlySignal<PermissionState> = signal("denied");

  reloadPage() {
    window.location.reload();
  }
}
