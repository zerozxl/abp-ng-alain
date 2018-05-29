import { LanguagesComponent } from './languages/languages.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { RoleComponent } from './roles/role.component';
// import { UsersComponent } from './users/users.component';
import { TenantListComponent } from './tenants/tenant-list.component';
import { LanguageTextsComponent } from './languages/language-texts.component';


const routes: Routes = [
    // {
    //     path: 'roles',
    //     component: RoleComponent
    // },
    { path: 'languages', component: LanguagesComponent, data: { reuse: true , title: 'languages'} },
    { path: 'languages/:name/texts', component: LanguageTextsComponent },
    { path: 'tenants', component: TenantListComponent, data: { reuse: true, title: 'tenants' } },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
