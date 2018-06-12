import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppUrlService } from '@shared/common/nav/app-url.service';
import { AppSessionService } from '@shared/common/session/app-session.service';
import {
    AccountServiceProxy, PasswordComplexitySetting, ProfileServiceProxy,
    ResetPasswordOutput
} from '@shared/service-proxies/service-proxies';
import { LoginService } from '../login/login.service';
import { ResetPasswordModel } from './reset-password.model';
import { NzModalRef } from 'ng-zorro-antd';
import { SFUISchema, SFSchema } from '@delon/form';
import { AppComponentBase } from '@shared/app-component-base';
@Component({
    selector: 'passport-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.less']
})
export class ResetPasswordComponent extends AppComponentBase implements OnInit {
    model: ResetPasswordModel = new ResetPasswordModel();
    passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();
    saving = false;
    form: any;

    constructor(
        injector: Injector,
        fb: FormBuilder,
        private accountService: AccountServiceProxy,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private loginService: LoginService,
        private appUrlService: AppUrlService,
        private appSessionService: AppSessionService,
        private profileService: ProfileServiceProxy,
        private modalRef: NzModalRef
    ) {
        super(injector);
        // this.form = fb.group({
        //     password: [null, Validators.required],
        //     passwordRepeat: [null, Validators.required]
        // });
    }

    get password() {
        // return this.form.controls.password;
        return null;
    }
    get passwordRepeat() {
        // return this.form.controls.passwordRepeat;
        return null;
    }
    ngOnInit(): void {
        console.log('abcd');
        this.model.userId = this.activatedRoute.snapshot.queryParams['userId'];
        this.model.resetCode = this.activatedRoute.snapshot.queryParams['resetCode'];
        this.appSessionService.changeTenantIfNeeded(
            this.parseTenantId(
                this.activatedRoute.snapshot.queryParams['tenantId']
            )
        );
        this.profileService.getPasswordComplexitySetting().subscribe(result => {
            this.passwordComplexitySetting = result.setting;
        });
    }

    save(): void {
        this.saving = true;
        this.accountService.resetPassword(this.model)
            .finally(() => { this.saving = false; })
            .subscribe((result: ResetPasswordOutput) => {
                if (!result.canLogin) {
                    this.router.navigate(['passport/login']);
                    return;
                }
                // Autheticate
                this.saving = true;
                this.loginService.authenticateModel.userNameOrEmailAddress = result.userName;
                this.loginService.authenticateModel.password = this.model.password;
                this.loginService.authenticate(() => {
                    this.saving = false;
                });
                this.modalRef.close(true);
            });
    }

    parseTenantId(tenantIdAsStr?: string): number {
        let tenantId = !tenantIdAsStr ? undefined : parseInt(tenantIdAsStr, undefined);
        if (tenantId === NaN) {
            tenantId = undefined;
        }
        return tenantId;
    }
    close() {
        this.modalRef.destroy();
    }
}
