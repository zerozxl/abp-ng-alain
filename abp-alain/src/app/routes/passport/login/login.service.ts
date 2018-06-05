import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Abp } from '@core/abp/abp';
import { LogService } from '@core/abp/log/log.service';
import { UtilsService } from '@core/abp/utils/utils.service';
import { UrlHelper } from '@shared/UrlHelper';
// tslint:disable-next-line:max-line-length
import { AuthenticateModel, AuthenticateResultModel, ExternalLoginProviderInfoModel, TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { NzMessageService } from 'ng-zorro-antd';
import { AppConsts } from '@core/abp/AppConsts';
import { TokenService } from '@delon/auth';
import { ReuseTabService } from '@delon/abc';


export class ExternalLoginProvider extends ExternalLoginProviderInfoModel {

    static readonly FACEBOOK: string = 'Facebook';
    static readonly GOOGLE: string = 'Google';
    static readonly MICROSOFT: string = 'Microsoft';
    icon: string;
    initialized = false;
    constructor(providerInfo: ExternalLoginProviderInfoModel) {
        super();

        this.name = providerInfo.name;
        this.clientId = providerInfo.clientId;
        this.icon = ExternalLoginProvider.getSocialIcon(this.name);
    }
    private static getSocialIcon(providerName: string): string {
        providerName = providerName.toLowerCase();
        if (providerName === 'google') {
            providerName = 'googleplus';
        }
        return providerName;
    }
}

@Injectable()
export class LoginService {

    static readonly twoFactorRememberClientTokenName = 'TwoFactorRememberClientToken';

    authenticateModel: AuthenticateModel;
    authenticateResult: AuthenticateResultModel;
    externalLoginProviders: ExternalLoginProvider[] = [];
    rememberMe: boolean;
    constructor(
        private tokenAuthService: TokenAuthServiceProxy,
        private router: Router,
        private utilsService: UtilsService,
        private tokenService: TokenService,
        private logService: LogService,
        @Inject(ReuseTabService)
        private reuseTabService: ReuseTabService,
    ) {
        this.clear();
    }

    authenticate(finallyCallback?: () => void, redirectUrl?: string): void {
        finallyCallback = finallyCallback || (() => { });

        // We may switch to localStorage instead of cookies
        // tslint:disable-next-line:max-line-length
        this.authenticateModel.twoFactorRememberClientToken = this.utilsService.getCookieValue(LoginService.twoFactorRememberClientTokenName);
        this.authenticateModel.singleSignIn = UrlHelper.getSingleSignIn();
        this.authenticateModel.returnUrl = UrlHelper.getReturnUrl();

        this.tokenAuthService
            .authenticate(this.authenticateModel)
            .finally(finallyCallback)
            .subscribe((result: AuthenticateResultModel) => {
                this.processAuthenticateResult(result, redirectUrl);
            });
    }

    externalAuthenticate(provider: ExternalLoginProvider): void {
        this.ensureExternalLoginProviderInitialized(provider, () => {

        });
    }

    init(): void {
        this.initExternalLoginProviders();
    }

    private processAuthenticateResult(authenticateResult: AuthenticateResultModel, redirectUrl?: string) {
        this.authenticateResult = authenticateResult;

        if (authenticateResult.shouldResetPassword) {
            // Password reset
            this.router.navigate(['passport/reset-password'], {
                queryParams: {
                    userId: authenticateResult.userId,
                    tenantId: Abp.session.tenantId,
                    resetCode: authenticateResult.passwordResetCode
                }
            });

            this.clear();

        } else if (authenticateResult.requiresTwoFactorVerification) {
            // Two factor authentication
            this.router.navigate(['account/send-code']);

        } else if (authenticateResult.accessToken) {
            // Successfully logged in
            if (authenticateResult.returnUrl && !redirectUrl) {
                redirectUrl = authenticateResult.returnUrl;
            }

            this.login(
                authenticateResult.accessToken,
                authenticateResult.encryptedAccessToken,
                authenticateResult.expireInSeconds,
                this.rememberMe,
                authenticateResult.twoFactorRememberClientToken,
                redirectUrl
            );

        } else {
            // Unexpected result!
            this.logService.warn('Unexpected authenticateResult!');
            this.router.navigate(['passport/login']);
        }
    }

    // tslint:disable-next-line:max-line-length
    private login(accessToken: string, encryptedAccessToken: string, expireInSeconds: number, rememberMe?: boolean, twoFactorRememberClientToken?: string, redirectUrl?: string): void {

        const tokenExpireDate = rememberMe ? (new Date(new Date().getTime() + 1000 * expireInSeconds)) : undefined;

        this.tokenService.set({
            token: accessToken,
            tokenExpireDate
        }
        );

        this.utilsService.setCookieValue(
            AppConsts.authorization.encrptedAuthTokenName,
            encryptedAccessToken,
            tokenExpireDate,
            Abp.appPath
        );

        if (twoFactorRememberClientToken) {
            this.utilsService.setCookieValue(
                LoginService.twoFactorRememberClientTokenName,
                twoFactorRememberClientToken,
                new Date(new Date().getTime() + 365 * 86400000), // 1 year
                Abp.appPath
            );
        }
        console.log(redirectUrl);
        if (redirectUrl) {
            location.href = redirectUrl;
        } else {
            let initialUrl = UrlHelper.initialUrl;
            if (initialUrl.indexOf('/passport') > 0) {
                initialUrl = AppConsts.appBaseUrl;
            }

            // Abp.log.debug({
            //     'redirectUrl': initialUrl
            // });
            // 跳转到租户主界面
            location.href = AppConsts.appBaseUrl + '/#/admin/languages';
            location.reload();
            // 和 location.href 相比，router不会触发启动程序，导致 session user 里的用户名为空
            // 清空路由复用信息
            // this.reuseTabService.clear();
            // this.router.navigate(['admin/languages']);
            // location.href =  AppConsts.appBaseUrl + '/#/reception/index';
        }

    }

    private clear(): void {
        this.authenticateModel = new AuthenticateModel();
        this.authenticateModel.rememberClient = false;
        this.authenticateResult = null;
        this.rememberMe = false;
    }

    private initExternalLoginProviders() {
        this.tokenAuthService
            .getExternalAuthenticationProviders()
            .subscribe((providers: ExternalLoginProviderInfoModel[]) => {
                this.externalLoginProviders = _.map(providers, p => new ExternalLoginProvider(p));
            });
    }

    ensureExternalLoginProviderInitialized(loginProvider: ExternalLoginProvider, callback: () => void) {
        if (loginProvider.initialized) {
            callback();
            return;
        }

    }

}
