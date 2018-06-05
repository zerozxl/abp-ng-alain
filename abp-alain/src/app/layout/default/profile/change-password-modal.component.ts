import { Component, OnInit, ViewChild, Injector, ElementRef } from '@angular/core';
import { ProfileServiceProxy, ChangePasswordInput, PasswordComplexitySetting } from '@shared/service-proxies/service-proxies';
import { SFSchema, SFUISchema } from '@delon/form';
import { FormGroup } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import { NzModalRef } from 'ng-zorro-antd';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'changePasswordModal',
    templateUrl: './change-password-modal.component.html'
})
export class ChangePasswordModalComponent extends AppComponentBase {

    @ViewChild('currentPasswordInput') currentPasswordInput: ElementRef;

    passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();
    currentPassword: string;
    password: string;
    confirmPassword: string;

    saving = false;
    active = false;
    form: FormGroup;
    schema: SFSchema = {
        properties: {
            currentPassword: { type: 'string', title: this.l('CurrentPassword'), ui: { type: 'password' } },
            password: {
                type: 'string', title: this.l('NewPassword'), ui: { type: 'password' }
            },
            confirmPassword: { type: 'string', title: this.l('NewPasswordRepeat'), ui: { type: 'password' } },
        },
        required: ['currentPassword', 'password', 'confirmPassword'],
    };
    ui: SFUISchema = {
        '*': {
            spanLabelFixed: 100,
            grid: { span: 24 },
        }
    };
    constructor(
        injector: Injector,
        private modalRef: NzModalRef,
        private _profileService: ProfileServiceProxy
    ) {
        super(injector);
    }


    close(): void {
        this.modalRef.destroy();
    }

    save(value: any): void {
        const input = new ChangePasswordInput();
        input.currentPassword = value.currentPassword;
        input.newPassword = value.password;

        this.saving = true;
        this._profileService.changePassword(input)
            .finally(() => { this.saving = false; })
            .subscribe(() => {
                this.msg.info(this.l('YourPasswordHasChangedSuccessfully'));
                this.modalRef.close(true);
            });
    }
}
