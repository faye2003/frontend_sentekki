import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { TranslatorData, Sentence } from './translator.model';

@Injectable({ providedIn: 'root' })
export class TranslatorService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  private splitIntoSentences(text: string): string[] {
    if (!text) return [];
    return text.trim().split(/(?<=[.!?])/,5).filter(s => s.trim().length > 0);
  }

  translate(payload: { text: string; lang_src?: string; lang_dest?: string }): Observable<TranslatorData> {
    return this.http.post<any>(`${this.apiUrl}/translate/`, payload).pipe(
      map((res) => {
        if (res && res.id && Array.isArray(res.sentences)) {
          return res as TranslatorData;
        }

        const output = res.output_text ?? res.translated_text ?? '';
        const sentencesSrc = this.splitIntoSentences(payload.text);
        const sentencesOut = this.splitIntoSentences(output);

        const sentences: Sentence[] = (sentencesOut.length ? sentencesOut : sentencesSrc).map((out, idx) => ({
          id: null,
          sentence_number: idx + 1,
          sentence_src: sentencesSrc[idx] ?? '',
          sentence_translated: out ?? '',
          corrections: [],
          isEditing: false,
          editText: out ?? ''
        }));

        const fallback: TranslatorData = {
          id: null,
          user: null,
          lang_src: payload.lang_src ?? 'auto',
          lang_dest: payload.lang_dest ?? 'en',
          input_text: payload.text,
          output_text: output,
          created_at: new Date().toISOString(),
          sentences
        };
        return fallback;
      })
    );
  }

  addCorrection(payload: { sentence_id: number; correction_text: string }) {
    return this.http.post<any>(`${this.apiUrl}/translate/sentence/${payload.sentence_id}/correct/`, {
      correction_text: payload.correction_text
    });
  }
}


// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// interface TranslationResponse {
//   success: boolean;
//   output_text: string;
//   src: string;
//   dest: string;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class TranslatorService {
//   private apiUrl = 'http://127.0.0.1:8000/api/translate/';

//   constructor(private http: HttpClient) {}

//   translate(text: string, src: string, dest: string): Observable<TranslationResponse> {
//     return this.http.post<TranslationResponse>(this.apiUrl, {
//       text,
//       src,
//       dest
//     });
//   }

//   addCorrection(payload: any): Observable<any> {
//     return this.http.post(`${this.apiUrl}/add-correction/`, payload);
//   }
// }
