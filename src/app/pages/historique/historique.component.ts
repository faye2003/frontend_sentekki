import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
    /**
     * BreadCrumb Set
     */
    this.breadCrumbItems = [
      { label: 'Pages' },
      { label: 'Historique Page', active: true }
    ];
  }

}
