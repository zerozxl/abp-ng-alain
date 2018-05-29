import { Injectable } from '@angular/core';
import { FileDto } from '@shared/service-proxies/service-proxies';
import { AppConsts } from '@core/abp/AppConsts';

@Injectable()
export class FileDownloadService {

    downloadTempFile(file: FileDto) {
        // tslint:disable-next-line:max-line-length
        const url = AppConsts.remoteServiceBaseUrl + '/File/DownloadTempFile?fileType=' + file.fileType + '&fileToken=' + file.fileToken + '&fileName=' + file.fileName;
        location.href = url; // TODO: This causes reloading of same page in Firefox
    }
}
