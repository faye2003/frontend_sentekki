import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { TranslatorService } from './translator.service';
import { TranslatorData } from './translator.model';

@Component({
  selector: 'app-translator',
  templateUrl: './translator.component.html'
})
export class TranslatorComponent implements OnInit {
  inputText = '';
  output_text = '';
  translatedText = '';
  translatorData!: TranslatorData;
  sentences: string[] = [];
  errorMessage = '';

  constructor(private translatorService: TranslatorService) {}

  ngOnInit(): void {}

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
    this.output_text = '';
    this.translatedText = '';
    this.adjustTextareaHeight();
  }

  copyOutput() {
    if (this.translatedText) {
      navigator.clipboard.writeText(this.translatedText);
      alert('Traduction copié');
    }
  }

  onTranslate() {
    
    this.translatorService.translate(this.inputText, 'fr', 'en').subscribe({
      next: (res) => {
        this.translatedText = res.output_text;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load data';
      }
    });
  }

  editSentence(sentence: any) {
    sentence.isEditing = true;
    sentence.editText = sentence.sentence_translated; // Pré-rempli avec la phrase actuelle
  }

  cancelEdit(sentence: any) {
    sentence.isEditing = false;
  }

  saveCorrection(sentence: any) {
    if (!sentence.editText || sentence.editText === sentence.sentence_translated) {
      sentence.isEditing = false;
      return;
    }

    const payload = {
      sentence: sentence.id,
      corrected_text: sentence.editText
    };

    this.translatorService.addCorrection(payload).subscribe({
      next: (res) => {
        sentence.sentence_translated = res.corrected_text; // Mise à jour avec correction
        sentence.isEditing = false;
      },
      error: (err) => console.error(err)
    });
  }


  // onInputChange() {
  //   if (this.inputText.trim() === '') {
  //     this.translatedText = '';
  //     return;
  //   }

  //   this.translatorService.translate(this.inputText, 'fr', 'en').subscribe({
  //     next: (res) => {
  //       if (res.success) {
  //         this.translatedText = res.translated_text;
  //         this.errorMessage = '';
  //       } else {
  //         this.errorMessage = 'Translation failed';
  //       }
  //     },
  //     error: (err) => {
  //       console.error(err);
  //       this.errorMessage = 'Failed to load data';
  //     }
  //   });
  // }

  
}
