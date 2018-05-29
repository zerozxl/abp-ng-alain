import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AbpSessionService } from '@core/abp/session/abp-session.service';
import { DA_SERVICE_TOKEN, ITokenService, SocialOpenType, SocialService } from '@delon/auth';
import { SettingsService } from '@delon/theme';
import { environment } from '@env/environment';
import { UrlHelper } from '@shared/UrlHelper';
// tslint:disable-next-line:max-line-length
import { AuthenticateModel, AuthenticateResultModel, SessionServiceProxy, TokenAuthServiceProxy, UpdateUserSignInTokenOutput } from '@shared/service-proxies/service-proxies';
import { NzMessageService } from 'ng-zorro-antd';
import { LoginService } from './login.service';
import { Abp } from '@core/abp/abp';

@Component({
  selector: 'passport-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [SocialService]
})
export class UserLoginComponent implements OnDestroy, OnInit {

  form: FormGroup;
  error = '';
  type = 0;
  loading = false;

  authenticateModel: AuthenticateModel;

  constructor(
    fb: FormBuilder,
    private _tokenAuthService: TokenAuthServiceProxy,
    private router: Router,
    public msg: NzMessageService,
    private settingsService: SettingsService,
    private socialService: SocialService,
    private _messageService: NzMessageService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    public loginService: LoginService,
    private _sessionService: AbpSessionService,
    private _sessionAppService: SessionServiceProxy) {
    this.form = fb.group({
      userName: [null, [Validators.required, Validators.minLength(5)]],
      password: [null, Validators.required],
      mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      captcha: [null, [Validators.required]],
      remember: [true]
    });
    this.authenticateModel = new AuthenticateModel();
    this.authenticateModel.rememberClient = false;

  }

  // region: fields

  get userName() { return this.form.controls.userName; }
  get password() { return this.form.controls.password; }
  get mobile() { return this.form.controls.mobile; }
  get captcha() { return this.form.controls.captcha; }

  // endregion

  switch(ret: any) {
    this.type = ret.index;
  }

  // region: get captcha

  // tslint:disable-next-line:member-ordering
  count = 0;
  // tslint:disable-next-line:member-ordering
  interval$: any;

  getCaptcha() {
    this.count = 59;
    this.interval$ = setInterval(() => {
      this.count -= 1;
      if (this.count <= 0)
        clearInterval(this.interval$);
    }, 1000);
  }

  get multiTenancySideIsTeanant(): boolean {
    return this._sessionService.tenantId > 0;
  }

  get isSelfRegistrationAllowed(): boolean {
    if (!this._sessionService.tenantId) {
      return false;
    }

    return Abp.setting.getBoolean('App.UserManagement.AllowSelfRegistration');
  }


  ngOnInit(): void {
    if (this._sessionService.userId > 0 && UrlHelper.getReturnUrl() && UrlHelper.getSingleSignIn()) {
      this._sessionAppService.updateUserSignInToken()
        .subscribe((result: UpdateUserSignInTokenOutput) => {
          const initialReturnUrl = UrlHelper.getReturnUrl();
          const returnUrl = initialReturnUrl + (initialReturnUrl.indexOf('?') >= 0 ? '&' : '?') +
            'accessToken=' + result.signInToken +
            '&userId=' + result.encodedUserId +
            '&tenantId=' + result.encodedTenantId;

          location.href = returnUrl;
        });
    }
  }

  // endregion

  submit() {
    this.error = '';
    this.userName.markAsDirty();
    this.password.markAsDirty();
    if (this.userName.invalid || this.password.invalid) return;
    this.loading = true;

    this.authenticateModel.userNameOrEmailAddress = this.userName.value;
    this.authenticateModel.password = this.password.value;
    this.loginService.authenticate(
      () => this.loading = false
    );
    // this.authenticate(() => {
    //   console.log('调用到');
    //   this.loading = false;
    // });


    /*
    setTimeout(() => {
        this.loading = false;
        if (this.type === 0) {
            if (this.userName.value !== 'admin' || this.password.value !== '888888') {
                this.error = `账户或密码错误`;
                return;
            }
        }

        this.tokenService.set({
            token: '123456789',
            name: this.userName.value,
            email: `cipchk@qq.com`,
            id: 10000,
            time: +new Date
        });
        this.router.navigate(['/']);
    }, 1000);
    */


    /*
    // mock http
    this.loading = true;
    setTimeout(() => {
        this.loading = false;
        if (this.type === 0) {
            if (this.userName.value !== 'admin' || this.password.value !== '888888') {
                this.error = `账户或密码错误`;
                return;
            }
        }

        this.tokenService.set({
            token: '123456789',
            name: this.userName.value,
            email: `cipchk@qq.com`,
            id: 10000,
            time: +new Date
        });
        this.router.navigate(['/']);
    }, 1000);
    */



  }

  authenticate(finallyCallback?: () => void, redirectUrl?: string): void {
    finallyCallback = finallyCallback || (() => { });

    // We may switch to localStorage instead of cookies
    this.authenticateModel.twoFactorRememberClientToken = '';
    this.authenticateModel.singleSignIn = false;
    this.authenticateModel.returnUrl = '/';

    this._tokenAuthService
      .authenticate(this.authenticateModel)
      .finally(finallyCallback)
      .subscribe((result: AuthenticateResultModel) => {
        console.log(result);
        this.tokenService.set({
          token: result.accessToken,
          // name: this.userName.value,
          //  email: `cipchk@qq.com`,
          id: 10000,
          time: +new Date
        });
        this.router.navigate(['/']);
      });

  }



  // region: social

  open(type: string, openType: SocialOpenType = 'href') {
    let url = ``;
    let callback = ``;
    if (environment.production)
      callback = 'https://cipchk.github.io/ng-alain/callback/' + type;
    else
      callback = 'http://localhost:4200/callback/' + type;
    switch (type) {
      case 'auth0':
        url = `//cipchk.auth0.com/login?client=8gcNydIDzGBYxzqV0Vm1CX_RXH-wsWo5&redirect_uri=${decodeURIComponent(callback)}`;
        break;
      case 'github':
        // tslint:disable-next-line:max-line-length
        url = `//github.com/login/oauth/authorize?client_id=9d6baae4b04a23fcafa2&response_type=code&redirect_uri=${decodeURIComponent(callback)}`;
        break;
      case 'weibo':
        url = `https://api.weibo.com/oauth2/authorize?client_id=1239507802&response_type=code&redirect_uri=${decodeURIComponent(callback)}`;
        break;
    }
    if (openType === 'window') {
      this.socialService.login(url, '/', {
        type: 'window'
      }).subscribe(res => {
        if (res) {
          this.settingsService.setUser(res);
          this.router.navigateByUrl('/');
        }
      });
    } else {
      this.socialService.login(url, '/', {
        type: 'href'
      });
    }
  }

  // endregion

  ngOnDestroy(): void {
    if (this.interval$) clearInterval(this.interval$);
  }
}
