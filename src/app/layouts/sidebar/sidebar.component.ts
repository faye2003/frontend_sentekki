import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import MetisMenu from 'metismenujs';
import { Router, NavigationEnd } from '@angular/router';
import { MENU } from './menu';
import { MenuItem } from './menu.model';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

/**
 * Sidebar Component
 */
export class SidebarComponent implements OnInit {
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
  }
}
