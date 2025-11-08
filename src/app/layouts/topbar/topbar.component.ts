import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { AuthService } from 'src/app/core/services/auth.service';

import { LAYOUT_MODE } from "../layouts.model";

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})

/**
 * Topbar Component
 */
export class TopbarComponent implements OnInit {

  userRole: string | null = null;
  username: string | null = null;

  constructor (private authService: AuthService, private router: Router){}

  ngOnInit(): void {
    // Récupération initiale du rôle
    this.userRole = this.authService.getCurrentUserRole();
    this.username = this.authService.getUsername();

    // Écoute des changements de rôle
    this.authService.getUserRole().subscribe(role => {
      this.userRole = role;
    });
  }

  hasRole(...roles: string[]): boolean {
    return roles.includes(this.userRole || '');
  }


  logout() {
    this.authService.logout();
    this.router.navigate(['/account/login']);
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = function () {
      window.history.go(1);
    };
  }
}