import { Component, OnInit } from '@angular/core';
import { DictionnaireService } from './dictionnaire.service';
import { DictionaryEntry } from './dictionnaire.model';

@Component({
  selector: 'app-dictionnaire',
  templateUrl: './dictionnaire.component.html',
  styleUrls: ['./dictionnaire.component.scss']
})
export class DictionnaireComponent implements OnInit {

  searchTerm: string = '';
  activeLetter: string | null = null;
  alphabetMode: 'WO' | 'FR' = 'WO';

  FRENCH_ALPHABET: string[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
  WOLOF_ALPHABET: string[] = "A B C D E Ë F G I J K L M N Ñ Ŋ O P Q R S T U W X Y".split(' ');

  words: any[] = [];

  page: number = 1;
  pageSize: number = 6;
  totalPages: number = 1;
  total: number = 0;

  loading: boolean = false;

  // ===== PAGINATION =====
  currentPage = 1;
  maxVisiblePages: number = 5

  constructor(private dictionaryService: DictionnaireService) {}

  ngOnInit(): void {
    this.getAllDictionnaire();
  }

  get alphabet(): string[] {
    return this.alphabetMode === 'WO' ? this.WOLOF_ALPHABET : this.FRENCH_ALPHABET;
  }

  getAllDictionnaire() {
    this.loading = true;

    this.dictionaryService.getDictionary(
      this.searchTerm,
      this.currentPage,
      this.pageSize,
      this.activeLetter
    ).subscribe({
      next: (data) => {
        this.words = data.results;
        this.total = data.count;
        this.totalPages = data.total_pages;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;

    this.currentPage = page;
    this.getAllDictionnaire();

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

  onSearchChange() {
    this.currentPage = 1;
    this.getAllDictionnaire();
  }

  toggleAlphabet(mode: 'WO' | 'FR') {
    this.alphabetMode = mode;
    this.activeLetter = null;
    this.page = 1;
    this.getAllDictionnaire();
  }

  selectLetter(letter: string) {
    this.activeLetter = this.activeLetter === letter ? null : letter;
    this.currentPage = 1;
    this.getAllDictionnaire();
  }

  resetFilters() {
    this.searchTerm = '';
    this.activeLetter = null;
    this.page = 1;
    this.getAllDictionnaire();
  }

}
