import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef, OnInit } from '@angular/core';
import { RoleServiceProxy, RoleEditDto, CreateOrUpdateRoleInput, RoleListDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { AppComponentBase } from '@shared/app-component-base';
import { NzModalRef } from 'ng-zorro-antd';
import { PermissionTreeComponent } from '../shared/permission-tree.component';

@Component({
    selector: 'app-createOrEditRoleModal',
    templateUrl: './create-or-edit-role-modal.component.html'
})
export class CreateOrEditRoleModalComponent extends AppComponentBase implements OnInit {

    @ViewChild('permissionTree') permissionTree: PermissionTreeComponent;
    active = false;
    saving = false;
    rolePara : RoleListDto;
    role: RoleEditDto = new RoleEditDto();
    constructor(
        private modalRef: NzModalRef,
        injector: Injector,
        private roleService: RoleServiceProxy
    ) {
        super(injector);
    }
/**
     * 初始化
     */
    ngOnInit(): void {
        this.getRole();
    }
    getRole(): void {
        this.roleService.getRoleForEdit(this.rolePara?this.rolePara.id:undefined).subscribe(result => {
            this.role = result.role;
            this.permissionTree.editData = result;
        });
    }

    save(): void {
        // console.log(this.permissionTree.getGrantedPermissionNames());
        const input = new CreateOrUpdateRoleInput();
        input.role = this.role;
        input.grantedPermissionNames = this.permissionTree.getGrantedPermissionNames();
        this.saving = true;
        this.roleService.createOrUpdateRole(input)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.msg.success(this.l('SavedSuccessfully')); 
                this.modalRef.close(true);               
            });
    }

    close(): void {
        this.modalRef.destroy();
    }
}
