import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, map } from 'rxjs';
import { Translator, CorrectionTranslator, Language } from './translator-last.model';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TranslatorLastService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access'); // récupère le JWT
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
  }

  private splitIntoSentences(text: string): string[] {
    if (!text) return [];
    return text.trim().split(/(?<=[.!?])/,5).filter(s => s.trim().length > 0);
  }

  /** 🔹 Traduire un texte */
  translate(payload: { input_text: string; lang_src?: string; lang_dest?: string }): Observable<Translator> {
    return this.http.post<Translator>(`${this.apiUrl}/translate/`, payload, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  /** 🔹 Envoyer une correction */
  addCorrection(payload: { translator_id: number; phrase_source: string; phrase_corrigee: string;}): Observable<CorrectionTranslator> {
    return this.http.post<CorrectionTranslator>(`${this.apiUrl}/correction/`, payload, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  /** 🔹 Gestion des erreurs HTTP */
  private handleError(error: any) {
    console.error('Erreur API:', error);
    let message = 'Erreur inconnue';
    if (error.error instanceof ErrorEvent) {
      message = `Erreur client: ${error.error.message}`;
    } else {
      message = `Erreur serveur: ${error.status} - ${error.statusText}`;
    }
    return throwError(() => message);
  }
}