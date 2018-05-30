import { LanguagesComponent } from './languages/languages.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { UsersComponent } from './users/users.component';
import { TenantListComponent } from './tenants/tenant-list.component';
import { LanguageTextsComponent } from './languages/language-texts.component';
import { RolesComponent } from './roles/roles.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';


const routes: Routes = [
    { path: 'languages', component: LanguagesComponent, data: { reuse: true , title: 'languages'} },
    { path: 'languages/:name/texts', component: LanguageTextsComponent },
    { path: 'tenants', component: TenantListComponent, data: { reuse: true, title: 'tenants' } },
    { path: 'roles', component: RolesComponent, data: { reuse: true, title: 'roles' } },
    { path: 'maintenance', component: MaintenanceComponent, data: { reuse: true, title: 'maintenance' } },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
