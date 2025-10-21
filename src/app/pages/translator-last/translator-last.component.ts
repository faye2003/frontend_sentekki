import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  HostListener,
  TemplateRef,
} from '@angular/core';
import { TranslatorLastService } from './translator-last.service';
import { Translator, CorrectionTranslator, Sentence } from './translator-last.model';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-translator-last',
  templateUrl: './translator-last.component.html',
  styleUrls: ['./translator-last.component.scss'],
})
export class TranslatorLastComponent implements OnInit, AfterViewInit {
  inputText = '';
  output_text = '';
  translatedText = '';
  isSubmitted = false;
  translatorData: Translator | null = null;
  loading = false;
  error = '';
  errorMessage = '';
  currentSentence: Sentence | null = null;
  selectedSentence: string | null = null;
  correctedText: string = '';
  isModalOpen: boolean = false;

  @ViewChild('autoResizeTextarea') autoResizeTextarea!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('content') content!: TemplateRef<any>;

  constructor(
    private translatorService: TranslatorLastService,
    private modalService: NgbModal,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.adjustTextareaHeight();
  }

  /** 🔹 Ajuste la hauteur du textarea automatiquement */
  @HostListener('input')
  onInput() {
    this.adjustTextareaHeight();
  }

  adjustTextareaHeight() {
    const textarea = this.autoResizeTextarea?.nativeElement;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }

  /** 🔹 Efface le contenu */
  clearInput() {
    this.inputText = '';
    this.translatedText = '';
  }

  /** 🔹 Copie la traduction */
  copyOutput() {
    if (this.translatedText) {
      navigator.clipboard.writeText(this.translatedText);
    }
  }

  /** 🔹 Traduire le texte */
  onTranslate() {
    if (!this.inputText.trim()) {
      this.error = 'Veuillez saisir un texte à traduire';
      return;
    }

    this.loading = true;
    this.error = '';
    const payload = { input_text: this.inputText, lang_src: 'fr', lang_dest: 'en' };

    this.translatorService.translate(payload).subscribe({
      next: (res) => {
        this.translatorData = res;
        // transform output_sentence en objets éditables si ce n'est pas déjà fait
        if (this.translatorData?.output_sentence) {
          this.translatorData.output_sentence = this.translatorData.output_sentence.map((p: any) => {
            // si p est string -> convertit en objet, sinon préserve et ajoute les champs d'édition
            const text = typeof p === 'string' ? p : (p.text ?? '');
            return {
              text,
              isEditing: false,
              editText: text
            };
          });
        }
        this.translatedText = res.output_text ?? '';
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Erreur lors de la traduction';
        this.loading = false;
      },
    });
  }

  // ouvre le mode édition pour une phrase (on reçoit l'objet phrase et son index)
  editSentence(sentence: any) {
    if (this.translatorData?.output_sentence) {
      this.translatorData.output_sentence.forEach((s: any) => {
        s.isEditing = false;
        s.editText = s.text;
      });
    }

    sentence.isEditing = true;
    sentence.editText = sentence.text;
    this.currentSentence = sentence;
  }

  // annule l'édition (remet le texte original)
  cancelEdit(sentence: any) {
    sentence.isEditing = false;
    sentence.editText = sentence.text;
    // si currentSentence était celle-ci, la réinitialiser
    if (this.currentSentence === sentence) {
      this.currentSentence = null;
    }
  }


  /** 🔹 Lorsqu’on clique sur une phrase traduite */
  handleSentenceClick(sentence: string) {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/account/login']);
      return;
    }

    this.selectedSentence = sentence;
    this.correctedText = sentence;
    this.modalService.open(this.content, { centered: true });
  }

  /** 🔹 Confirme la correction */
  saveCorrection(sentence: Sentence) {
    // if (!sentence.editText || sentence.editText.trim() === sentence.phrase_corrigee.trim()) {
    //   sentence.isEditing = false;
    //   return;
    // }
    if (!this.selectedSentence || !this.translatorData) {
      this.error = 'Aucune phrase sélectionnée';
      return;
    }

    if (!this.translatorData?.id) {
      console.error("La traduction n'existe pas !");
      return;
    }

    const payload: CorrectionTranslator = {
      translator_id: this.translatorData.id,
      phrase_source: this.selectedSentence,
      phrase_corrigee: this.correctedText,
    };

    this.translatorService.addCorrection(payload).subscribe({
      next: () => {
        this.modalService.dismissAll();
      },
      error: (err) => {
        console.error(err);
        this.error = 'Erreur lors de la sauvegarde de la correction';
      },
    });
  }

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

  closeModal(_modalname: any) {
    this.modalService.dismissAll();
    this.selectedSentence = null;
    this.correctedText = '';
    this.isModalOpen = false;
    this.errorMessage = "";
    this.error = ""
  }

  openModal(modalname: any) {
    this.isModalOpen = true;
    this.modalService.open(modalname, { centered: true });
  }

}
