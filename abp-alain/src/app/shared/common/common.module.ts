import * as ngCommon from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { AbpModule } from '@core/abp/abp.module';

import { AppSessionService } from './session/app-session.service';
import { AppUrlService } from './nav/app-url.service';
import { AppUiCustomizationService } from './ui/app-ui-customization.service';
import { AppAuthService } from './auth/app-auth.service';
import { ImpersonationService } from '../../routes/admin/users/impersonation.service';

@NgModule({
    imports: [
        ngCommon.CommonModule,
        AbpModule
    ]
})
export class AppCommonModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AppCommonModule,
            providers: [
                ImpersonationService,
                AppSessionService,
                AppUrlService,
                AppUiCustomizationService,
                AppAuthService
            ]
        };
    }
}
