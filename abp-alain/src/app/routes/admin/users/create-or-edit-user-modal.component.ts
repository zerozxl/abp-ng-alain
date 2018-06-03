import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef, OnInit } from '@angular/core';
import { UserServiceProxy, ProfileServiceProxy, UserEditDto, CreateOrUpdateUserInput, OrganizationUnitDto, UserRoleDto, PasswordComplexitySetting, UserListDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { AppComponentBase } from '@shared/app-component-base';
import { OrganizationUnitsTreeComponent, IOrganizationUnitsTreeComponentData } from '../shared/organization-unit-tree.component';
import { AppConsts } from '@core/abp/AppConsts';
import { NzModalRef } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'createOrEditUserModal',
    templateUrl: './create-or-edit-user-modal.component.html',
    styles: [`.user-edit-dialog-profile-image {
             margin-bottom: 20px;
        }`
    ]
})
export class CreateOrEditUserModalComponent extends AppComponentBase implements OnInit {

    @ViewChild('nameInput') nameInput: ElementRef;
    @ViewChild('organizationUnitTree') organizationUnitTree: OrganizationUnitsTreeComponent;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    f: FormGroup;
    active = false;
    saving = false;
    canChangeUserName = true; // 是否允许修改用户名
    isTwoFactorEnabled: boolean = this.setting.getBoolean('Abp.Zero.UserManagement.TwoFactorLogin.IsEnabled');
    isLockoutEnabled: boolean = this.setting.getBoolean('Abp.Zero.UserManagement.UserLockOut.IsEnabled');
    passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();
    userPara: UserListDto;
    user: UserEditDto = new UserEditDto();
    roles: UserRoleDto[];
    sendActivationEmail = true;
    setRandomPassword = true;
    passwordComplexityInfo = '';
    profilePicture: string;
    allOrganizationUnits: OrganizationUnitDto[];
    memberedOrganizationUnits: string[];

    constructor(fb: FormBuilder, private modalRef: NzModalRef,
        injector: Injector,
        private userService: UserServiceProxy,
        private profileService: ProfileServiceProxy
    ) {
        super(injector);
        this.f = fb.group({
            name: [null, [Validators.required,Validators.minLength(3)]],
            userName: [null, [Validators.required, Validators.minLength(5)]],
            surname: [null, [Validators.required,Validators.minLength(3)]],
            emailAddress: [null, Validators.required],
            phoneNumber: [null, [Validators.maxLength(24)]],
            sendActivationEmail: [null],
            isActive: [null],
            isTwoFactorEnabled: [null],
            isLockoutEnabled: [null],
            setRandomPassword: [null],
            password: [null],
            passwordRepeat: [null]
        });
    }
    ngOnInit(): void {
       
            this.getUser();
        
    }
    /**
     * 获取用户的基础信息
     */
    getUser(): void {
        if (this.userPara&&!this.userPara.id) {
            this.active = true;
            this.setRandomPassword = true;
            this.sendActivationEmail = true;
        }
        // console.log(this.userPara.id)
        this.userService.getUserForEdit(this.userPara?this.userPara.id:undefined).subscribe(userResult => {
            this.user = userResult.user;
            this.roles = userResult.roles;
            this.canChangeUserName = this.user.userName !== AppConsts.userManagement.defaultAdminUserName;
            this.allOrganizationUnits = userResult.allOrganizationUnits;
            this.memberedOrganizationUnits = userResult.memberedOrganizationUnits;
            this.getProfilePicture(userResult.profilePictureId);
            // 设置组织架构
            this.organizationUnitTree.editData = <IOrganizationUnitsTreeComponentData>{
                allOrganizationUnits: this.allOrganizationUnits,
                selectedOrganizationUnits: this.memberedOrganizationUnits
            };
            if (this.userPara&&this.userPara.id) {
                this.active = true;
                setTimeout(() => {
                    this.setRandomPassword = false;
                }, 0);
                this.sendActivationEmail = false;
            }

            this.profileService.getPasswordComplexitySetting().subscribe(passwordComplexityResult => {
                this.passwordComplexitySetting = passwordComplexityResult.setting;
                this.setPasswordComplexityInfo();
            });
        });
    }

    setPasswordComplexityInfo(): void {
        this.passwordComplexityInfo = '<ul>';
        if (this.passwordComplexitySetting.requireDigit) {
            this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequireDigit_Hint') + '</li>';
        }
        if (this.passwordComplexitySetting.requireLowercase) {
            this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequireLowercase_Hint') + '</li>';
        }
        if (this.passwordComplexitySetting.requireUppercase) {
            this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequireUppercase_Hint') + '</li>';
        }
        if (this.passwordComplexitySetting.requireNonAlphanumeric) {
            this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequireNonAlphanumeric_Hint') + '</li>';
        }
        if (this.passwordComplexitySetting.requiredLength) {
            this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequiredLength_Hint', this.passwordComplexitySetting.requiredLength) + '</li>';
        }
        this.passwordComplexityInfo += '</ul>';
    }

    getProfilePicture(profilePictureId: string): void {
        if (!profilePictureId) {
            this.profilePicture = '/assets/common/images/default-profile-picture.png';
        } else {
            this.profileService.getProfilePictureById(profilePictureId).subscribe(result => {
                if (result && result.profilePicture) {
                    this.profilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
                } else {
                    this.profilePicture = '/assets/common/images/default-profile-picture.png';
                }
            });
        }
    }

    save(): void {
        let input = new CreateOrUpdateUserInput();
        input.user = this.user;
        input.setRandomPassword = this.setRandomPassword;
        input.sendActivationEmail = this.sendActivationEmail;
        input.assignedRoleNames =
            _.map(
                _.filter(this.roles, { isAssigned: true }), role => role.roleName
            );
        input.organizationUnits = this.organizationUnitTree.getSelectedOrganizations();
        this.saving = true;
        this.userService.createOrUpdateUser(input)
            .finally(() => { this.saving = false; })
            .subscribe(() => {
                this.msg.success(this.l('SavedSuccessfully'));
                this.modalRef.close(true);
            });
    }

    close(): void {
        this.active = false;
        this.modalRef.destroy();
    }
    /**
     * 分配的角色数量
     */
    getAssignedRoleCount(): number {
        return _.filter(this.roles, { isAssigned: true }).length;
    }
}
