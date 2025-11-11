import { Component, OnInit } from '@angular/core';
import {
  LAYOUT_VERTICAL, LAYOUT_HORIZONTAL, LAYOUT_MODE, LAYOUT_WIDTH,
  LAYOUT_POSITION, SIDEBAR_SIZE, SIDEBAR_COLOR, TOPBAR
} from './layouts.model';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})

/**
 * Layout Component
 */
export class LayoutComponent {
  userRole: string | null = null;
    username: string | null = null;
    isCollapsed = false;
  
    constructor (private authService: AuthService, private router: Router){}
  
  
    // toggleSidebar() {
    //   this.isCollapsed = !this.isCollapsed;
    // }
  
    toggleSidebar() {
      const sidebar = document.getElementById('sidebar');
      sidebar?.classList.toggle('open');
    }
  
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
}
