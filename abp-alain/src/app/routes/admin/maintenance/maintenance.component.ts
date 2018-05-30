import { Component, Injector, OnInit, AfterViewInit } from '@angular/core';
import { CachingServiceProxy, EntityDtoOfString, WebLogServiceProxy } from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
    templateUrl: './maintenance.component.html',
    styleUrls: ['./maintenance.component.less'],
})
export class MaintenanceComponent extends AppComponentBase implements OnInit {
    selectedIndex = 0;
    constructor(
        injector: Injector,
        private cacheService: CachingServiceProxy,
        private webLogService: WebLogServiceProxy,
        private fileDownloadService: FileDownloadService) {
        super(injector);
    }

    caches: any = null;
    logs: any = '';

    getCaches(): void {
        this.cacheService.getAllCaches()
            .subscribe((result) => {
                this.caches = result.items;
            });
    }

    clearCache(cacheName): void {
        const input = new EntityDtoOfString();
        input.id = cacheName;
        this.cacheService.clearCache(input).subscribe(() => {
            this.msg.success(cacheName + ' ' + this.l('CacheSuccessfullyCleared'));
        });
    }

    clearAllCaches(): void {
        this.cacheService.clearAllCaches().subscribe(() => {
            this.msg.success(this.l('AllCachesSuccessfullyCleared'));
        });
    }

    getWebLogs(): void {
        this.webLogService.getLatestWebLogs().subscribe((result) => {
            this.logs = result.latestWebLogLines;
            // self.fixWebLogsPanelHeight();
        });
    }

    downloadWebLogs = function () {

        this.webLogService.downloadWebLogs().subscribe((result) => {
            this.fileDownloadService.downloadTempFile(result);
        });
    };

    getLogClass(log: string): string {

        if (log.startsWith('DEBUG')) {
            return 'label label-default';
        }

        if (log.startsWith('INFO')) {
            return 'label label-info';
        }

        if (log.startsWith('WARN')) {
            return 'label label-warning';
        }

        if (log.startsWith('ERROR')) {
            return 'label label-danger';
        }

        if (log.startsWith('FATAL')) {
            return 'label label-danger';
        }

        return '';
    }

    getLogType(log: string): string {
        if (log.startsWith('DEBUG')) {
            return 'DEBUG';
        }

        if (log.startsWith('INFO')) {
            return 'INFO';
        }

        if (log.startsWith('WARN')) {
            return 'WARN';
        }

        if (log.startsWith('ERROR')) {
            return 'ERROR';
        }

        if (log.startsWith('FATAL')) {
            return 'FATAL';
        }

        return '';
    }

    getRawLogContent(log: string): string {
        return _.escape(log)
            .replace('DEBUG', '')
            .replace('INFO', '')
            .replace('WARN', '')
            .replace('ERROR', '')
            .replace('FATAL', '');
    }

    selectedIndexChange(): void {
        console.log(this.selectedIndex);
    }


    ngOnInit(): void {
        this.getCaches();
        this.getWebLogs();
    }
}
