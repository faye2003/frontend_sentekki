import { Component, OnInit,
  ElementRef,
  ViewChild,
  TemplateRef,
 } from '@angular/core';
import { OutilService } from './outil.service';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-outil',
  templateUrl: './outil.component.html',
  styleUrls: ['./outil.component.scss']
})

/**
 * Historique Component
 */
export class OutilComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor(
  ) { }

  ngOnInit(): void {
    /**
     * BreadCrumb Set
     */
    this.breadCrumbItems = [
      { label: 'Page' },
      { label: 'Dictionnaire', active: true }
    ];
  }

}
