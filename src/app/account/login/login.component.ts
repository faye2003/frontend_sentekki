import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router : Router
  ) {}

  onLogin() {
    this.authService.login(this.username, this.password).subscribe({
      next: res => console.log('Connecté ✅', res),
      error: err => console.error('Erreur ❌', err)
    });
    this.router.navigate(['/']);
  }
}
