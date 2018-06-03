import { AuditLogsComponent } from './audit-logs/audit-logs.component';
import { LanguagesComponent } from './languages/languages.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { UsersComponent } from './users/users.component';
import { TenantListComponent } from './tenants/tenant-list.component';
import { LanguageTextsComponent } from './languages/language-texts.component';
import { RolesComponent } from './roles/roles.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { UsersComponent } from './users/users.component';


const routes: Routes = [
    { path: 'languages', component: LanguagesComponent, data: { reuse: true, title: 'language', titleI18n: 'Languages' } },
    { path: 'languages/:name/texts', component: LanguageTextsComponent },
    { path: 'tenants', component: TenantListComponent, data: { reuse: true, title: 'tenants', titleI18n: 'Tenants' } },
    { path: 'roles', component: RolesComponent, data: { reuse: true, title: 'roles', titleI18n: 'Roles' } },
    { path: 'auditlogs', component: AuditLogsComponent, data: { reuse: true, title: 'auditlogs', titleI18n: 'AuditLogs' } },
    { path: 'maintenance', component: MaintenanceComponent, data: { reuse: true, title: 'maintenance', titleI18n: 'Maintenance' } },
    
    { path: 'users', component: UsersComponent, data: { reuse: true, title: 'Users', titleI18n: 'Users' } },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
