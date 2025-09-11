import { Component } from '@angular/core';
import { TranslatorService } from './translator.service';

@Component({
  selector: 'app-translator',
  templateUrl: './translator.component.html'
})
export class TranslatorComponent {
  inputText = '';
  translatedText = '';
  errorMessage = '';

  constructor(private translatorService: TranslatorService) {}

  onTranslate() {
    this.translatorService.translate(this.inputText, 'fr', 'en').subscribe({
      next: (res) => {
        if (res.success) {
          this.translatedText = res.translated_text;
          this.errorMessage = '';
        } else {
          this.errorMessage = 'Translation failed';
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load data';
      }
    });
  }
}
