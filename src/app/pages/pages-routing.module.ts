import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { TranslatorComponent } from './translator/translator.component';
import { TranslatorTestComponent } from './translator-test/translator-test.component';


const routes: Routes = [
  {
    path: 'translate',
    component: TranslatorComponent,
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'translate-test',
    component: TranslatorTestComponent
  }
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
