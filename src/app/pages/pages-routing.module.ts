import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { TranslatorComponent } from './translator/translator.component';
import { TranslatorLastComponent } from './translator-last/translator-last.component';
import { TranslatorFusionComponent } from './translator-fusion/translator-fusion.component';


const routes: Routes = [
  {
    path: 'translate',
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
    path: 'translate-last',
    component: TranslatorLastComponent
  }
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
