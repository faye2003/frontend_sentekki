import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface TranslationResponse {
  success: boolean;
  output_text: string;
  src: string;
  dest: string;
}

@Injectable({
  providedIn: 'root'
})
export class TranslatorService {
  private apiUrl = 'http://127.0.0.1:8000/api/translate/';

  constructor(private http: HttpClient) {}

  translate(text: string, src: string, dest: string): Observable<TranslationResponse> {
    return this.http.post<TranslationResponse>(this.apiUrl, {
      text,
      src,
      dest
    });
  }

  addCorrection(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-correction/`, payload);
  }
}
