import { Injectable, Injector, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { zip } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MenuService, SettingsService, TitleService, ALAIN_I18N_TOKEN } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ACLService } from '@delon/acl';
import { AppConsts } from '@core/abp/AppConsts';
import { Abp, abp } from '@core/abp/abp';
import * as tz from 'moment-timezone';
import * as _ from 'lodash';
import * as moment from 'moment';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { TranslateService } from '@ngx-translate/core';
import { ReuseTabService, ReuseTabMatchMode } from '@delon/abc';

/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class StartupService {
  constructor(
    private menuService: MenuService,
    private settingService: SettingsService,
    // private translate: TranslateService,
    private aclService: ACLService,
    private titleService: TitleService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private httpClient: HttpClient,
    private reuseTabService: ReuseTabService,
    private injector: Injector
  ) {
    this.reuseTabService.mode = ReuseTabMatchMode.URL;
  }
  public static getCurrentClockProvider(currentProviderName: string): abp.timing.IClockProvider {
    if (currentProviderName === 'unspecifiedClockProvider') {
      return Abp.timing.unspecifiedClockProvider;
    }

    if (currentProviderName === 'utcClockProvider') {
      return Abp.timing.utcClockProvider;
    }

    return Abp.timing.localClockProvider;
  }


  // tslint:disable-next-line:one-line
  // checkMenuPerssion(menus) {
  //   _.forEach(menus, (item) => {

  //     item.hide = item.permission && !Abp.auth.isGranted(item.permission);

  //     if (item.children !== undefined && item.children.length > 0) {
  //       this.checkMenuPerssion(item.children);
  //     }
  //   });
  // }


  private viaHttp(resolve: any, reject: any) {
    zip(
      this.httpClient.get(`assets/i18n/zh-CN.json`),
      this.httpClient.get('assets/app-data.json')
    ).pipe(
      // 接收其他拦截器后产生的异常消息
      catchError(([langData, appData]) => {
        resolve(null);
        return [langData, appData];
      })
    ).subscribe(([langData, appData]) => {
      // this.translate.setTranslation('zh-CN', langData);
      // this.translate.setDefaultLang('zh-CN');
      // application data
      const res: any = appData;
      // 应用信息：包括站点名、描述、年份
      this.settingService.setApp(res.app);
      // 用户信息：包括姓名、头像、邮箱地址
      this.settingService.setUser(res.user);
      // 设置页面标题的后缀
      this.titleService.suffix = res.app.name;
      // ACL：设置权限为全量
      // this.aclService.setFull(true);

      // var i=1;
      AppConsts.remoteServiceBaseUrl = res.url.remoteServiceBaseUrl;
      AppConsts.appBaseUrl = res.url.appBaseUrl;
      const tokenData = this.tokenService.get();
      const cookieLangValue = Abp.utils.getCookieValue('Abp.Localization.CultureName');
      this.httpClient.get<any>(AppConsts.remoteServiceBaseUrl + '/AbpUserConfiguration/GetAll')
        .subscribe(allres => {
          console.log(allres);
          const all: any = allres;
          const allSetting = all.result;
          Abp.multiTenancy.setGlobal(allSetting.multiTenancy);
          Abp.session.setGlobal(allSetting.session);
          Abp.localization.setGlobal(allSetting.localization);
          Abp.features.setGlobal(allSetting.features);
          Abp.auth.setGlobal(allSetting.auth);
          const grantedPermissions: string[] = [];
          // 返回的是权限粒度，直接使用
          // tslint:disable-next-line:forin
          for (const k in allSetting.auth.grantedPermissions) {
            grantedPermissions.push(k);
          }
          this.aclService.setRole(grantedPermissions);
          Abp.nav.setGlobal(allSetting.nav);
          Abp.setting.setGlobal(allSetting.setting);
          Abp.clock.setGloabl(allSetting.clock);
          Abp.timing.setGloabl(allSetting.timing);
          Abp.clock.provider = StartupService.getCurrentClockProvider(allSetting.clock.provider);
          moment.locale(Abp.localization.currentLanguage.name);
          // (window as any).moment.locale(Abp.localization.currentLanguage.name);
          if (Abp.clock.provider.supportsMultipleTimezone) {
            moment.tz.setDefault(Abp.timing.timeZoneInfo.iana.timeZoneId);
            (window as any).moment.tz.setDefault(Abp.timing.timeZoneInfo.iana.timeZoneId);
          }
          AppConsts.recaptchaSiteKey = Abp.setting.get('Recaptcha.SiteKey');
          // tslint:disable-next-line:max-line-length
          AppConsts.subscriptionExpireNootifyDayCount = parseInt(Abp.setting.get('App.TenantManagement.SubscriptionExpireNotifyDayCount'), null);

          const appSession = this.injector.get(AppSessionService);
          // this.checkMenuPerssion(res.menu);
          // 初始化菜单
          this.menuService.add(res.menu);
          appSession.init().then(() => {
            resolve(res);
          });
          if (!tokenData.token) {
            this.injector.get(Router).navigateByUrl('/passport/login');
            resolve({});
            return;
          }
        }
        );

    },
      () => { },
      () => {
        resolve(null);
      });
  }

  private viaMock(resolve: any, reject: any) {
    // const tokenData = this.tokenService.get();
    // if (!tokenData.token) {
    //   this.injector.get(Router).navigateByUrl('/passport/login');
    //   resolve({});
    //   return;
    // }
    // mock
    const app: any = {
      name: `ng-alain`,
      description: `Ng-zorro admin panel front-end framework`
    };
    const user: any = {
      name: 'Admin',
      avatar: './assets/tmp/img/avatar.jpg',
      email: 'cipchk@qq.com',
      token: '123456789'
    };
    // 应用信息：包括站点名、描述、年份
    this.settingService.setApp(app);
    // 用户信息：包括姓名、头像、邮箱地址
    this.settingService.setUser(user);
    // ACL：设置权限为全量
    this.aclService.setFull(true);
    // 初始化菜单
    this.menuService.add([
      {
        text: '主导航',
        group: true,
        children: [
          {
            text: '仪表盘',
            link: '/dashboard',
            icon: 'anticon anticon-appstore-o'
          },
          {
            text: '快捷菜单',
            icon: 'anticon anticon-rocket',
            shortcut_root: true
          }
        ]
      }
    ]);
    // 设置页面标题的后缀
    this.titleService.suffix = app.name;

    resolve({});
  }

  load(): Promise<any> {
    // only works with promises
    // https://github.com/angular/angular/issues/15088
    return new Promise((resolve, reject) => {
      // http
      this.viaHttp(resolve, reject);
      // mock：请勿在生产环境中这么使用，viaMock 单纯只是为了模拟一些数据使脚手架一开始能正常运行
      // this.viaMock(resolve, reject);
    });
  }


}
