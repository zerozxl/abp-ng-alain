import { Component, ViewChild, Injector } from '@angular/core';
import { AuditLogListDto } from '@shared/service-proxies/service-proxies';

import * as moment from 'moment';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute } from '@angular/router';
import { NzModalRef } from 'ng-zorro-antd';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-auditLogDetailModal',
    templateUrl: './audit-log-detail-modal.component.html'
})
export class AuditLogDetailModalComponent extends AppComponentBase {
    active = false;
    auditLogPara: AuditLogListDto;
    constructor(
        private modalRef: NzModalRef,
        injector: Injector,
        private route: ActivatedRoute
    ) {
        super(injector);
    }
    getExecutionTime(): string {
        return moment(this.auditLogPara.executionTime).fromNow()
            + ' (' + moment(this.auditLogPara.executionTime).format('YYYY-MM-DD HH:mm:ss') + ')';
    }

    getDurationAsMs(): string {
        return this.l('Xms', this.auditLogPara.executionDuration);
    }

    getFormattedParameters(): string {
        try {
            const json = JSON.parse(this.auditLogPara.parameters);
            return JSON.stringify(json, null, 4);
        } catch (e) {
            return this.auditLogPara.parameters;
        }
    }
    close(): void {
        this.modalRef.destroy();
    }
}
