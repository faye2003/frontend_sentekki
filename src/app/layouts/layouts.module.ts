import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SimplebarAngularModule } from 'simplebar-angular';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    TopbarComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    FeatherModule.pick(allIcons),
    NgbDropdownModule,
    SimplebarAngularModule,
  ],
  providers: [],
  exports: [HeaderComponent, TopbarComponent, SidebarComponent]
})
export class LayoutsModule { }
