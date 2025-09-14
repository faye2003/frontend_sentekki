import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { TranslatorComponent } from './translator/translator.component';


const routes: Routes = [
  {
    path: 'translate',
    component: TranslatorComponent,
    title: 'Traduction'
  },
  {
    path: 'home',
    component: HomeComponent
  }
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
