
import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import localeZhHans from '@angular/common/locales/zh-Hans';
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { AppConsts } from '@core/abp/AppConsts';
import { I18NService } from '@core/i18n/i18n.service';
import { DefaultInterceptor } from '@core/net/default.interceptor';
import { StartupService } from '@core/startup/startup.service';
import { DA_XLSX_CONFIG, FullContentService, ReuseTabService, ReuseTabStrategy, XlsxService } from '@delon/abc';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { UrlHelper } from '@shared/UrlHelper';
// @delon/form: JSON Schema form
import { JsonSchemaModule } from '@shared/json-schema/json-schema.module';
import { API_BASE_URL } from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { CookieService } from 'ngx-cookie-service';
import { PermissionGuard } from './app.PermissionGuard';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { DelonModule } from './delon.module';
import { LayoutModule } from './layout/layout.module';
import { RoutesModule } from './routes/routes.module';
import { SharedModule } from './shared/shared.module';

// angular i18n
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AbpHttpInterceptor } from '@core/abp/abpHttpInterceptor';
import { TokenService } from '@delon/auth';
registerLocaleData(localeZhHans);

export function StartupServiceFactory(startupService: StartupService): Function {
  return () => startupService.load();
}

export function getRemoteServiceBaseUrl(): string {
  return AppConsts.remoteServiceBaseUrl;
}
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, `assets/_/i18n/`, '.json');
}
const PROVIDERS = [
  // @delon/abc
  FullContentService,
  // reuse-tab
  ReuseTabService,
  { provide: RouteReuseStrategy, useClass: ReuseTabStrategy, deps: [ReuseTabService] },
  // xlsx
  XlsxService,
  { provide: DA_XLSX_CONFIG, useValue: {} },
  { provide: API_BASE_URL, useFactory: getRemoteServiceBaseUrl },
  UrlHelper,
  FileDownloadService,
  CookieService,
  TokenService
];
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DelonModule.forRoot(),
    CoreModule,
    SharedModule,
    LayoutModule,
    RoutesModule,
    // i18n
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    // JSON-Schema form
    JsonSchemaModule,

  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'zh-Hans' },
    // { provide: HTTP_INTERCEPTORS, useClass: SimpleInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AbpHttpInterceptor, multi: true },
    { provide: ALAIN_I18N_TOKEN, useClass: I18NService, multi: false },
    StartupService,
    {
      provide: APP_INITIALIZER,
      useFactory: StartupServiceFactory,
      deps: [StartupService],
      multi: true
    },
    PermissionGuard,
    ...PROVIDERS
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
 }
