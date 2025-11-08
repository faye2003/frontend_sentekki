import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent implements OnInit {
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

