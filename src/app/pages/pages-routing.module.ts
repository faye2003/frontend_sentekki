import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { TranslatorLastComponent } from './translator-last/translator-last.component';
import { HistoriqueComponent } from './historique/historique.component';
import { CorrectionComponent } from './correction/correction.component';
import { OutilComponent } from './outils/outil.component';
import { DictionnaireComponent } from './dictionnaire/dictionnaire.component';
import { TraductionComponent } from './traduction/traduction.component';


const routes: Routes = [
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
    component: TraductionComponent
  },
  {
    path: 'traduire',
    component: TranslatorLastComponent
  },
  {
    path: 'correction',
    component: CorrectionComponent
  },
  {
    path: 'outil',
    component: OutilComponent
  },
  {
    path: 'dictionnaire',
    component: DictionnaireComponent
  },
  {
    path: '',
    component: TraductionComponent
  }
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
