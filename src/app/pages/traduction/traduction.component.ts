import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  HostListener,
  TemplateRef,
} from '@angular/core';
import { TraductionService } from './traduction.service';
import { Translator, CorrectionTranslator, Sentence } from './traduction.model';
import { Router } from '@angular/router';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/core/services/auth.service';
import Swal from 'sweetalert2';
import { result } from 'lodash';
import { ToastService } from './toast-service';

@Component({
  selector: 'app-traduction',
  templateUrl: './traduction.component.html',
  styleUrl: './traduction.component.scss'
})

export class TraductionComponent implements OnInit, AfterViewInit {
  inputText = '';
  output_text = '';
  charCount: number = 0;
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
  show = true;
  translucent = true;
  stacking = true;
  stackingsecond = true;
  placement = true;

  // profil role utilisateur
  userRole: string | null = null;
  username: string | null = null;

  currentRate = 0;
  hasRated = false;
  defaultSelect = 1;
  hovered = 0;
  readonly = false;
  customColor = 4;
  translations: any[] = [];
  mention = '';
  historySearch: string = '';

  
  filteredHistory: {
    input_text: string;
    output_text: string;
    date: Date;
    rate?: number;        // note donnée (1–5)
    mention?: string;     // commentaire associé
  }[] = [];

  @ViewChild('autoResizeTextarea') autoResizeTextarea!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('content') content!: TemplateRef<any>;
  @ViewChild('ratingModal') ratingModal!: TemplateRef<any>;


  constructor(
    private traductionService: TraductionService,
    private modalService: NgbModal,
    private authService: AuthService,
    private router: Router,
    private offcanvasService: NgbOffcanvas,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    /**
     * BreadCrumb Set
     */
    this.breadCrumbItems = [
      { label: 'Page' },
      { label: 'Tranducteur', active: true }
    ];
    this.getRoleUser();
    this.loadHistory();

    // Si l'utilisateur n'est pas connecté rediriger à la page de connection
    // if (!this.authService.isLoggedIn()) {
    //   this.router.navigate(['/account/login']);
    // }

  }

  /**
   * Standard message 
   */
  showStandard() {
    this.toastService.show('Normal Message', { classname: 'bg-primary text-center text-white', delay: 10000 });
  }

  /**
   * Success message 
   */
  showSuccess() {
    this.toastService.show('Success Message', { classname: 'bg-success text-center text-white', delay: 10000 });
  }

  /**
   * Danger message 
   */
  showDanger() {
    console.log("poitrtfghhj");
    this.toastService.show('Error Message', { classname: 'bg-danger text-center text-white', delay: 10000 });
  }

  /**
   * Warning message 
   */
  showWarning() {
    this.toastService.show('Warning Message', { classname: 'bg-warning text-center text-white', delay: 10000 });
  }

  getRoleUser() {
    this.authService.getUserRole().subscribe(role => {
      this.userRole = role;
      console.log(this.userRole);
    });
  }

  hasRole(...roles: string[]): boolean {
    return roles.includes(this.userRole || '');
  }

  onTextChange() {
    this.charCount = this.inputText.length;

    // Limite (facultative)
    if (this.charCount > 5000) {
      this.inputText = this.inputText.substring(0, 5000);
      this.charCount = 5000;
    }
  }

  loadHistory(): void {
    const saved = localStorage.getItem('translationHistory');

    if (saved) {
      this.translations = JSON.parse(saved);
      this.filterHistory();
      localStorage.setItem('translationHistory', JSON.stringify(this.translations));
    } else {
      this.traductionService.getUserHistory().subscribe({
        next: (res) => {
          this.translations = res;
          this.filterHistory();
        },
        error: (err) => console.error('Erreur chargement historique :', err)
      });
    }
  }


  filterHistory() {
    const search = this.historySearch.toLowerCase().trim();

    if (!search) {
      this.filteredHistory = [...this.translations];
    } else {
      this.filteredHistory = this.translations.filter(item =>
        item.input_text.toLowerCase().includes(search) ||
        item.output_text.toLowerCase().includes(search)
      );
    }
  }

  clearHistory() {
    if (confirm("Voulez-vous vraiment effacer tout l’historique ?")) {
      this.translations = [];
      this.filteredHistory = [];
    }
  }


  loadFromHistory(index: number) {
    const item = this.translations[index];
    this.inputText = item.source;
    this.translatedText = item.translated;
    this.charCount = this.inputText.length;
  }

