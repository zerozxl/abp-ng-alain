import { Injectable } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { SessionServiceProxy, UserLoginInfoDto, TenantLoginInfoDto, ApplicationInfoDto, GetCurrentLoginInformationsOutput, ProfileServiceProxy } from '@shared/service-proxies/service-proxies';
import { AbpMultiTenancyService } from '@core/abp/multi-tenancy/abp-multi-tenancy.service';

import { Abp } from '@core/abp/abp';
import { SettingsService, User } from '@delon/theme';

@Injectable()
export class AppSessionService {

    private _user: UserLoginInfoDto;
    private _tenant: TenantLoginInfoDto;
    private _application: ApplicationInfoDto;

    constructor(
        private settingService: SettingsService,
        private _sessionService: SessionServiceProxy,
        private _profileServiceProxy: ProfileServiceProxy,
        private _abpMultiTenancyService: AbpMultiTenancyService) {
    }

    get application(): ApplicationInfoDto {
        return this._application;
    }

    get user(): UserLoginInfoDto {
        return this._user;
    }

    get userId(): number {
        return this.user ? this.user.id : null;
    }

    get tenant(): TenantLoginInfoDto {
        return this._tenant;
    }

    get tenancyName(): string {
        return this._tenant ? this.tenant.tenancyName : '';
    }

    get tenantId(): number {
        return this.tenant ? this.tenant.id : null;
    }

    getShownLoginName(): string {

        const userName = this._user.userName;
        if (!this._abpMultiTenancyService.isEnabled) {
            return userName;
        }

        return (this._tenant ? this._tenant.tenancyName : '.') + '\\' + userName;
    }

    getUserEmail(): string {
        return this._user.emailAddress;
    }

    init(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this._sessionService.getCurrentLoginInformations().toPromise().then((result: GetCurrentLoginInformationsOutput) => {

                this._application = result.application;
                this._user = result.user;
                const alainuser: User = {
                    name: result.user.name,
                    email: result.user.emailAddress
                };
                
                this.settingService.setUser(alainuser);
                this.getProfilePicture();
                this._tenant = result.tenant;
                resolve(true);
            }, (err) => {
                reject(err);
            });
        });
    }

    changeTenantIfNeeded(tenantId?: number): boolean {
        if (this.isCurrentTenant(tenantId)) {
            return false;
        }

        Abp.multiTenancy.setTenantIdCookie(tenantId);
        location.reload();
        return true;
    }
    getProfilePicture(): void {
        this._profileServiceProxy.getProfilePicture().subscribe(result => {
            if (result && result.profilePicture) {
                this.settingService.user.avatar = 'data:image/jpeg;base64,' + result.profilePicture;
            }
        });
    }
    private isCurrentTenant(tenantId?: number) {
        if (!tenantId && this.tenant) {
            return false;
        } else if (tenantId && (!this.tenant || this.tenant.id !== tenantId)) {
            return false;
        }

        return true;
    }
}
