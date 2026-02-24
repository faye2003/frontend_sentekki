import { Injectable, TemplateRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { Translator, CorrectionTranslator } from './traduction.model';

@Injectable({ providedIn: 'root' })
export class TraductionService {
  private apiUrl = 'https://api.sentekki.unchk.sn/api';
  toasts: any[] = [];

  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  remove(toast: any) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(withAuth: boolean = false): HttpHeaders {
    const token = localStorage.getItem('access');
    const headers: any = { 'Content-Type': 'application/json' };

    if (withAuth && token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return new HttpHeaders(headers);
  }

  getUserHistory(): Observable<any[]> {
    // const headers = this.getHeaders(true)
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getAccessToken()}`
    });
    console.log(this.authService.getAccessToken());
    return this.http.get<{ count: number, results: any[] }>(`${this.apiUrl}/history/recent/`, { headers }).pipe(
      map(response => response.results || []) // on renvoie seulement le tableau
    );
  }

  rateTranslation(translatorId: number, stars: number, comment: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getAccessToken()}`
    });
    const body = {
      translator_id: translatorId,  // clé correcte attendue par Django
      stars: stars,
      comment: comment
    };
    return this.http.post(`${this.apiUrl}/note/`, body, { headers });
  }

  translate(payload: { input_text: string; lang_src?: string; lang_dest?: string }): Observable<Translator> {
    return this.http.post<Translator>(`${this.apiUrl}/translate/`, payload, {
      headers: this.getHeaders(false)
    }).pipe(
      catchError(this.handleError)
    );
  }

  addCorrection(payload: { translator_id: number; phrase_source: string; phrase_corrigee: string }): Observable<CorrectionTranslator> {
    return this.http.post<CorrectionTranslator>(`${this.apiUrl}/correction/`, payload, {
      headers: this.getHeaders(true)
    }).pipe(
      catchError(this.handleError)
    );
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