  getMentionForRate(rate: number): string {
    if (rate === 5) return "Très bonne traduction";
    if (rate === 4) return "Bonne traduction !";
    if (rate === 3) return "Traduction moyenne";
    if (rate === 2) return "Traduction faible";
    return "Mauvaise traduction !";
  }

  onUserRate(rate: number) {
    if (!this.translatorData?.id) return;
    if (this.hasRated) return;

    this.hasRated = true;
    const mention = this.getMentionForRate(rate);

    this.traductionService.rateTranslation(this.translatorData.id, rate, mention)
      .subscribe({
        next: () => {

        // Mettre à jour la dernière traduction dans l’historique
        if (this.translations.length > 0) {
          this.translations[0].rate = rate;
          this.translations[0].mention = mention;
        }

        this.filterHistory(); // rafraîchir affichage
          this.modalService.dismissAll();

          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Merci pour votre évaluation ! ⭐',
            text: mention,
            showConfirmButton: false,
            timer: 2000
          });
        },
        error: (err) => console.error('Erreur lors de la notation :', err)
      });
  }

  onRate(translationId: number, rate: number): void {
    if (rate === 5) 
    {
      this.mention = "Très bonne traduction";
    } 
    else if (rate === 4)
    {
      this.mention = "Bonne traduction !";
    }
    else if (rate === 3)
    {
      this.mention = "Moyenne Traduction";
    } 
    else if (rate === 2) 
    {
      this.mention = "Faible note de la traduction !";
    } 
    else if (rate === 1) 
    {
      this.mention = "Mauvaise traduction !";
    }
    this.traductionService.rateTranslation(translationId, rate, this.mention).subscribe({
      next: () => {
        console.log(`Traduction ${translationId} notée ${rate}/5`);
      },
      error: (err) => console.error('Erreur lors de la notation :', err)
    });
  }

  ngAfterViewInit() {
    this.adjustTextareaHeight();
  }

  /** Ajuste la hauteur du textarea automatiquement */
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

  /** Efface le contenu */
  clearInput() {
    this.inputText = '';
    this.translatedText = '';
  }

  /** Copie la traduction */
  copyOutput() {
    if (this.translatedText) {
      navigator.clipboard.writeText(this.translatedText);
      /**
       * Danger message 
       */
      console.log("Bonjour");
      this.showDanger();
      // Swal.fire({
      //   toast: true,
      //   position: 'top-end',
      //   icon: 'success',
      //   title: 'Copié !',
      //   showConfirmButton: false,
      //   timer: 1500
      // });
    }
  }

  openRatingModal() {
    this.currentRate = 0; // reset
    this.modalService.open(this.ratingModal, { centered: true });
  }


  /** Traduire le texte */
  onTranslate() {
    if (!this.inputText.trim()) {
      this.error = 'Veuillez saisir un texte à traduire';
      return;
    }
    this.hasRated = false; // reset pour nouvelle traduction

    this.loading = true;
    this.error = '';
    const payload = { input_text: this.inputText, lang_src: 'fr', lang_dest: 'en' };

    this.traductionService.translate(payload).subscribe({
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

        // Ajouter à l'historique local (sans note pour l'instant)
        this.translations.unshift({
          input_text: this.inputText,
          output_text: this.translatedText,
          date: new Date(),
          rate: 0,
          mention: ''
        });

        this.filterHistory(); // mettre à jour l'affichage

        // OUVRIR LA POPUP DE NOTATION
        setTimeout(() => {
          this.openRatingModal();
        }, 3000);
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


  /** Lorsqu’on clique sur une phrase traduite */
  handleSentenceClick(sentence: string) {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/account/login']);
      return;
    }

    this.selectedSentence = sentence;
    this.correctedText = sentence;
    this.modalService.open(this.content, { centered: true });
  }

  /** Confirme la correction */
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

    // appel service
    this.traductionService.addCorrection(payload).subscribe({
      next: () => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Correction envoyée',
          showConfirmButton: false,
          timer: 1500
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

  // action confirmation de la correction
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

  // action fermeture modal
  closeModal(_modalname: any) {
    this.modalService.dismissAll();
    this.selectedSentence = null;
    this.correctedText = '';
    this.isModalOpen = false;
    this.errorMessage = "";
    this.error = ""
  }

  // action ouverture modal
  openModal(modalname: any) {
    this.isModalOpen = true;
    this.modalService.open(modalname, { centered: true });
  }

}
