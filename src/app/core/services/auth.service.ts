import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserMe } from './user-me.model';

interface TokenResponse {
  success: boolean;
  access: string;
  refresh: string;
  user_id: number;
  username: string;
  profil: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';
  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';
  private userRoleKey = 'user_role';
  private usernameKey = 'username';

  isLoggedIn$ = new BehaviorSubject<boolean>(this.hasAccessToken());

  constructor(private http: HttpClient) {}

  private userRole$ = new BehaviorSubject<string | null>(this.getCurrentUserRole());

  setUserRole(role: string) {
    localStorage.setItem(this.userRoleKey, role);
    this.userRole$.next(role);
  }

  getUserRole(): Observable<string | null> {
    return this.userRole$.asObservable();
  }

  // 🔹 Récupérer l'utilisateur connecté
  getMe(): Observable<UserMe> {
    return this.http.get<UserMe>(`${this.apiUrl}/me/`);
  }

  getCurrentUserRole(): string | null {
    return localStorage.getItem(this.userRoleKey);
  }

  // getCurrentUserRole(): string | null {
  //   const role = localStorage.getItem('userRole');
  //   if (!role) return null;

  //   // Normalisation : tout en minuscule
  //   return role.toLowerCase();
  // }

  private hasAccessToken(): boolean {
    return !!localStorage.getItem(this.accessTokenKey);
  }

  isLoggedIn(): boolean {
    return this.hasAccessToken();
  }

  // 🔹 Login utilisateur
  login(username: string, password: string): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/login/`, { username, password }).pipe(
      tap(tokens => {
        this.setTokens(tokens.access, tokens.refresh);
        this.setUserRole(tokens.profil);
        localStorage.setItem(this.usernameKey, tokens.username);
        this.isLoggedIn$.next(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userRoleKey);
    localStorage.removeItem(this.usernameKey);
    this.isLoggedIn$.next(false);
  }

  private setTokens(access: string, refresh: string) {
    localStorage.setItem(this.accessTokenKey, access);
    localStorage.setItem(this.refreshTokenKey, refresh);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getUsername(): string | null {
    return localStorage.getItem(this.usernameKey);
  }

  // 🔹 Demande pour devenir correcteur
  requestCorrector(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/request/corrector/`,
      {}
    );
  }

  
  // refreshUser(): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/request/corrector/`).pipe(
  //     tap(tokens => this.setUserRole(tokens.profil))
  //   );
  // }

  refreshAccessToken(): Observable<{ access: string }> {
    const refresh = this.getRefreshToken();
    return this.http.post<{ access: string }>(`${this.apiUrl}/token/refresh/`, { refresh }).pipe(
      tap(response => localStorage.setItem(this.accessTokenKey, response.access))
    );
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }
}
