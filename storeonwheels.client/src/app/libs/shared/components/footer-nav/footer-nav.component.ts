import { Component, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { ThemePalette } from "@angular/material/core";
import { MatTabsModule } from "@angular/material/tabs";
import { TitleCasePipe } from "@angular/common";
import { NavigationEnd } from "@angular/router";
import { filter } from "rxjs";

@Component({
  selector: "app-footer-nav",
  standalone: true,
  imports: [MatTabsModule, TitleCasePipe, RouterModule],
  templateUrl: "./footer-nav.component.html",
})
export class FooterNavComponent implements OnInit {
  links = ["map", "healthcheck"];
  activeLink = this.links[0];
  background: ThemePalette = undefined;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        let { url, urlAfterRedirects } = event as NavigationEnd;
        url = url.slice(1);
        urlAfterRedirects = urlAfterRedirects.slice(1);
        this.activeLink =
          urlAfterRedirects.length > 0 ? urlAfterRedirects : url;
      });
  }
}
