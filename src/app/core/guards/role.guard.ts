import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const allowedRoles = route.data['roles'] as string[];
    const userRole = this.authService.getCurrentUserRole();

    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    }

    this.router.navigate(['/unauthorized']);
    return false;
  }
}
