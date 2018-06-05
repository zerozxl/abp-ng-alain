import { Component, ViewChild, Injector, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { PagedResultDtoOfNameValueDto, NameValueDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { AppConsts } from '@core/abp/AppConsts';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';
import { NzModalRef } from 'ng-zorro-antd';

export interface ICommonLookupModalOptions {
    title?: string;
    isFilterEnabled?: boolean;
    dataSource: (skipCount: number, maxResultCount: number, filter: string, tenantId?: number) => Observable<PagedResultDtoOfNameValueDto>;
    canSelect?: (item: NameValueDto) => boolean | Observable<boolean>;
    loadOnStartup?: boolean;
    pageSize?: number;
}
@Component({
    selector: 'app-commonlookupmodal',
    templateUrl: './common-lookup-modal.component.html'
})
/**
 * 通用的NameValue的选择器组件
 */
export class CommonLookupModalComponent extends AppComponentBase {
    /**
     * 外部的行点击事件
     */
    @Output() itemSelected: EventEmitter<NameValueDto> = new EventEmitter<NameValueDto>();
    static defaultOptions: ICommonLookupModalOptions = {
        dataSource: null,
        canSelect: () => true,
        loadOnStartup: true,
        isFilterEnabled: true,
        pageSize: AppConsts.grid.defaultPageSize
    };
    @ViewChild('st') st: SimpleTableComponent;
    data: any;
    columns: SimpleTableColumn[] = [
        { title: 'Name', i18n: 'Name', index: 'name', sorter: (a, b) => true },
        {
            title: 'Login', i18n: 'Login', buttons: [
                {
                    text: 'Actions', i18n: 'Actions',
                    format: (record: any) => '<i class="anticon anticon-login">' + this.l('Login') + '</i>',
                    click: (record: any) => this.selectItem(record)
                }
            ]
        }];
    options: ICommonLookupModalOptions;
    isInitialized = false;
    filterText = '';
    tenantId?: number;

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    configure(opts: ICommonLookupModalOptions): void {
        this.options = Object.assign(
            true,
            {
                title: this.l('SelectAnItem')
            },
            CommonLookupModalComponent.defaultOptions,
            opts
        );
    }
    getRecordsIfNeeds(): void {
        if (!this.options.loadOnStartup && !this.isInitialized) {
            return;
        }
        this.getRecords();
        this.isInitialized = true;
    }
    /**
     * 通过组件传入的方法获取记录
     */
    getRecords(): void {
        this.options
            .dataSource(((this.st.pi - 1) * this.st.ps), this.st.ps, this.filterText, this.tenantId)
            .subscribe(result => {
                this.data = result.items;
                this.st.total = result.totalCount;
                const pi = this.st.pi;
                setTimeout(() => {
                    this.st.pi = pi;
                }, 50);
            });
    }

    selectItem(item: NameValueDto) {
        const boolOrPromise = this.options.canSelect(item);
        if (!boolOrPromise) {
            return;
        }
        if (boolOrPromise === true) {
            this.itemSelected.emit(item);
            this.close();
            return;
        }
        // assume as observable
        (boolOrPromise as Observable<boolean>)
            .subscribe(result => {
                if (result) {
                    this.itemSelected.emit(item);
                    this.close();
                }
            });
    }
    close(): void {
        // this.modalRef.destroy();
    }

}
