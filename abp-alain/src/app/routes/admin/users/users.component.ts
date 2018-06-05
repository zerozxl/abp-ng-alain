import { Component, Injector, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { UserServiceProxy, UserListDto, EntityDtoOfInt64 } from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
// import { CreateOrEditUserModalComponent } from './create-or-edit-user-modal.component';
import { ImpersonationService } from './impersonation.service';
import { AppComponentBase } from '@shared/app-component-base';
import { SimpleTableComponent, SimpleTableColumn } from '@delon/abc';
import { EditUserPermissionsModalComponent } from './edit-user-permissions-modal.component';
import { CreateOrEditUserModalComponent } from './create-or-edit-user-modal.component';
import { AppConsts } from '@core/abp/AppConsts';

@Component({
    templateUrl: './users.component.html'
})
export class UsersComponent extends AppComponentBase implements OnInit {

    // @ViewChild('createOrEditUserModal') createOrEditUserModal: CreateOrEditUserModalComponent;
    @ViewChild('st') st: SimpleTableComponent;
    data: any;
    // Filters
    advancedFiltersAreShown = false;
    filterText = '';
    selectedPermission = '';
    selectedRole: number = undefined;
    columns: SimpleTableColumn[] = [
        { title: 'UserName', i18n: 'UserName', index: 'userName', sorter: (a, b) => true },
        { title: 'Name', i18n: 'Name', index: 'name', sorter: (a, b) => true },
        { title: 'Surname', i18n: 'Surname', index: 'surname', sorter: (a, b) => true },
        { title: 'Roles', i18n: 'Roles', render: 'roles' },
        { title: 'EmailAddress', i18n: 'EmailAddress', index: 'emailAddress', sorter: (a, b) => true },
        { title: 'EmailConfirm', i18n: 'EmailConfirm', render: 'isEmailConfirmed', sorter: (a, b) => true },
        { title: 'Active', i18n: 'Active', render: 'isActive', sorter: (a, b) => true },
        { title: 'LastLoginTime', i18n: 'LastLoginTime', type: 'date', index: 'lastLoginTime', sorter: (a, b) => true },
        { title: 'CreationTime', i18n: 'CreationTime', type: 'date', index: 'creationTime' },
        {
            title: 'Actions',
            i18n: 'Actions',
            buttons: [
                {
                    text: 'Edit',
                    i18n: 'Edit',
                    type: 'modal',
                    paramName: 'userPara',
                    component: CreateOrEditUserModalComponent,
                    click: (record: any, modal: any) => this.getUsers()
                },
                {
                    text: 'More',
                    i18n: 'More',
                    children: [
                        {
                            text: 'Permissions',
                            i18n: 'Permissions',
                            paramName: 'userPara', type: 'modal',
                            component: EditUserPermissionsModalComponent,
                        },
                        {
                            text: 'Unlock',
                            i18n: 'Unlock',
                            click: (record: any) => this.unlockUser(record)
                        }
                        ,
                        {
                            text: 'Delete',
                            i18n: 'Delete',
                            click: (record: any) => this.deleteUser(record)
                        }
                    ]
                }
            ]
        }
    ];
    constructor(
        injector: Injector,
        public _impersonationService: ImpersonationService,
        private _userServiceProxy: UserServiceProxy,
        private _fileDownloadService: FileDownloadService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute
    ) {
        super(injector);
        this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
    }


    ngOnInit() {
        this.getUsers(undefined);
    }
    /**
     * 遵循服务端，排序参数设置
     */
    sortChange(ret: any) {
        let sort;
        if (ret.value) {
            if (ret.value === 'descend') {
                sort = ret.column.index + ' desc';
            } else {
                sort = ret.column.index + ' asc';
            }
        }
        // console.log(sort);
        this.getUsers(sort);
    }
    /**
     * 检索用户
     * @param sort 排序
     */
    getUsers(sort?: string | undefined) {
        this.loading = true;
        this._userServiceProxy.getUsers(
            this.filterText,
            this.permission ? this.selectedPermission : undefined,
            this.selectedRole,
            sort,
            this.st.ps,
            (this.st.pi - 1) * this.st.ps
        ).finally(() => { this.loading = false; })
            .subscribe(result => {
                this.st.total = result.totalCount;
                this.data = result.items;
                const pi = this.st.pi;
                setTimeout(() => {
                    this.st.pi = pi;
                }, 50);
            });
    }
    /**
     * 解锁用户
     * @param record 用户列表DTO
     */
    unlockUser(record): void {
        this._userServiceProxy.unlockUser(new EntityDtoOfInt64({ id: record.id })).subscribe(() => {
            this.msg.success(this.l('UnlockedTheUser', record.userName));
        });
    }
    /**
     * 显示角色名称
     */
    getRolesAsString(roles): string {
        let roleNames = '';
        for (let j = 0; j < roles.length; j++) {
            if (roleNames.length) {
                roleNames = roleNames + ', ';
            }
            roleNames = roleNames + roles[j].roleName;
        }
        return roleNames;
    }

    exportToExcel(): void {
        this._userServiceProxy.getUsersToExcel()
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }
    /**
     * 弹出框创建用户
     */
    createUser(): void {
        this.modalHelper.open(
            CreateOrEditUserModalComponent,
            {
                userPara: null
            }).subscribe(() => {
                this.getUsers(undefined);
            });
    }
    /**
     * 删除用户
     * @param user 用户行
     */
    deleteUser(user: UserListDto): void {
        if (user.userName === AppConsts.userManagement.defaultAdminUserName) {
            this.msg.info(this.l('{0}UserCannotBeDeleted', AppConsts.userManagement.defaultAdminUserName));
            return;
        }
        this.modal.confirm(
            {
                nzTitle: this.l('UserDeleteWarningMessage', user.userName),
                nzOnOk: () => {
                    this._userServiceProxy.deleteUser(user.id).subscribe(() => {
                        this.getUsers(undefined);
                        this.msg.success(this.l('SuccessfullyDeleted'));
                    });
                }
            }
        );
    }
}
