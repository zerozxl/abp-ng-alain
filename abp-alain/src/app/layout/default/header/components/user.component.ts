import { ChangePasswordModalComponent } from './../../profile/change-password-modal.component';
import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService, ModalHelper, ALAIN_I18N_TOKEN } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { ImpersonationService } from '../../../../routes/admin/users/impersonation.service';
import { I18NService } from '@core/i18n/i18n.service';

@Component({
  selector: 'header-user',
  template: `
  <nz-dropdown nzPlacement="bottomRight">
    <div class="item d-flex align-items-center px-sm" nz-dropdown>
      <nz-avatar [nzSrc]="settings.user.avatar" nzSize="small" class="mr-sm"></nz-avatar>
      {{settings.user.name}}
    </div>
    <div nz-menu class="width-sm">
      <div nz-menu-item (click)="backToMyAccount()" *ngIf="isImpersonatedLogin">
        <i class="anticon anticon-user mr-sm"></i>
        {{'BackToMyAccount'|translate}}
      </div>
      <div nz-menu-item (click)="changePwd()">
        <i class="anticon anticon-user mr-sm"></i>
        {{'ChangePassword'|translate}}
      </div>
      <div nz-menu-item [nzDisabled]="true"><i class="anticon anticon-user mr-sm"></i>个人中心</div>
      <div nz-menu-item [nzDisabled]="true"><i class="anticon anticon-setting mr-sm"></i>设置</div>
      <li nz-menu-divider></li>
      <div nz-menu-item (click)="logout()"><i class="anticon anticon-setting mr-sm"></i>退出登录</div>
    </div>
  </nz-dropdown>
  `,
})
export class HeaderUserComponent implements OnInit {
  isImpersonatedLogin = false;
  constructor(
    public settings: SettingsService,
    private router: Router,
    private modalHelper: ModalHelper,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private _impersonationService: ImpersonationService,
    private _appSessionService: AppSessionService, @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
  ) { }

  ngOnInit(): void {
    this.tokenService.change().subscribe((res: any) => {
      this.settings.setUser(res);

    });
    // mock
    const token = this.tokenService.get() || {
      token: 'nothing',
      name: 'Admin',
      avatar: './assets/logo-color.svg',
      email: 'cipchk@qq.com',
    };
    this.tokenService.set(token);
    this.isImpersonatedLogin = this._appSessionService.impersonatorUserId > 0;
    console.log(this.i18n.getLangs());
  }

  logout() {
    this.tokenService.clear();
    this.router.navigateByUrl(this.tokenService.login_url);
  }
  backToMyAccount() {
    this._impersonationService.backToImpersonator();
  }
  changePwd() {
    this.modalHelper.open(ChangePasswordModalComponent, {}, 400).subscribe(() => {

    });
  }
}
