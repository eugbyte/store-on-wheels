import { Component } from "@angular/core";
import { FooterNavComponent } from "./libs/shared/components";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
  standalone: true,
  imports: [FooterNavComponent, RouterModule],
  providers: [],
})
export class AppComponent {
  ngOnInit() { }
}
