import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';
import { AppComponentBase } from '@shared/app-component-base';
import { TenantListDto, TenantServiceProxy } from '@shared/service-proxies/service-proxies';
import { NzMessageService } from 'ng-zorro-antd';
import { CreateTenantModalComponent } from './create-tenant-modal.component';
import { EditTenantModalComponent } from './edit-tenant-modal.component';

@Component({ selector: 'app-tenant-list', templateUrl: './tenant-list.component.html', styles: [] })
export class TenantListComponent extends AppComponentBase implements OnInit {
    @ViewChild('st') st: SimpleTableComponent;
    q: any = {
        pi: 1,
        ps: 10,
        total: 20,
        sorter: '',
        status: null,
        statusList: [],
    };
    data: any;
    columns: SimpleTableColumn[] = [
        {
            title: '操作', buttons: [
                {
                    text: '编辑',
                    type: 'modal',
                    component: EditTenantModalComponent,
                    paramName: 'tenantPara',
                    click: () => this.load(),
                },
                { text: '订阅警报', click: (item: any) => this._msgService.success(`订阅警报${item.no}`), },
            ],
        },
        { title: this.l('Name'), index: 'name' },
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
    constructor(injector: Injector,

        public http: HttpClient,
        public _msgService: NzMessageService,
        private _tenantService: TenantServiceProxy,
        private _activatedRoute: ActivatedRoute, ) {
        super(injector);
        // this.setFiltersFromRoute();
    }

    ngOnInit() {
        this.getTenants();
    }

    load(pi?: number) {
        this.getTenants();
    }
    resetSearch() {
        // this.setFiltersFromRoute();
        this.load();
    }

    getTenants() {
        this.loading = true;
        this._tenantService.getTenants(
            this.filters.filterText,
            this.filters.subscriptionEndDateRange ? this.filters.subscriptionEndDateRange[0] : undefined,
            this.filters.subscriptionEndDateRangeActive ? this.filters.subscriptionEndDateRange[1] : undefined,
            this.filters.creationDateRangeActive ? this.filters.creationDateRangeActive[0] : undefined,
            this.filters.creationDateRangeActive ? this.filters.creationDateRangeActive[1] : undefined,
            this.filters.selectedEditionId,
            this.filters.selectedEditionId !== undefined && (this.filters.selectedEditionId + '') !== '-1',
            '',
            this.st.ps,
            (this.st.pi - 1) * this.st.ps)
            .finally(() => { this.loading = false; })
            .subscribe(result => {
                this.data = result.items;
                this.st.total = result.totalCount;
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

    deleteTenant(tenant: TenantListDto): void {
        // this.modal.open
        //     .confirm(
        //         {
        //             nzTitle: this.l('TenantDeleteWarningMessage', tenant.tenancyName),
        //             nzOnOk: () => {
        //                 this
        //                     ._tenantService
        //                     .deleteTenant(tenant.id)
        //                     .subscribe(() => {
        //                         this.load();
        //                         this
        //                             .notify
        //                             .success(this.l('SuccessfullyDeleted'));
        //                     });

        //             }
        //         }
        //     );
    }
}
