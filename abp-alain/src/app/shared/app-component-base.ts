import { Injector, Type } from '@angular/core';
import { Abp } from '@core/abp/abp';
import { PermissionCheckerService } from '@core/abp/auth/permission-checker.service';
import { FeatureCheckerService } from '@core/abp/features/feature-checker.service';
import { LocalizationService } from '@core/abp/localization/localization.service';
import { AbpMultiTenancyService } from '@core/abp/multi-tenancy/abp-multi-tenancy.service';
import { SettingService } from '@core/abp/settings/setting.service';
import { ModalHelper } from '@delon/theme';
import { AppConsts } from '@core/abp/AppConsts';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { AppUiCustomizationService } from '@shared/common/ui/app-ui-customization.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

export abstract class AppComponentBase {

    localizationSourceName = AppConsts.localization.defaultLocalizationSourceName;

    localization: LocalizationService;
    permission: PermissionCheckerService;
    feature: FeatureCheckerService;
    msg: NzMessageService;
    setting: SettingService;
    modalHelper: ModalHelper;
    modal: NzModalService;
    multiTenancy: AbpMultiTenancyService;
    appSession: AppSessionService;

    loading = false;

    constructor(injector: Injector) {
        this.localization = injector.get(LocalizationService);
        this.permission = injector.get(PermissionCheckerService);
        this.feature = injector.get(FeatureCheckerService);
        this.msg = injector.get(NzMessageService);
        this.setting = injector.get(SettingService);
        this.modalHelper = injector.get(ModalHelper);
        this.modal = injector.get(NzModalService);
        this.multiTenancy = injector.get(AbpMultiTenancyService);
        this.appSession = injector.get(AppSessionService);
    }

    l(key: string, ...args: any[]): string {
        return this.ls(this.localizationSourceName, key, args);
    }

    ls(sourcename: string, key: string, ...args: any[]): string {
        let localizedText = this.localization.localize(key, sourcename);

        if (!localizedText) {
            localizedText = key;
        }

        if (!args || !args.length) {
            return localizedText;
        }

        args[0].unshift(localizedText);

        return Abp.utils.formatString.apply(this, args[0]);
    }

    isGranted(permissionName: string): boolean {
        return this.permission.isGranted(permissionName);
    }

    isGrantedAny(...permissions: string[]): boolean {
        if (!permissions) {
            return false;
        }

        for (const permission of permissions) {
            if (this.isGranted(permission)) {
                return true;
            }
        }

        return false;
    }

    s(key: string): string {
        return Abp.setting.get(key);
    }

}
