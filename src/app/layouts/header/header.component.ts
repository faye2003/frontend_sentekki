import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor (private authService: AuthService, private router: Router){}

  logout() {
      this.authService.logout();
    this.router.navigate(['/account/login']);
  }
}
