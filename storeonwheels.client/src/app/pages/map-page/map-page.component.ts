import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapComponent } from "~/app/libs/map-page/components";

@Component({
  selector: "app-map-page",
  standalone: true,
  imports: [CommonModule, MapComponent],
  templateUrl: "./map-page.component.html",
  styleUrl: "./map-page.component.css",
  providers: [],
})
export class MapPageComponent implements OnInit {
  ngOnInit() { }
}
