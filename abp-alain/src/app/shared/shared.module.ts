import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AbpModule } from '@core/abp/abp.module';
import { DelonABCModule } from '@delon/abc';
import { DelonACLModule } from '@delon/acl';
import { DelonFormModule } from '@delon/form';
// delon
import { AlainThemeModule } from '@delon/theme';
import { TranslateModule } from '@ngx-translate/core';
import { AppCommonModule } from '@shared/common/common.module';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
// region: third libs
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CountdownModule } from 'ngx-countdown';
import { TruncateModule } from '@yellowspot/ng-truncate';
import { AdSideBarNavModule } from '@shared/overwrite/side-bar-nav/side-bar-nav.module';
import { CommonLookupModalComponent } from '@shared/lookup/common-lookup-modal.component';
const THIRDMODULES = [
  NgZorroAntdModule,
  CountdownModule,
  ServiceProxyModule,
  TruncateModule,
  AdSideBarNavModule
];
// endregion

// region: your componets & directives
const COMPONENTS = [
  CommonLookupModalComponent
];
const EntryCOMPONENTS=[
  CommonLookupModalComponent
];
const DIRECTIVES = [];
// endregion

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AppCommonModule.forRoot(),
    AlainThemeModule.forChild(),
    DelonABCModule,
    DelonACLModule,
    DelonFormModule,
    AbpModule,
    // third libs
    ...THIRDMODULES
  ],
  declarations: [
    // your components
    ...COMPONENTS,
    ...DIRECTIVES
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AlainThemeModule,
    DelonABCModule,
    DelonACLModule,
    DelonFormModule,
    // i18n
    TranslateModule,
    // third libs
    ...THIRDMODULES,
    // your components
    ...COMPONENTS,
    ...DIRECTIVES
  ]
  ,
  entryComponents: [
    // ...EntryCOMPONENTS,
]
})
export class SharedModule { }
