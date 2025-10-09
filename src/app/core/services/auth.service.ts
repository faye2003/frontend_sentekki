import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

interface TokenResponse {
  access: string;
  refresh: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api'; // ton backend Django
  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';
  private tokenKey = 'jwt_token';

  isLoggedIn$ = new BehaviorSubject<boolean>(this.hasAccessToken());

  constructor(private http: HttpClient) {}

  // 🔹 Vérifie si un access token existe
  private hasAccessToken(): boolean {
    return !!localStorage.getItem(this.accessTokenKey);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.accessTokenKey);
  }

  // 🔹 Login utilisateur
  login(username: string, password: string): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/login/`, { username, password }).pipe(
      tap(tokens => {
        this.setTokens(tokens.access, tokens.refresh);
        this.isLoggedIn$.next(true);
      })
    );
  }

  // 🔹 Logout utilisateur
  logout(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isLoggedIn$.next(false);
  }

  // 🔹 Sauvegarde des tokens
  private setTokens(access: string, refresh: string) {
    localStorage.setItem(this.accessTokenKey, access);
    localStorage.setItem(this.refreshTokenKey, refresh);
  }

  // 🔹 Récupère le token access
  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  // 🔹 Récupère le refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  // 🔹 Rafraîchir le token
  refreshAccessToken(): Observable<{ access: string }> {
    const refresh = this.getRefreshToken();
    return this.http.post<{ access: string }>(`${this.apiUrl}/token/refresh/`, { refresh }).pipe(
      tap(response => {
        localStorage.setItem(this.accessTokenKey, response.access);
      })
    );
  }
}
