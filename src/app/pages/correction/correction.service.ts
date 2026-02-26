import { Injectable, TemplateRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { CorrectionTranslator, Translator, Language, Sentence } from './correction.model';

@Injectable({ providedIn: 'root' })
export class CorrectionService {
  private apiUrl = 'http://127.0.0.1:8000/api';
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

  getTranslations(page: number, perPage: number, status?: string) {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getAccessToken()}`
    });

    let params: any = {
      page: page,
      per_page: perPage
    };

    if (status) {
      params.status = status;
    }

    return this.http.get<any>(
      `${this.apiUrl}/translate/correct/`,
      { headers, params }
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
