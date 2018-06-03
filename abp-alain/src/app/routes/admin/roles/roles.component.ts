
import { Component, Injector, ViewChild, OnInit } from '@angular/core';
import { RoleListDto, RoleServiceProxy } from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
// import { CreateOrEditRoleModalComponent } from './create-or-edit-role-modal.component';
import { AppComponentBase } from '@shared/app-component-base';
import { SimpleTableComponent, SimpleTableColumn } from '@delon/abc';
import { CreateOrEditRoleModalComponent } from './create-or-edit-role-modal.component';

@Component({
    selector: 'app-roles',
    templateUrl: './roles.component.html'
})
export class RolesComponent extends AppComponentBase implements OnInit {
    @ViewChild('st') st: SimpleTableComponent;
    // Filters
    selectedPermission = '';
    data: any;
    /**
     * st 绑定列
     */
    columns: SimpleTableColumn[] = [
        {
            title: this.l('Name'),
            render: 'displayName'
        },
        { title: this.l('CreationTime'), type: 'date', index: 'creationTime' },
        {
            title: this.l('Actions'),
            buttons: [
                {
                    text: this.l('Edit'),
                    type: 'modal',
                    paramName: 'rolePara',
                    component: CreateOrEditRoleModalComponent,
                    click: (record: any, modal: any) => this.getRoles()
                },
                {
                    text: this.l('Delete'),
                    type: 'none',
                    click: (record: any) => this.deleteRole(record)
                }
            ]
        }
    ];

    constructor(
        injector: Injector,
        private roleService: RoleServiceProxy
    ) {
        super(injector);
    }
    ngOnInit() {
        this.getRoles();
    }
    getRoles(): void {
        this.roleService.getRoles(this.selectedPermission || undefined).subscribe(result => {
            this.data = result.items;
        });
    }

    createRole(): void {
        this.modalHelper.open(
            CreateOrEditRoleModalComponent,
            {
                rolePara: null
            }).subscribe(() => {
                this.getRoles();
            });
    }
    /**
     * 删除角色
     * @param role 当前的角色行
     */
    deleteRole(role: RoleListDto): void {
        this.modal.confirm(
            {
                nzTitle: this.l('RoleDeleteWarningMessage', role.displayName),
                nzOnOk: () => {
                    this.roleService.deleteRole(role.id).subscribe(() => {
                        this.getRoles();
                        this.msg.success(this.l('SuccessfullyDeleted'));
                    });
                }
            }
        );
    }
}
