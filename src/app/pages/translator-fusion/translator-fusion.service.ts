import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { TranslatorFusionData, Sentence } from './translator-fusion.model';

@Injectable({ providedIn: 'root' })
export class TranslatorFusionService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  private splitIntoSentences(text: string): string[] {
    if (!text) return [];
    return text.trim().split(/(?<=[.!?])/,5).filter(s => s.trim().length > 0);
  }

  translate(payload: { text: string; lang_src?: string; lang_dest?: string }): Observable<TranslatorFusionData> {
        return this.http.post<any>(`${this.apiUrl}/translate/`, {
      text: payload.text,
      lang_src: payload.lang_src ?? 'auto',
      lang_dest: payload.lang_dest ?? 'en'
    }).pipe(
      map(res => {
        // Si Django renvoie sentences_data
        const sentencesData = res.sentences_data ?? [];
        const sentences: Sentence[] = sentencesData.map((s: any) => ({
          id: null,
          sentence_number: s.index,
          sentence_src: s.src,
          sentence_translated: s.translated,
          corrections: [],
          isEditing: false,
          editText: s.translated
        }));

        const result: TranslatorFusionData = {
          id: res.id,
          user: res.user,
          lang_src: res.lang_src?.code ?? payload.lang_src ?? 'auto',
          lang_dest: res.lang_dest?.code ?? payload.lang_dest ?? 'en',
          input_text: res.input_text,
          output_text: res.output_text,
          created_at: res.created_at,
          sentences
        };

        return result;
      })
    );
  }

  // translate(payload: { text: string; lang_src?: string; lang_dest?: string }): Observable<TranslatorFusionData> {
  //   return this.http.post<any>(`${this.apiUrl}/translate/`, payload).pipe(
  //     map((res) => {
  //       if (res && res.id && Array.isArray(res.sentences)) {
  //         return res as TranslatorFusionData;
  //       }

  //       const output = res.output_text ?? res.translated_text ?? '';
  //       const sentencesSrc = this.splitIntoSentences(payload.text);
  //       const sentencesOut = this.splitIntoSentences(output);

  //       const sentences: Sentence[] = (sentencesOut.length ? sentencesOut : sentencesSrc).map((out, idx) => ({
  //         id: null,
  //         sentence_number: idx + 1,
  //         sentence_src: sentencesSrc[idx] ?? '',
  //         sentence_translated: out ?? '',
  //         corrections: [],
  //         isEditing: false,
  //         editText: out ?? ''
  //       }));

  //       const fallback: TranslatorFusionData = {
  //         id: null,
  //         user: null,
  //         lang_src: payload.lang_src ?? 'auto',
  //         lang_dest: payload.lang_dest ?? 'en',
  //         input_text: payload.text,
  //         output_text: output,
  //         created_at: new Date().toISOString(),
  //         sentences
  //       };
  //       return fallback;
  //     })
  //   );
  // }

  addCorrection(payload: { translator_id: number; sentence_index: number; corrected_text: string }) {
    return this.http.post<any>(
      `${this.apiUrl}/correction/${payload.translator_id}/${payload.sentence_index}/`,
      { corrected_text: payload.corrected_text }
    );
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
// export class TranslatorFusionService {
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
