import { Component, Injector, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountServiceProxy, ResetPasswordOutput } from '@shared/service-proxies/service-proxies';
// tslint:disable-next-line:max-line-length
import { AuthenticateModel, AuthenticateResultModel, PasswordComplexitySetting, ProfileServiceProxy } from '@shared/service-proxies/service-proxies';
import { LoginService } from '../login/login.service';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { AppUrlService } from '@shared/common/nav/app-url.service';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ResetPasswordModel } from './reset-password.model';
import { AppConsts } from '@core/abp/AppConsts';
@Component({
    selector: 'passport-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: [ './reset-password.component.less' ]
})
export class ResetPasswordComponent implements OnInit {

    model: ResetPasswordModel = new ResetPasswordModel();
    passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();
    saving = false;

    form: FormGroup;

    constructor(
        injector: Injector,
        fb: FormBuilder,
        private _accountService: AccountServiceProxy,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _loginService: LoginService,
        private _appUrlService: AppUrlService,
        private _appSessionService: AppSessionService,
        private _profileService: ProfileServiceProxy
    ) {
        // super(injector);
        this.form = fb.group({
            password: [null, Validators.required],
            passwordRepeat: [null, Validators.required]
        });
    }

    get password() { return this.form.controls.password; }
    get passwordRepeat() { return this.form.controls.passwordRepeat; }

    ngOnInit(): void {
        this.model.userId = this._activatedRoute.snapshot.queryParams['userId'];
        this.model.resetCode = this._activatedRoute.snapshot.queryParams['resetCode'];

        this._appSessionService.changeTenantIfNeeded(
            this.parseTenantId(
                this._activatedRoute.snapshot.queryParams['tenantId']
            )
        );

        this._profileService.getPasswordComplexitySetting().subscribe(result => {
            this.passwordComplexitySetting = result.setting;
        });
    }

    save(): void {
        this.saving = true;
        this._accountService.resetPassword(this.model)
            // .finally(() => { this.saving = false; })
            .subscribe((result: ResetPasswordOutput) => {
                if (!result.canLogin) {
                    this._router.navigate(['passport/login']);
                    return;
                }

                // Autheticate
                this.saving = true;
                this._loginService.authenticateModel.userNameOrEmailAddress = result.userName;
                this._loginService.authenticateModel.password = this.model.password;
                this._loginService.authenticate(() => {
                    this.saving = false;
                });
            });
    }

    parseTenantId(tenantIdAsStr?: string): number {
        let tenantId = !tenantIdAsStr ? undefined : parseInt(tenantIdAsStr, undefined);
        if (tenantId === NaN) {
            tenantId = undefined;
        }

        return tenantId;
    }
}
