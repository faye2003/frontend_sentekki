import { Component, OnInit,
  ElementRef,
  ViewChild,
  TemplateRef,
 } from '@angular/core';
import { HistoriqueService } from './history.service';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Translation } from './types';
import { MOCK_TRANSLATIONS } from './mock-data';

@Component({
  selector: 'app-historique',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.scss']
})

/**
 * Historique Component
 */
export class HistoriqueComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  currentRate = 0;
  defaultSelect = 1;
  hovered = 0;
  readonly = false;
  customColor = 4;
  translations: any[] = [];
  mention = "";

  @ViewChild('autoResizeTextarea') autoResizeTextarea!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('content') content!: TemplateRef<any>;

  constructor(
    private historyService: HistoriqueService,
    private offcanvasService: NgbOffcanvas
  ) { }

  ngOnInit(): void {
    /**
     * BreadCrumb Set
     */
    this.breadCrumbItems = [
      { label: 'Pages' },
      { label: 'Historique', active: true }
    ];
    this.loadHistory();
  }

  // translations: Translation[] = MOCK_TRANSLATIONS;

  searchQuery = '';
  filter: 'all' | 'favorites' = 'all';

  copiedId: string | null = null;

  get stats() {
    return {
      total: this.translations.length,
      favorites: this.translations.filter(t => t.is_favorite).length,
      languages: new Set(this.translations.map(t => t.lang_src.code)).size
    };
  }

  get filteredTranslations() {

    return this.translations.filter(t => {

      const matchesSearch =
        t.input_text.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        t.output_text.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        t.lang_src.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        t.lang_dest.name.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesFilter =
        this.filter === 'all' ||
        (this.filter === 'favorites' && t.is_favorite);

      return matchesSearch && matchesFilter;
    });
  }

  toggleFavorite(id: string) {
    this.translations = this.translations.map(t =>
      t.id === id ? { ...t, is_favorite: !t.is_favorite } : t
    );
  }

  deleteTranslation(id: string) {
    this.translations = this.translations.filter(t => t.id !== id);
  }

  copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text);
    this.copiedId = id;

    setTimeout(() => {
      this.copiedId = null;
    }, 2000);
  }


  // Offcanvas Open Right
  openRight(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });
  }
  
  loadHistory(): void {
    this.historyService.getAllHistory().subscribe({
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
    if (rate === 5) {
      this.mention = 'Très bonne Traduction';
    } else if (rate === 4) {
      this.mention = 'Bonne Traduction';
    } else if (rate === 3) {
      this.mention = 'Moyenne Traduction';
    } else if (rate === 2) {
      this.mention = 'Faible Traducion';
    } else if (rate === 1) {
      this.mention = 'Mauvaise Taduction'
    }
    this.historyService.rateTranslation(translationId, rate, this.mention).subscribe({
      next: () => {
        console.log(`Traduction ${translationId} notée ${rate}/5`);
      },
      error: (err) => console.error('Erreur lors de la notation :', err)
    });
  }
}
