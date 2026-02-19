import { Component, OnInit,
  ElementRef,
  ViewChild,
  TemplateRef,
 } from '@angular/core';
import { DictionnaireService } from './dictionnaire.service';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

type Status = 'pending' | 'corrected' | 'flagged' | 'all';

interface Translation {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  status: 'pending' | 'corrected' | 'flagged';
  createdAt: string;
  tags: string[];
}

interface DictionaryResponse {
  total: number;
  total_pages: number;
  page: number;
  results: any[];
}

@Component({
  selector: 'app-dictionnaire',
  templateUrl: './dictionnaire.component.html',
  styleUrls: ['./dictionnaire.component.scss']
})

/**
 * Historique Component
 */
export class DictionnaireComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  // ===== PAGINATION =====
  currentPage = 1;
  itemsPerPage = 5;

  dictionaryData: any[] = [];
  words: any[] = [];
  searchTerm: string = '';
  page: number = 1;
  pageSize: number = 20;
  totalPages: number = 0;
  total: number = 0

  // ===== FILTRES =====
  filters = {
    search: '',
    alphabet: null as string | null,
    status: 'all' as Status
  };

  constructor(
    private dictionaryService : DictionnaireService
  ) { }

  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  ngOnInit(): void {
    /**
     * BreadCrumb Set
     */
    this.breadCrumbItems = [
      { label: 'Page' },
      { label: 'Dictionnaire', active: true }
    ];
    this.getAllDictionnaire();
  }

  getAllDictionnaire() {
    console.log('Bibdhsdbhsd');
    this.dictionaryService.getDictionary(this.searchTerm, this.page, this.pageSize).subscribe({
      next: (data: DictionaryResponse) => {
        console.log('Données reçues:', data);
        this.words = data.results;
        // this.totalPages = data.total_pages;
        // this.total = data.total;
      },
      error: (error) => {
        console.error('Erreur:', error);
      }
    });
  }

   search() {
    this.page = 1;
    this.getAllDictionnaire();
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.getAllDictionnaire();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.getAllDictionnaire();
    }
  }

  onSearchChange() {
    this.currentPage = 1;
  }

  setStatus(status: Status) {
    this.filters.status = status;
    this.currentPage = 1;
  }

  setAlphabet(letter: string | null) {
    this.filters.alphabet = letter;
    this.currentPage = 1;
  }

  clearFilters() {
    this.filters = { search: '', alphabet: null, status: 'all' };
    this.currentPage = 1;
  }

}
