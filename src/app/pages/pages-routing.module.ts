import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { TranslatorComponent } from './translator/translator.component';
import { TranslatorLastComponent } from './translator-last/translator-last.component';
import { TranslatorFusionComponent } from './translator-fusion/translator-fusion.component';
import { HistoriqueComponent } from './historique/historique.component';


const routes: Routes = [
  {
    path: 'translate-last',
    component: TranslatorComponent,
  },
  {
    path: 'translate-fusion',
    component: TranslatorFusionComponent,
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'historique',
    component: HistoriqueComponent
  },
  {
    path: 'translate',
    component: TranslatorLastComponent
  },
  {
    path: '',
    component: TranslatorLastComponent
  }
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
