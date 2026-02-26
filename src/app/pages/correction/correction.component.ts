import { Component, OnInit, TemplateRef } from '@angular/core';
import { CorrectionTranslator, Translator, Sentence } from './correction.model';
import { CorrectionService } from './correction.service';
import { Router } from '@angular/router';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/core/services/auth.service';
import Swal from 'sweetalert2';
import { result } from 'lodash';

type Status = 'pending' | 'corrected' | 'flagged' | 'all';


@Component({
  selector: 'app-correction',
  templateUrl: './correction.component.html',
  styleUrls: ['./correction.component.scss']
})

export class CorrectionComponent implements OnInit{

  inputText = '';
  output_text = '';
  charCount: number = 0;
  translatedText = '';
  isSubmitted = false;
  translatorData: Translator | null = null;
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
  item: Translator[] = [];

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
  formattedSentences: any[] = [];
  mention = '';
  historySearch: string = '';

  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    private router: Router,
    private correctionService: CorrectionService
  ) {}

  // ===== FILTRES =====
  filters = {
    search: '',
    alphabet: null as string | null,
    status: 'all' as Status
  };

  // ===== PAGINATION =====
  currentPage = 1;
  itemsPerPage = 10;
  page: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  total: number = 0;
  maxVisiblePages: number = 5;

  loading: boolean = false;

  // ===== MODAL =====
  selectedTranslation: Translator | null = null;
  modalMode: 'view' | 'edit' = 'view';
  editedText = '';
  
  searchTerm: string = '';
  activeLetter: string | null = null;
  alphabetMode: 'WO' | 'FR' = 'WO';
  statusFilter = ''; // 'corrected' | 'pending'

  // alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  FRENCH_ALPHABET: string[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
  WOLOF_ALPHABET: string[] = "A B C D E Ë F G I J K L M N Ñ Ŋ O P Q R S T U W X Y".split(' ');


  ngOnInit() {
    /**
     * BreadCrumb Set
     */
    this.breadCrumbItems = [
      { label: 'Page' },
      { label: 'Correction', active: true }
    ];

    this.loadTranslations();
  }

  get alphabet(): string[] {
    return this.alphabetMode === 'WO' ? this.WOLOF_ALPHABET : this.FRENCH_ALPHABET;
  }

  loadTranslations() {
    this.correctionService
      .getTranslations(this.currentPage, this.itemsPerPage, this.statusFilter)
      .subscribe({
        next: (response) => {
          this.translations = response.results;
          this.totalPages = response.total_pages;
          this.currentPage = response.page;
        },
        error: (err) => console.error(err)
      });
  }

  // ===== FILTRAGE =====
  get filteredTranslations(): Translator[] {
    return this.translations
      .filter(item => {

        const matchesSearch =
          item.input_text?.toLowerCase().includes(this.filters.search.toLowerCase()) ||
          item.output_text?.toLowerCase().includes(this.filters.search.toLowerCase());

        const matchesAlphabet =
          !this.filters.alphabet ||
          item.input_text?.toUpperCase().startsWith(this.filters.alphabet);

        const matchesStatus =
          this.filters.status === 'all' || item.status === this.filters.status;

        return matchesSearch && matchesAlphabet && matchesStatus;
      })
      .sort((a, b) =>
        new Date(b.created_at || '').getTime() -
        new Date(a.created_at || '').getTime()
      );
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    console.log('jdhfgfgdf');
    this.currentPage = page;
    this.loadTranslations();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  get visiblePages(): number[] {
    const pages: number[] = [];

    let start = Math.max(1, this.currentPage - Math.floor(this.maxVisiblePages / 2));
    let end = start + this.maxVisiblePages - 1;

    if (end > this.totalPages) {
      end = this.totalPages;
      start = Math.max(1, end - this.maxVisiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }


  get paginatedItems(): Translator[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredTranslations.slice(start, start + this.itemsPerPage);
  }

  toggleAlphabet(mode: 'WO' | 'FR') {
    this.alphabetMode = mode;
    this.activeLetter = null;
    this.page = 1;
    this.loadTranslations();
  }

  onSearchChange() {
    this.currentPage = 1;
  }

  setAlphabet(letter: string | null) {
    this.filters.alphabet = letter;
    this.currentPage = 1;
  }

  filterBy(status: string) {
    this.statusFilter = status;
    this.currentPage = 1; // reset page
    this.loadTranslations();
  }

  deleteTranslation(id?: number) {
    if (!id) return;

    if (confirm('Voulez-vous vraiment supprimer cette traduction ?')) {
      this.translations = this.translations.filter(t => t.id !== id);
    }
  }


  editSentence(sentence: any) {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/account/login']);
      return;
    }
    this.formattedSentences.forEach(s => s.isEditing = false);
    sentence.isEditing = true;
    this.selectedSentence = sentence;
    this.correctedText = sentence;
  }

  cancelEdit(sentence: any) {
    sentence.isEditing = false;
    sentence.editText = sentence.text;
  }


  openModal(translation: Translator, mode: 'view' | 'edit', modal: any) {
    this.selectedTranslation = translation;
    this.modalMode = mode;

    // Transformer les phrases string en objets éditables
    this.formattedSentences = (translation.output_sentence || []).map((text: string) => ({
      text: text,
      editText: text,
      isEditing: false
    }));

    this.modalService.open(modal, { centered: true });
  }

  // action ouverture modal
  openModall(modalname: any) {
    this.isModalOpen = true;
    this.modalService.open(modalname, { centered: true });
  }

  closeModal(_modalname: any) {
    this.modalService.dismissAll();
  }

  ConfirmsssCorrection() {
    if (!this.selectedTranslation?.id) return;

    const payload: CorrectionTranslator = {
      translator_id: this.selectedTranslation.id,
      phrase_source: this.selectedTranslation.input_text,
      phrase_corrigee: this.editedText
    };

    this.correctionService.addCorrection(payload).subscribe({
      next: () => {

        // Mise à jour locale
        this.translations = this.translations.map(t =>
          t.id === this.selectedTranslation!.id
            ? { ...t, output_text: this.editedText, status: 'corrected' }
            : t
        );

        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Correction envoyée',
          showConfirmButton: false,
          timer: 1500
        });

        this.closeModal('Ok');
      },
      error: (err) => {
        Swal.fire('Erreur', err || 'Erreur serveur', 'error');
      }
    });
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
      this.correctionService.addCorrection(payload).subscribe({
        next: () => {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Correction envoyée',
            showConfirmButton: false,
            timer: 1500
          });
          this.loadTranslations();
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
    confirmCorrection(sentence: Sentence) {

      if (!this.selectedTranslation?.id) {
        console.error("La traduction n'existe pas !");
        return;
      }

      if (!this.selectedSentence) {
        Swal.fire('Erreur', 'La phrase source est vide', 'error');
        return;        
      }

      if (!sentence.editText || sentence.editText.trim() === '') {
        Swal.fire('Erreur', 'La phrase corrigée est vide', 'error');
        return;
      }

      const payload: CorrectionTranslator = {
        translator_id: this.selectedTranslation.id,
        phrase_source: this.selectedSentence,
        phrase_corrigee: sentence.editText
      };

      this.correctionService.addCorrection(payload).subscribe({
        next: () => {

          sentence.phrase_corrigee = sentence.editText!; // <- maintenant garanti
          sentence.isEditing = false;

          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Correction envoyée',
            showConfirmButton: false,
            timer: 1500
          });

          this.loadTranslations();
          this.modalService.dismissAll();
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Erreur', 'Erreur backend', 'error');
        }
      });
    }
}
