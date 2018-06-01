import { Component, Injector, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';
import { AppComponentBase } from '@shared/app-component-base';
import { AuditLogListDto, AuditLogServiceProxy } from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as moment from 'moment';
import { AuditLogDetailModalComponent } from './audit-log-detail-modal.component';
@Component({
    templateUrl: './audit-logs.component.html',
    styleUrls: ['./audit-logs.component.less'],
    encapsulation: ViewEncapsulation.None
})
export class AuditLogsComponent extends AppComponentBase implements OnInit {

    @ViewChild('st') st: SimpleTableComponent;
    data: any;
    defaultLanguageName: any;
    columns: SimpleTableColumn[] = [
        { title: 'Success', i18n: 'Success', render: 'exception' },
        {
            title: 'Time', i18n: 'Time', type: 'date',
            index: 'executionTime',
            sorter: (a, b) => true
        },
        { title: 'UserName', i18n: 'UserName', index: 'userName' },
        { title: 'Service', i18n: 'Service', index: 'serviceName' },
        { title: 'Action', i18n: 'Action', index: 'methodName' },
        {
            title: 'Duration', i18n: 'Duration', render: 'executionDuration',
            index: 'executionDuration',
            sorter: (a, b) => true
        },
        { title: 'IpAddress', i18n: 'IpAddress', index: 'clientIpAddress' },
        { title: 'Client', i18n: 'Client', index: 'clientName' },
        { title: 'Browser', i18n: 'Browser', render: 'browserInfo' },
        {
            title: 'Actions',
            i18n: 'Actions',
            buttons: [
                {
                    text: 'Detail',
                    i18n: 'Detail',
                    type: 'modal',
                    paramName: 'auditLogPara',
                    //   acl: 'Pages.Administration.Languages.Edit',
                    component: AuditLogDetailModalComponent,
                    click: (record: any, modal: any) => this.getAuditLogs()
                }
            ]
        }
    ];
    // Filters
    q: any = {
        dateRange: [moment().startOf('day'), moment().endOf('day')],
        userName: '',
        serviceName: '',
        methodName: '',
        browserInfo: '',
        hasException: undefined,
        minExecutionDuration: 0,
        maxExecutionDuration: 0,
    };
    advancedFiltersAreShown = false;

    constructor(
        injector: Injector,
        private auditLogService: AuditLogServiceProxy,
        private fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }
    ngOnInit(): void {
        // tslint:disable-next-line:max-line-length
        this.getAuditLogs();
    }
    showDetails(record: AuditLogListDto): void {
        // this.auditLogDetailModal.show(record);
    }
    sortChange(ret: any) {
        // tslint:disable-next-line:no-unnecessary-initializer
        let sort = undefined;
        if (ret.value) {
            if (ret.value === 'descend') {
                sort = ret.column.index + ' desc';
            } else {
                sort = ret.column.index + ' asc';
            }
        }
        console.log(sort);
        this.getAuditLogs(sort);
    }
    // tslint:disable-next-line:no-unnecessary-initializer
    getAuditLogs(sort: string = undefined) {
        this.loading = true;
        this.auditLogService.getAuditLogs(
            this.q.dateRange[0],
            this.q.dateRange[1],
            this.q.userName,
            this.q.serviceName,
            this.q.methodName,
            this.q.browserInfo,
            this.q.hasException,
            this.q.minExecutionDuration === 0 ? undefined : this.q.minExecutionDuration,
            this.q.maxExecutionDuration === 0 ? undefined : this.q.maxExecutionDuration,
            // sort
            sort,
            this.st.ps,
            (this.st.pi - 1) * this.st.ps
        )
            .finally(() => { this.loading = false; })
            .subscribe((result) => {
                this.st.total = result.totalCount;
                this.data = result.items;
                const pi = this.st.pi;
                setTimeout(() => {
                    this.st.pi = pi;
                }, 50);
            });
    }

    exportToExcel(): void {
        this.auditLogService.getAuditLogsToExcel(
            this.q.startDate,
            this.q.endDate,
            this.q.username,
            this.q.serviceName,
            this.q.methodName,
            this.q.browserInfo,
            this.q.hasException,
            this.q.minExecutionDuration,
            this.q.maxExecutionDuration,
            undefined,
            undefined,
            undefined)
            .subscribe(result => {
                this.fileDownloadService.downloadTempFile(result);
            });
    }
}
