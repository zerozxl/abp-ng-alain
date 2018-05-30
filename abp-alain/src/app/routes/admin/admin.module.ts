import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { NzTreeModule } from 'ng-zorro-antd';
import { AdminRoutingModule } from './admin-routing.module';
// import { CreateOrEditRoleModalComponent } from './roles/create-or-edit-role-modal.component';
// import { PermissionTreeComponent } from './roles/permission-tree.component';
// import { RoleComponent } from './roles/role.component';
// import { CreateOrEditUserModalComponent } from './users/create-or-edit-user-modal.component';
// import { ImpersonationService } from './users/impersonation.service';
// import { UsersComponent } from './users/users.component';
import { TenantListComponent } from './tenants/tenant-list.component';
import { CommonModule } from '@angular/common';
import { CreateTenantModalComponent } from './tenants/create-tenant-modal.component';
import { EditTenantModalComponent } from './tenants/edit-tenant-modal.component';
import { EditionComboComponent } from './tenants/edition-combo.component';
import { LanguagesComponent } from './languages/languages.component';
import { CreateOrEditLanguageComponent } from './languages/create-or-edit-language.component';
import { LanguageTextsComponent } from './languages/language-texts.component';
import { EditLanguateTextModalComponent } from './languages/edit-languate-text-modal.component';
// import { CreateOrEditRoleModalComponent } from './roles/create-or-edit-role-modal.component';
import { RolesComponent } from './roles/roles.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        AdminRoutingModule,
        NzTreeModule],
    providers: [
        // ImpersonationService
    ],
    declarations: [
        RolesComponent,
        // PermissionTreeComponent,
        // CreateOrEditRoleModalComponent,
        // UsersComponent,
        // CreateOrEditUserModalComponent,
        TenantListComponent,
        CreateTenantModalComponent,
        EditTenantModalComponent,
        EditionComboComponent,
        LanguagesComponent,
        CreateOrEditLanguageComponent,
        LanguageTextsComponent,
        EditLanguateTextModalComponent
    ],
    entryComponents: [
        // CreateOrEditRoleModalComponent,
        // CreateOrEditUserModalComponent,
        CreateTenantModalComponent,
        EditTenantModalComponent,
        CreateOrEditLanguageComponent,
        EditLanguateTextModalComponent
    ]
})
export class AdminModule { }
