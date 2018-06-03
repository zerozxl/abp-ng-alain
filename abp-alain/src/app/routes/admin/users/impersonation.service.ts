import { Injectable } from '@angular/core';
import { AccountServiceProxy, ImpersonateInput, ImpersonateOutput } from '@shared/service-proxies/service-proxies';
import { AppUrlService } from '@shared/common/nav/app-url.service';
import { Abp } from '@core/abp/abp';
import { AppAuthService } from '@shared/common/auth/app-auth.service';

@Injectable()
export class ImpersonationService {

    constructor(
        private accountService: AccountServiceProxy,
        private appUrlService: AppUrlService,
        private authService: AppAuthService
    ) {

    }

    impersonate(userId: number, tenantId?: number): void {

        const input = new ImpersonateInput();
        input.userId = userId;
        input.tenantId = tenantId;

        this.accountService.impersonate(input)
            .subscribe((result: ImpersonateOutput) => {
                this.authService.logout(false);

                let targetUrl = this.appUrlService.getAppRootUrlOfTenant(result.tenancyName) + '?impersonationToken=' + result.impersonationToken;
                if (input.tenantId) {
                    targetUrl = targetUrl + '&tenantId=' + input.tenantId;
                }

                location.href = targetUrl;
            });
    }

    backToImpersonator(): void {
        this.accountService.backToImpersonator()
            .subscribe((result: ImpersonateOutput) => {
                this.authService.logout(false);

                let targetUrl = this.appUrlService.getAppRootUrlOfTenant(result.tenancyName) + '?impersonationToken=' + result.impersonationToken;
                if (Abp.session.impersonatorTenantId) {
                    targetUrl = targetUrl + '&tenantId=' + Abp.session.impersonatorTenantId;
                }

                location.href = targetUrl;
            });
    }
}
