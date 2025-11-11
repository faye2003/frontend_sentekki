import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  HostListener,
  TemplateRef,
} from '@angular/core';
import { TranslatorService } from './translator.service';
import { Translator, CorrectionTranslator, Sentence } from './translator.model';
import { Router } from '@angular/router';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/core/services/auth.service';
import Swal from 'sweetalert2';
import { result } from 'lodash';

@Component({
  selector: 'app-translator',
  templateUrl: './translator.component.html',
  styleUrls: ['./translator.component.scss'],
})
export class TranslatorComponent implements OnInit, AfterViewInit {
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
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  currentRate = 0;
  defaultSelect = 1;
  hovered = 0;
  readonly = false;
  customColor = 4;
  translations: any[] = [];

  @ViewChild('autoResizeTextarea') autoResizeTextarea!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('content') content!: TemplateRef<any>;

  constructor(
    private translatorService: TranslatorService,
    private modalService: NgbModal,
    private authService: AuthService,
    private router: Router,
    private offcanvasService: NgbOffcanvas
  ) {}

  ngOnInit(): void {
    /**
     * BreadCrumb Set
     */
    this.breadCrumbItems = [
      { label: 'Pages' },
      { label: 'Tranduction Page', active: true }
    ];
    this.loadHistory();
  }

  loadHistory(): void {
    this.translatorService.getUserHistory().subscribe({
      next: (res) => {
        this.translations = res;
        console.log(res);
      },
      error: (err) => {
        console.error('Erreur chargement historique :', err);
      }
    });
  }

  onRate(translationId: number, rate: number): void {
    this.translatorService.rateTranslation(translationId, rate, 'Très bonne traduction').subscribe({
      next: () => {
        console.log(`Traduction ${translationId} notée ${rate}/5`);
      },
      error: (err) => console.error('Erreur lors de la notation :', err)
    });
  }

  ngAfterViewInit() {
    this.adjustTextareaHeight();
  }

  /** 🔹 Ajuste la hauteur du textarea automatiquement */
  @HostListener('input')
  onInput() {
    this.adjustTextareaHeight();
  }

  // Offcanvas Open Right
  openRight(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });
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
        Swal.fire('Erreur!', err.error?.error || 'Une erreur est survenue lors de la traduction.', 'error');
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
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Text corrigé avec succès',
          showConfirmButton: false,
          timer: 1500,
        });
        this.modalService.dismissAll();
      },
      error: (err) => {
        console.error(err);
        this.error = 'Erreur lors de la sauvegarde de la correction';
        Swal.fire('Erreur!', err.error?.error || 'Erreur lors de la sauvegarde de la correction.', 'error');
      },
    });
  }

  ConfirmCorrection() 
  {
    if (this.currentSentence) {
      this.saveCorrection(this.currentSentence);
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
