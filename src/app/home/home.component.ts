import { CommonModule } from '@angular/common';
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
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
}
