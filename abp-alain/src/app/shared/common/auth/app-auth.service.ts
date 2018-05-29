import { Injectable } from '@angular/core';
import { Abp } from '@core/abp/abp';
import { AppConsts } from '@core/abp/AppConsts';

@Injectable()
export class AppAuthService {

    logout(reload?: boolean, returnUrl?: string): void {
        Abp.auth.clearToken();
        if (reload !== false) {
            if (returnUrl) {
                location.href = returnUrl;
            } else {
                location.href = AppConsts.appBaseUrl;
            }
        }
    }
}
