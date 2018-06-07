import { ImpersonatedAuthenticateResultModel } from './../../../shared/service-proxies/service-proxies';
import { _HttpClient } from '@delon/theme';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountServiceProxy, ImpersonateInput, ImpersonateOutput, TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppUrlService } from '@shared/common/nav/app-url.service';
import { Abp } from '@core/abp/abp';
import { AppAuthService } from '@shared/common/auth/app-auth.service';
import { AppConsts } from '@core/abp/AppConsts';
import { TokenService } from '@delon/auth';

@Injectable()
export class ImpersonationService {

    constructor(
        private accountService: AccountServiceProxy,
        private appUrlService: AppUrlService,
        private authService: AppAuthService,
        private tokenService: TokenService,
        private httpClient: HttpClient,
        private tokenAuthService: TokenAuthServiceProxy
    ) {

    }
    /**
     * 模拟当前租户的某个用户登录
     * @param userId 用户Id
     * @param tenantId 租户Id
     */
    impersonate(userId: number, tenantId?: number): void {
        const input = new ImpersonateInput();
        input.userId = userId;
        input.tenantId = tenantId;
        this.accountService.impersonate(input)
            .subscribe((result: ImpersonateOutput) => {
                this.tokenService.clear();
                this.impersonatedAuthenticate(result.impersonationToken, input.tenantId);
            });
    }
    /**
     * 返回自己账户
     */
    backToImpersonator(): void {
        this.accountService.backToImpersonator()
            .subscribe((result: ImpersonateOutput) => {
                this.tokenService.clear();
                this.impersonatedAuthenticate(result.impersonationToken,  Abp.session.impersonatorTenantId);
            });
    }
    /**
     * 模拟登录并认证
     * @param impersonationToken 模拟登录的token
     * @param tenantId 当前租户
     */
    impersonatedAuthenticate(impersonationToken: string, tenantId: number) {
        Abp.multiTenancy.setTenantIdCookie(tenantId);
        this.tokenAuthService.impersonatedAuthenticate(impersonationToken)
            .subscribe((res: ImpersonatedAuthenticateResultModel) => {
                const tokenExpireDate = (new Date(new Date().getTime() + 1000 * res.expireInSeconds));
                this.tokenService.set({
                    token: res.accessToken,
                    tokenExpireDate: tokenExpireDate
                }
                );
                location.href = '';
            });
    }
}
