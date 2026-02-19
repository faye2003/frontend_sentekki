import { Component, OnInit, TemplateRef } from '@angular/core';
import { CorrectionTranslator, Translator, Sentence } from './correction.model';
import { CorrectionService } from './correction.service';
import { Router } from '@angular/router';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/core/services/auth.service';
import Swal from 'sweetalert2';
import { result } from 'lodash';

type Status = 'pending' | 'corrected' | 'flagged' | 'all';

// interface Translation {
//   id: string;
//   sourceText: string;
//   translatedText: string;
//   sourceLang: string;
//   targetLang: string;
//   status: 'pending' | 'corrected' | 'flagged';
//   createdAt: string;
//   tags: string[];
// }


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
  mention = '';
  historySearch: string = '';

  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    private router: Router,
    private correctionService: CorrectionService
  ) {}

  // // ===== MOCK DATA (à remplacer par ton service plus tard) =====
  // translations: Translation[] = [
  //   { id: '1', sourceText: 'The early bird catches the worm.', translatedText: "L'oiseau matinal attrape le ver.", sourceLang: 'en', targetLang: 'fr', status: 'pending', createdAt: '2023-11-01T10:00:00Z', tags: ['idiom', 'nature'] },
  //   { id: '2', sourceText: 'Break a leg!', translatedText: 'Casse une jambe!', sourceLang: 'en', targetLang: 'fr', status: 'pending', createdAt: '2023-11-02T11:30:00Z', tags: ['expression', 'theater'] },
  //   { id: '3', sourceText: 'Better late than never.', translatedText: 'Mieux vaut tard que jamais.', sourceLang: 'en', targetLang: 'fr', status: 'corrected', createdAt: '2023-11-03T09:15:00Z', tags: ['proverb'] },
  //   { id: '4', sourceText: 'A piece of cake.', translatedText: 'Un morceau de gâteau.', sourceLang: 'en', targetLang: 'fr', status: 'pending', createdAt: '2023-11-04T14:45:00Z', tags: ['idiom', 'food'] },
  //   { id: '5', sourceText: 'Call it a day.', translatedText: 'Appelez ça un jour.', sourceLang: 'en', targetLang: 'fr', status: 'flagged', createdAt: '2023-11-05T16:20:00Z', tags: ['work', 'idiom'] },
  //   { id: '10', sourceText: 'Feeling under the weather.', translatedText: 'Se sentir sous la météo.', sourceLang: 'en', targetLang: 'fr', status: 'pending', createdAt: '2023-11-10T11:55:00Z', tags: ['health', 'idiom'] },
  // ];

  // ===== FILTRES =====
  filters = {
    search: '',
    alphabet: null as string | null,
    status: 'all' as Status
  };

  // ===== PAGINATION =====
  currentPage = 1;
  itemsPerPage = 5;

  // ===== MODAL =====
  selectedTranslation: Translator | null = null;
  modalMode: 'view' | 'edit' = 'view';
  editedText = '';

  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

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

  loadTranslations() {
    this.correctionService.getTranslations().subscribe({
      next: (response) => {
        this.translations = response; // IMPORTANT
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

  get totalPages(): number {
    return Math.ceil(this.filteredTranslations.length / this.itemsPerPage);
  }

  get paginatedItems(): Translator[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredTranslations.slice(start, start + this.itemsPerPage);
  }

  onSearchChange() {
    this.currentPage = 1;
  }

  setAlphabet(letter: string | null) {
    this.filters.alphabet = letter;
    this.currentPage = 1;
  }

  deleteTranslation(id?: number) {
    if (!id) return;

    if (confirm('Voulez-vous vraiment supprimer cette traduction ?')) {
      this.translations = this.translations.filter(t => t.id !== id);
    }
  }

  openModal(translation: Translator, mode: 'view' | 'edit', modal: any) {
    this.selectedTranslation = translation;
    this.modalMode = mode;
    this.editedText = translation.output_text || '';
    this.modalService.open(modal, { centered: true });
  }

  closeModal(_modalname: any) {
    this.modalService.dismissAll();
  }

  ConfirmCorrection() {
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
}
