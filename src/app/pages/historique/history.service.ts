import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { History } from './history.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class HistoriqueService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(withAuth: boolean = false): HttpHeaders {
    const token = localStorage.getItem('access');
    const headers: any = { 'Content-Type': 'application/json' };

    if (withAuth && token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return new HttpHeaders(headers);
  }

  getAllHistory(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getAccessToken()}`
    });
    return this.http.get<{results: any[]}>(`${this.apiUrl}/history/all/`, { headers }).pipe(
        map(response => response.results || [])
    );
    
  }

   getUserHistory(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getAccessToken()}`
    });
    return this.http.get<{ count: number, results: any[] }>(`${this.apiUrl}/history/recent/`, { headers }).pipe(
      map(response => response.results || []) // on renvoie seulement le tableau
    );
  }

  rateTranslation(translatorId: number, stars: number, comment: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getAccessToken()}`
    });
    const body = {
      translator_id: translatorId,  // 👈 clé correcte attendue par Django
      stars: stars,
      comment: comment
    };
    return this.http.post(`${this.apiUrl}/note/`, body, { headers });
  }


  private handleError(error: any) {
    console.error('Erreur API:', error);
    let message = 'Erreur inconnue';
    if (error.error instanceof ErrorEvent) {
      message = `Erreur client: ${error.error.message}`;
    } else if (error.status === 401) {
      message = 'Authentification requise pour cette action.';
    } else if (error.status === 403) {
      message = 'Accès refusé.';
    } else {
      message = `Erreur serveur: ${error.status} - ${error.statusText}`;
    }
    return throwError(() => message);
  }
}
