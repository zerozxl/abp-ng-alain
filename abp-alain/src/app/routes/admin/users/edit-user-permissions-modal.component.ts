import { Component, ViewChild, Injector, OnInit } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { UserServiceProxy, GetUserPermissionsForEditOutput, UpdateUserPermissionsInput, EntityDtoOfInt64, UserListDto } from '@shared/service-proxies/service-proxies';
import { PermissionTreeComponent } from '../shared/permission-tree.component';

import * as _ from 'lodash';
import { AppComponentBase } from '@shared/app-component-base';
import { NzModalRef } from 'ng-zorro-antd';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'editUserPermissionsModal',
    templateUrl: './edit-user-permissions-modal.component.html'
})
export class EditUserPermissionsModalComponent extends AppComponentBase implements OnInit {

    @ViewChild('permissionTree') permissionTree: PermissionTreeComponent;
    saving = false;
    resettingPermissions = false;
    userPara: UserListDto;
    constructor(private modalRef: NzModalRef,
        injector: Injector,
        private userService: UserServiceProxy
    ) {
        super(injector);
    }
    ngOnInit(): void {
        this.getPermission();
    }
    getPermission() {
        this.userService.getUserPermissionsForEdit(this.userPara.id).subscribe(result => {
            this.permissionTree.editData = result;
        });
    }
    save(): void {
        const input = new UpdateUserPermissionsInput();
        input.id = this.userPara.id;
        input.grantedPermissionNames = this.permissionTree.getGrantedPermissionNames();
        this.saving = true;
        this.userService.updateUserPermissions(input)
            .finally(() => { this.saving = false; })
            .subscribe(() => {
                this.msg.success(this.l('SavedSuccessfully'));
                this.modalRef.close(true);
            });
    }
    resetPermissions(): void {
        const input = new EntityDtoOfInt64();
        input.id = this.userPara.id;
        this.resettingPermissions = true;
        this.userService.resetUserSpecificPermissions(input).subscribe(() => {
            this.msg.success(this.l('ResetSuccessfully'));
            this.userService.getUserPermissionsForEdit(this.userPara.id).subscribe(result => {
                this.permissionTree.editData = result;
            });
        }, undefined, () => {
            this.resettingPermissions = false;
        });
    }

    close(): void {
        this.modalRef.destroy();
    }
}
