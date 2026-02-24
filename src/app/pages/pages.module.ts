import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { WidgetModule } from '../shared/widget/widget.module';

// counter
import { CountUpModule } from 'ngx-countup';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SimplebarAngularModule } from 'simplebar-angular';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
// import { LightboxModule } from 'ngx-lightbox';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { PagesRoutingModule } from './pages-routing.module';
import { HomeComponent } from './home/home.component';
import { TranslatorLastComponent } from './translator-last/translator-last.component';
import { HistoriqueComponent } from './historique/historique.component';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { CorrectionComponent } from './correction/correction.component';
import { OutilComponent } from './outils/outil.component';
import { DictionnaireComponent } from './dictionnaire/dictionnaire.component';
import { TraductionComponent } from './traduction/traduction.component';
import { ToastsContainer } from './traduction/toasts-container.component';


@NgModule({
  declarations: [
    HomeComponent,
    TranslatorLastComponent,
    HistoriqueComponent,
    CorrectionComponent,
    OutilComponent,
    DictionnaireComponent,
    TraductionComponent,
    ToastsContainer
  ],
  imports: [
    CommonModule,
    CountUpModule,
    NgApexchartsModule,
    WidgetModule,
    NgbRatingModule,
    PagesRoutingModule,
    SharedModule,
    SimplebarAngularModule,
    CarouselModule,
    FeatherModule.pick(allIcons),
    RouterModule,
    NgbDropdownModule,
    NgbNavModule,
    LeafletModule,
    ReactiveFormsModule,
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PagesModule { }
