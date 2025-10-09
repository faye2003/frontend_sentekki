import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, HostListener, TemplateRef } from '@angular/core';
import { TranslatorFusionService } from './translator-fusion.service';
import { TranslatorFusionData, Sentence } from './translator-fusion.model';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
declare var bootstrap: any;

@Component({
  selector: 'app-translator-fusion',
  templateUrl: './translator-fusion.component.html',
  styleUrls: ['./translator-fusion.component.scss']
})
export class TranslatorFusionComponent implements OnInit {
  inputText = '';
  output_text = '';
  translatedText = '';
  errorMessage = '';
  isSubmitted = false;
  isReadonly: boolean = true;
  textareaContent: string = "This is some read-only text.";
  isModalOpen: boolean = false;
  translatorData: TranslatorFusionData | null = null;
  currentSentence: Sentence | null = null;
  loading = false;
  error = ''; 

  constructor(
    private translatorService: TranslatorFusionService, 
    private readonly fb: FormBuilder, 
    private readonly modalService: NgbModal,
    private authService: AuthService,
    private router: Router
  ){}

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

  private refreshTranslatedText() {
    if (!this.translatorData) return;
    this.translatedText = this.translatorData.sentences
      .map(s => s.sentence_translated)
      .join(" ");
  }

  @ViewChild('content') content!: TemplateRef<any>; // importer TemplateRef

  handleSentenceClick(sentence: Sentence) {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/account/login']);
      return;
    }

    this.currentSentence = sentence;
    this.modalService.open(this.content, { centered: true });
  }

  onTranslate() {
    this.loading = true;
    this.error = '';
    const payload = { text: this.inputText, lang_src: 'fr', lang_dest: 'en' };

    this.translatorService.translate(payload).subscribe({
      next: (res) => {
        this.translatedText = res.output_text;
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

  // onTranslate() {
  //   if (this.inputText.trim() === '') {
  //     this.translatedText = '';
  //     return;
  //   }
    
  //   this.translatorService.translate(this.inputText, 'fr', 'en').subscribe({
  //     next: (res) => {
  //       this.translatedText = res.output_text;
  //     },
  //     error: (err) => {
  //       console.error(err);
  //       this.errorMessage = 'Failed to load data';
  //     }
  //   });
  // }

  editSentence(sentence: Sentence) {
    sentence.isEditing = true;
    sentence.editText = sentence.sentence_translated; // Pré-rempli avec la phrase actuelle
    this.currentSentence = sentence;
  }

  cancelEdit(sentence: any) {
    sentence.isEditing = false;
  }

  saveCorrection(sentence: Sentence) {
    if (!sentence.editText || sentence.editText.trim() === sentence.sentence_translated.trim()) {
      sentence.isEditing = false;
      return;
    }
    console.log('Bonjour jh§!');


    if (!this.translatorData?.id) {
      console.error("Translator ID manquant !");
      return;
    }

    const payload = {
      translator_id: this.translatorData.id,
      sentence_index: sentence.sentence_number,
      corrected_text: sentence.editText
    };

    this.translatorService.addCorrection(payload).subscribe({
      next: () => {
        sentence.sentence_translated = sentence.editText!;
        sentence.isEditing = false;
        this.refreshTranslatedText();
      },
      error: (err) => console.error(err)
    });
  }

  selectedSentence: any = null;

  setSentence(sentence: any) {
    this.selectedSentence = sentence;
  }

  // confirmCorrection(sentence: any) {
  //   this.saveCorrection(sentence);

  //   // ✅ Fermer le modal automatiquement après confirmation
  //   const modalEl = document.getElementById('confirmModal');
  //   const modal = bootstrap.Modal.getInstance(modalEl);
  //   modal.hide();
  // }

  ConfirmCorrection() 
  {
    if (this.currentSentence) {
      this.saveCorrection(this.currentSentence);
      this.currentSentence = null;
      this.closeModal('Ok')
    } 
    else 
    {
      this.error = "Aucun phrase trouvé !";
    }
  }

  // saveCorrection(sentence: any) {
    
  //   this.isSubmitted = true;
  //   if (!sentence.editText || sentence.editText === sentence.sentence_translated) {
  //     sentence.isEditing = false;
  //     return;
  //   }

  //   const payload = {
  //     sentence: sentence.id,
  //     corrected_text: sentence.editText
  //   };

  //   this.translatorService.addCorrection(payload).subscribe({
  //     next: (res) => {
  //       sentence.sentence_translated = res.corrected_text; // Mise à jour avec correction
  //       sentence.isEditing = false;
  //     },
  //     error: (err) => console.error(err)
  //   });
  // }

  closeModal(_modalname: any) {
    this.isModalOpen = false;
    this.modalService.dismissAll();
    this.errorMessage = "";
    this.error = ""
  }

  openModal(modalname: any) {
    this.isModalOpen = true;
    this.modalService.open(modalname, { centered: true });
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
