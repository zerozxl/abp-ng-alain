import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';
import { AppComponentBase } from '@shared/app-component-base';
import { EntityDtoOfInt64, NameValueDto, TenantListDto, TenantServiceProxy, FindUsersInput, CommonLookupServiceProxy } from '@shared/service-proxies/service-proxies';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ImpersonationService } from '../users/impersonation.service';
import { CreateTenantModalComponent } from './create-tenant-modal.component';
import { EditTenantModalComponent } from './edit-tenant-modal.component';
import { CommonLookupModalComponent } from '@shared/lookup/common-lookup-modal.component';

@Component({ selector: 'app-tenant-list', templateUrl: './tenant-list.component.html', styles: [] })
export class TenantListComponent extends AppComponentBase implements OnInit {
    @ViewChild('st') st: SimpleTableComponent;
    @ViewChild('impersonateUserLookupModal') impersonateUserLookupModal: CommonLookupModalComponent;
    isVisible: boolean = false;// 是否显示选择用户登录框
    nzModalFooter: any = null;
    data: any;
    columns: SimpleTableColumn[] = [
        { title: this.l('TenancyCodeName'), index: 'tenancyName', sorter: (a, b) => true },
        { title: this.l('Name'), index: 'name', sorter: (a, b) => true },
        { title: this.l('Edition'), index: 'editionDisplayName', sorter: (a, b) => true },
        { title: this.l('SubscriptionEndDateUtc'), index: 'subscriptionEndDateUtc', type: 'date', sorter: (a, b) => true },
        { title: this.l('Active'), index: 'isActive', render: 'active', sorter: (a, b) => true },
        {
            title: '操作', buttons: [
                {
                    text: '编辑',
                    type: 'modal',
                    component: EditTenantModalComponent,
                    paramName: 'tenantPara',
                    click: () => this.load(),
                },
                {
                    text: 'More',
                    i18n: 'More',
                    children: [
                        {
                            text: 'LoginAsThisTenant',
                            i18n: 'LoginAsThisTenant',
                            click: (record: any) => this.showUserImpersonateLookUpModal(record)
                        },
                        {
                            text: 'Delete',
                            i18n: 'Delete',
                            click: (record: any) => this.deleteTenant(record)
                        },
                        {
                            text: 'Unlock',
                            i18n: 'Unlock',
                            click: (record: any) => this.unlockUser(record)
                        }
                    ]
                }
            ],
        },
    ];
    expandForm = false;
    filters: {
        filterText: string;
        creationDateRangeActive: boolean;
        subscriptionEndDateRangeActive: boolean;
        subscriptionEndDateRange: [null, null];
        creationDateRange: [null, null];
        selectedEditionId: number;
    } = <any>{};
    // tslint:disable-next-line:max-line-length
    constructor(injector: Injector, private modalService: NzModalService,
        public http: HttpClient,
        public _msgService: NzMessageService,
        private _tenantService: TenantServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _commonLookupService: CommonLookupServiceProxy,
        private _impersonationService: ImpersonationService) {
        super(injector);
        // this.setFiltersFromRoute();
    }

    ngOnInit() {
        this.getTenants();
        this.impersonateUserLookupModal.configure({
            title: this.l('SelectAUser'),
            dataSource: (skipCount: number, maxResultCount: number, filter: string, tenantId?: number) => {
                const input = new FindUsersInput();
                input.filter = filter;
                input.maxResultCount = maxResultCount;
                input.skipCount = skipCount;
                input.tenantId = tenantId;
                return this._commonLookupService.findUsers(input);
            }
        });
    }

    load(pi?: number) {
        this.getTenants();
    }
    resetSearch() {
        // this.setFiltersFromRoute();
        this.load();
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
        this.getTenants(sort);
    }
    getTenants(sort?: string | undefined) {
        this.loading = true;
        this._tenantService.getTenants(
            this.filters.filterText,
            this.filters.subscriptionEndDateRange ? this.filters.subscriptionEndDateRange[0] : undefined,
            this.filters.subscriptionEndDateRangeActive ? this.filters.subscriptionEndDateRange[1] : undefined,
            this.filters.creationDateRangeActive ? this.filters.creationDateRangeActive[0] : undefined,
            this.filters.creationDateRangeActive ? this.filters.creationDateRangeActive[1] : undefined,
            this.filters.selectedEditionId,
            this.filters.selectedEditionId !== undefined && (this.filters.selectedEditionId + '') !== '-1',
            sort,
            this.st.ps,
            (this.st.pi - 1) * this.st.ps)
            .finally(() => { this.loading = false; })
            .subscribe(result => {
                this.data = result.items;
                this.st.total = result.totalCount;
                const pi = this.st.pi;
                setTimeout(() => {
                    this.st.pi = pi;
                }, 50);
            });
    }

    createTenant(): void {
        this.modalHelper.open(
            CreateTenantModalComponent,
            {
                tenancyId: null
            }).subscribe(() => {
                this.load();
            });
    }
    showUserImpersonateLookUpModal(record: any): void {
        this.impersonateUserLookupModal.tenantId = record.id;
        this.impersonateUserLookupModal.getRecordsIfNeeds();
        this.isVisible = true;
    }

    handleOk(): void {
        this.isVisible = false;
    }

    handleCancel(): void {
        this.isVisible = false;
    }
    // /**
    //   * 
    //   */
    // showUserImpersonateLookUpModal(record: any): void {
    //     this.modalHelper.open(
    //         CommonLookupModalComponent,
    //         {
    //             tenantId: record.id,
    //             optionsPara: this.lookupConfig,
    //             itemSelected: (item: NameValueDto) => { this.impersonateUser(item); }
    //         }).subscribe(() => {

    //         });
    //     // this.impersonateUserLookupModal.tenantId = record.id;
    //     // this.impersonateUserLookupModal.show();
    // }
    /**
     * 删除租户
     * @param record 租户记录
     */
    unlockUser(record: any): void {
        this._tenantService.unlockTenantAdmin(new EntityDtoOfInt64({ id: record.id })).subscribe(() => {
            this.msg.success(this.l('UnlockedTenandAdmin', record.name));
        });
    }
    /**
     * 删除租户
     * @param tenant 租户DTO
     */
    deleteTenant(tenant: TenantListDto): void {
        this.modal.confirm(
            {
                nzTitle: this.l('TenantDeleteWarningMessage', tenant.tenancyName),
                nzOnOk: () => {
                    this._tenantService.deleteTenant(tenant.id).subscribe(() => {
                        this.getTenants();
                        this.msg.success('SuccessfullyDeleted');
                    });

                }
            }
        );
    }

    impersonateUser(item: NameValueDto): void {
        console.log(item);
        // this._impersonationService
        //     .impersonate(
        //         parseInt(item.value),
        //         this.impersonateUserLookupModal.tenantId
        //     );
    }
}
