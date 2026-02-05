import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layouts/layout.component';
import { RoleGuard } from './core/guards/role.guard';
import { AdminComponent } from './pages/admin/admin.component';
import { TraductionComponent } from './pages/traduction/traduction.component';
import { CorrectionComponent } from './pages/correction/correction.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';

const routes: Routes = [
  { path: '', component: LayoutComponent, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)},
  { path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
  { path: 'admin', component: AdminComponent, canActivate: [RoleGuard], data: { roles: ['Admin', 'Super_admin'] } },
  // { path: 'translate', component: TranslatorComponent, canActivate: [RoleGuard], data: { roles: ['Traducteur', 'Admin', 'Super_admin'] } },
  { path: 'correction', component: CorrectionComponent, canActivate: [RoleGuard], data: { roles: ['Correcteur', 'Admin', 'Super_admin'] } },
  { path: 'unauthorized', component: UnauthorizedComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
