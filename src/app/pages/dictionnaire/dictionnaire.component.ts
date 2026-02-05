import { Component, OnInit,
  ElementRef,
  ViewChild,
  TemplateRef,
 } from '@angular/core';
import { DictionnaireService } from './dictionnaire.service';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

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

  constructor(
  ) { }

  ngOnInit(): void {
    /**
     * BreadCrumb Set
     */
    this.breadCrumbItems = [
      { label: 'Pages' },
      { label: 'Bibliothèque Page', active: true }
    ];
  }

}
