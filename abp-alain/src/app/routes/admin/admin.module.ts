import { AuditLogsComponent } from './audit-logs/audit-logs.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { NzTreeModule } from 'ng-zorro-antd';
import { AdminRoutingModule } from './admin-routing.module';
import { CreateOrEditUserModalComponent } from './users/create-or-edit-user-modal.component';
import { UsersComponent } from './users/users.component';
import { TenantListComponent } from './tenants/tenant-list.component';
import { CommonModule } from '@angular/common';
import { CreateTenantModalComponent } from './tenants/create-tenant-modal.component';
import { EditTenantModalComponent } from './tenants/edit-tenant-modal.component';
import { EditionComboComponent } from './tenants/edition-combo.component';
import { LanguagesComponent } from './languages/languages.component';
import { CreateOrEditLanguageComponent } from './languages/create-or-edit-language.component';
import { LanguageTextsComponent } from './languages/language-texts.component';
import { EditLanguateTextModalComponent } from './languages/edit-languate-text-modal.component';
import { RolesComponent } from './roles/roles.component';
import { PermissionSelectComponent } from './shared/permission-select.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { AuditLogDetailModalComponent } from './audit-logs/audit-log-detail-modal.component';
import { PermissionTreeComponent } from './shared/permission-tree.component';
import { CreateOrEditRoleModalComponent } from './roles/create-or-edit-role-modal.component';
import { RoleSelectComponent } from './shared/role-select.component';
import { EditUserPermissionsModalComponent } from './users/edit-user-permissions-modal.component';
import { OrganizationUnitsTreeComponent } from './shared/organization-unit-tree.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        AdminRoutingModule,
        NzTreeModule],
    providers: [
        
    ],
    declarations: [
        RolesComponent,
        PermissionTreeComponent,
        RoleSelectComponent,
        CreateOrEditRoleModalComponent,
        UsersComponent,
        EditUserPermissionsModalComponent,
        CreateOrEditUserModalComponent,
        AuditLogDetailModalComponent,
        AuditLogsComponent,
        TenantListComponent,
        CreateTenantModalComponent,
        EditTenantModalComponent,
        EditionComboComponent,
        LanguagesComponent,
        CreateOrEditLanguageComponent,
        LanguageTextsComponent,
        EditLanguateTextModalComponent,
        MaintenanceComponent,
        // shared
        PermissionSelectComponent,
        OrganizationUnitsTreeComponent
    ],
    entryComponents: [
        EditUserPermissionsModalComponent,
        CreateOrEditRoleModalComponent,
        CreateOrEditUserModalComponent,
        AuditLogDetailModalComponent,
        CreateTenantModalComponent,
        EditTenantModalComponent,
        CreateOrEditLanguageComponent,
        EditLanguateTextModalComponent
    ]
})
export class AdminModule { }
