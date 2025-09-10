import { Component } from '@angular/core';

type Card = {
  img: string;
  title: string;
  location: string;
  rating?: number;
  pricePerNight: number; // en XOF / EUR juste pour l’affichage
  dates?: string;
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
}
