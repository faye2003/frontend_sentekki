import { Component } from '@angular/core';
import { TranslatorTestService } from './translator-test.service';
import { TranslatorData, Sentence } from './translator-test.model';

@Component({
  selector: 'app-translator-test',
  templateUrl: './translator-test.component.html'
})
export class TranslatorTestComponent {
  inputText = '';
  translatorData: TranslatorData | null = null;
  // contrôle d'état
  loading = false;
  error = '';

  constructor(private translatorService: TranslatorTestService) {}

  onTranslate() {
    this.loading = true;
    this.error = '';
    const payload = { text: this.inputText, lang_src: 'fr', lang_dest: 'en' };

    this.translatorService.translate(payload).subscribe({
      next: (res) => {
        this.translatorData = res;
        // initialisation UI
        this.translatorData.sentences.forEach(s => {
          s.isEditing = false;
          s.editText = s.sentence_translated;
        });
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Erreur lors de la traduction';
        this.loading = false;
      }
    });
  }

  editSentence(s: Sentence) {
    s.isEditing = true;
    s.editText = s.sentence_translated;
  }

  cancelEdit(s: Sentence) {
    s.isEditing = false;
    s.editText = s.sentence_translated;
  }

  saveCorrection(s: Sentence) {
    if (!s.editText || s.editText.trim() === s.sentence_translated.trim()) {
      s.isEditing = false;
      return;
    }

    // Si sentence.id est null (fallback), tu dois appeler un endpoint qui accepte sentence info,
    // sinon utilise l'endpoint /translate/sentence/:id/correct/
    if (!s.id) {
      // fallback: POST to a generic correction endpoint with translator info
      const payload = { sentence_info: { sentence_number: s.sentence_number, sentence_src: s.sentence_src }, correction_text: s.editText };
      // call a fallback endpoint (implementer côté backend si nécessaire)
      this.translatorService.addCorrection({ sentence_id: 0, correction_text: s.editText })
        .subscribe({
          next: (resp) => {
            s.sentence_translated = s.editText!;
            s.isEditing = false;
          },
          error: (err) => { console.error(err); }
        });
      return;
    }

    // normal: sentence.id present
    this.translatorService.addCorrection({ sentence_id: s.id, correction_text: s.editText! }).subscribe({
      next: (res) => {
        // backend renvoie la correction ; ici on met à jour l'affichage
        // adapter selon la forme de la réponse backend
        s.sentence_translated = s.editText!;
        s.isEditing = false;
      },
      error: (err) => console.error(err)
    });
  }
}
