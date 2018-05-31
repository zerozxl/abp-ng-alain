import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CachingServiceProxy, EntityDtoOfString, WebLogServiceProxy } from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import { NzTabChangeEvent } from 'ng-zorro-antd';

@Component({
    templateUrl: './maintenance.component.html',
    styleUrls: ['./maintenance.component.less'],
})
export class MaintenanceComponent extends AppComponentBase implements OnInit {
    selectedIndex = 0;
    caches: any = null;
    logs: any = '';
    constructor(
        injector: Injector,
        private cacheService: CachingServiceProxy,
        private webLogService: WebLogServiceProxy,
        private fileDownloadService: FileDownloadService) {
        super(injector);
    }
    /**
     * 初始化
     */
    ngOnInit(): void {
        this.getCaches();
        this.getWebLogs();
    }
    /**
     * 获取所有的缓存项
     */
    getCaches(): void {
        this.cacheService.getAllCaches()
            .subscribe((result) => {
                this.caches = result.items;
            });
    }
    /**
     * 根据缓存名称清除缓存
     * @param cacheName 缓存名称
     */
    clearCache(cacheName): void {
        const input = new EntityDtoOfString();
        input.id = cacheName;
        this.cacheService.clearCache(input).subscribe(() => {
            this.msg.success(cacheName + ' ' + this.l('CacheSuccessfullyCleared'));
        });
    }
    /**
     * 清除所有缓存
     */
    clearAllCaches(): void {
        this.cacheService.clearAllCaches().subscribe(() => {
            this.msg.success(this.l('AllCachesSuccessfullyCleared'));
        });
    }
    /**
     * 获取所有缓存日志
     */
    getWebLogs(): void {
        this.webLogService.getLatestWebLogs().subscribe((result) => {
            this.logs = result.latestWebLogLines;
            this.fixWebLogsPanelHeight();
            // self.fixWebLogsPanelHeight();
        });
    }
    /**
     * 下周站点日志
     */
    downloadWebLogs = function () {

        this.webLogService.downloadWebLogs().subscribe((result) => {
            this.fileDownloadService.downloadTempFile(result);
        });
    };
    /**
     * 设置不同日志的nz-tag样式
     * @param log 日志内容
     */
    getLogClass(log: string): string {
        if (log.startsWith('DEBUG')) {
            return 'volcano';
        }
        if (log.startsWith('INFO')) {
            return 'blue';
        }
        if (log.startsWith('WARN')) {
            return 'orange';
        }
        if (log.startsWith('ERROR')) {
            return 'red';
        }
        if (log.startsWith('FATAL')) {
            return 'volcano';
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
    /**
     * 双向绑定无效，重新设置index
     * @param args NzTabChangeEvent
     */
    changeSelectIndex(args: NzTabChangeEvent) {
        // selectedIndex 双向index绑定无效，不得已为之
        this.selectedIndex = args.index;
        this.fixWebLogsPanelHeight();
    }
    /**
     * 设置自适应高度
     */
    fixWebLogsPanelHeight(): void {
        const windowHeight = window.innerHeight;
        const logHeight = (windowHeight - 280) + 'px';
        document.getElementById('web-log-view').style.height = logHeight;
    }
}
