import { Component, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
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

  @ViewChild('autoResizeTextarea') autoResizeTextarea!: ElementRef<HTMLTextAreaElement>;
  textValue: string = '';

  ngAfterViewInit() {
    this.adjustTextareaHeight();
  }

  @HostListener('input')
  onInput() {
    this.adjustTextareaHeight();
  }

  adjustTextareaHeight() {
    const textarea = this.autoResizeTextarea.nativeElement;
    textarea.style.height = 'auto'; // Réinitialise la hauteur pour que le scrollHeight soit calculé correctement
    textarea.style.height = textarea.scrollHeight + 'px'; // Définit la hauteur au scrollHeight
  }

  clearInput() {
    this.inputText = '';
    this.translatedText = '';
    this.adjustTextareaHeight();
  }

  copyOutput() {
    if (this.translatedText) {
      navigator.clipboard.writeText(this.translatedText);
      alert('Traduction copié');
    }
  }

  onInputChange() {
    if (this.inputText.trim() === '') {
      this.translatedText = '';
      return;
    }

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
