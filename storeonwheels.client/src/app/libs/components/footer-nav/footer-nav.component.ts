import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from "@angular/router";
import { ThemePalette } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TitleCasePipe } from "@angular/common";
import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-footer-nav',
  standalone: true,
  imports: [MatTabsModule, TitleCasePipe, RouterModule],
  templateUrl: './footer-nav.component.html',
  styleUrl: './footer-nav.component.css'
})
export class FooterNavComponent implements OnInit {
  links = ['map', 'healthcheck'];
  activeLink = this.links[0];
  background: ThemePalette = 'primary';

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => this.activeLink = (event as NavigationEnd).url.slice(1));
  }
}
