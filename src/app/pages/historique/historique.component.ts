import { Component, OnInit,
  ElementRef,
  ViewChild,
  TemplateRef,
 } from '@angular/core';
import { HistoriqueService } from './history.service';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

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
      { label: 'Historique Page', active: true }
    ];
    this.loadHistory();
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
