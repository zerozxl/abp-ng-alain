import { Component, Injector, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';
import { AppComponentBase } from '@shared/app-component-base';
import { AuditLogListDto, AuditLogServiceProxy } from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as moment from 'moment';


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
        { title: this.l('Success'), render: 'exception' },
        { title: this.l('Time'), type: 'date', index: 'executionTime' },
        { title: this.l('UserName'), index: 'userName' },
        { title: this.l('Service'), index: 'serviceName' },
        { title: this.l('Action'), index: 'methodName' },
        { title: this.l('Duration'), render: 'executionDuration' },
        { title: this.l('IpAddress'), index: 'clientIpAddress' },
        { title: this.l('Client'), index: 'clientName' },
        { title: this.l('Browser'), render: 'browserInfo' },
        {
            title: this.l('Actions'),
            buttons: [
                {
                    text: this.l('Edit'),
                    type: 'modal',
                    paramName: 'languagePara',
                    //   acl: 'Pages.Administration.Languages.Edit',
                    //   component: CreateOrEditLanguageComponent,
                    click: (record: any, modal: any) => this.getAuditLogs()
                }
            ]
        }
    ];
    // Filters
    public startDate: moment.Moment = moment().startOf('day');
    public endDate: moment.Moment = moment().endOf('day');
    public username: string;
    public serviceName: string;
    public methodName: string;
    public browserInfo: string;
    public hasException: boolean = undefined;
    public minExecutionDuration: number;
    public maxExecutionDuration: number;

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

    getAuditLogs() {
        this.loading = true;
        this.auditLogService.getAuditLogs(
            this.startDate,
            this.endDate,
            this.username,
            this.serviceName,
            this.methodName,
            this.browserInfo,
            this.hasException,
            this.minExecutionDuration,
            this.maxExecutionDuration,
            // sort
            '',
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
            this.startDate,
            this.endDate,
            this.username,
            this.serviceName,
            this.methodName,
            this.browserInfo,
            this.hasException,
            this.minExecutionDuration,
            this.maxExecutionDuration,
            undefined,
            undefined,
            undefined)
            .subscribe(result => {
                this.fileDownloadService.downloadTempFile(result);
            });
    }
}
