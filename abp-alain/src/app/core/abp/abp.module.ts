import { NgModule } from '@angular/core';
import { HttpModule, JsonpModule } from '@angular/http';
import { AbpHttpConfiguration } from './abpHttpInterceptor';
import { PermissionCheckerService } from './auth/permission-checker.service';
import { FeatureCheckerService } from './features/feature-checker.service';
import { LocalizationService } from './localization/localization.service';
import { LogService } from './log/log.service';
import { AbpMultiTenancyService } from './multi-tenancy/abp-multi-tenancy.service';
import { AbpSessionService } from './session/abp-session.service';
import { SettingService } from './settings/setting.service';
import { UtilsService } from './utils/utils.service';
@NgModule({
    imports: [
        HttpModule,
        JsonpModule
    ],
    declarations: [
    ],
    providers: [
        AbpHttpConfiguration,
        LogService,
        UtilsService,
        AbpSessionService,
        AbpMultiTenancyService,
        PermissionCheckerService,
        FeatureCheckerService,
        LocalizationService,
        SettingService
    ]
})
export class AbpModule {

}
