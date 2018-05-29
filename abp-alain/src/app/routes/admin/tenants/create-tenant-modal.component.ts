import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import {
    CommonLookupServiceProxy, CreateTenantInput, PasswordComplexitySetting,
    ProfileServiceProxy, TenantServiceProxy
} from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import * as moment from 'moment';
import { NzModalRef } from 'ng-zorro-antd';



@Component({
    // tslint:disable-next-line:component-selector
    selector: 'createTenantModal',
    templateUrl: './create-tenant-modal.component.html'
})
export class CreateTenantModalComponent
    extends AppComponentBase implements OnInit {

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    setRandomPassword = true;
    useHostDb = true;
    editions = [];
    tenant: CreateTenantInput;
    passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();
    isUnlimited = false;
    isSubscriptionFieldsVisible = false;
    isSelectedEditionFree = false;

    subscriptionEndDateUtc = undefined;

    constructor(
        injector: Injector,
        private _tenantService: TenantServiceProxy,
        private _commonLookupService: CommonLookupServiceProxy,
        private _profileService: ProfileServiceProxy,
        private _model: NzModalRef
    ) {
        super(injector);
    }

    show() {
        this.active = true;
        this.init();

        this._profileService.getPasswordComplexitySetting().subscribe(result => {
            this.passwordComplexitySetting = result.setting;
            // this.modal.show();
        });
    }

    ngOnInit() {
        // this.show();
        this.init();
    }

    onShown(): void {
        /*
        $(this.tenancyNameInput.nativeElement).focus();
        $(this.subscriptionEndDateUtc.nativeElement).datetimepicker({
            locale: abp.localization.currentLanguage.name,
            format: 'L'
        });
        */
    }

    init(): void {
        this.tenant = new CreateTenantInput();
        this.tenant.isActive = true;
        this.tenant.shouldChangePasswordOnNextLogin = true;
        this.tenant.sendActivationEmail = true;
        this.tenant.editionId = 0;
        this.tenant.isInTrialPeriod = false;


        this._commonLookupService.getEditionsForCombobox(false)
            .subscribe((result) => {
                this.editions = result.items;
                this.editions.unshift({ value: 0, displayText: this.l('NotAssigned') });

                this._commonLookupService.getDefaultEditionName().subscribe((getDefaultEditionResult) => {
                    const defaultEdition = _.filter(this.editions, { 'displayText': getDefaultEditionResult.name });
                    if (defaultEdition && defaultEdition[0]) {
                        this.tenant.editionId = parseInt(defaultEdition[0].value, null);
                        this.toggleSubscriptionFields();
                    }
                });
            });
        /*  */
    }

    getEditionValue(item): number {
        return parseInt(item.value, null);
    }

    selectedEditionIsFree(): boolean {
        const selectedEditions =
            _.filter(this.editions, { 'value': this.tenant.editionId.toString() });

        if (selectedEditions.length !== 1) {
            this.isSelectedEditionFree = true;
        }

        const selectedEdition = selectedEditions[0];
        this.isSelectedEditionFree = selectedEdition.isFree;
        return this.isSelectedEditionFree;
    }

    subscriptionEndDateIsValid(): boolean {
        if (this.tenant.editionId <= 0) {
            return true;
        }

        if (this.isUnlimited) {
            return true;
        }

        if (!this.subscriptionEndDateUtc) {
            return false;
        }

        // const subscriptionEndDateUtc = $(this.subscriptionEndDateUtc.nativeElement).val();
        return this.subscriptionEndDateUtc !== undefined; // && subscriptionEndDateUtc !== '';
        // return false;
    }

    save(): void {

        this.saving = true;

        if (this.setRandomPassword) {
            this.tenant.adminPassword = null;
        }

        if (this.tenant.editionId === 0) {
            this.tenant.editionId = null;
        }

        // take selected date as UTC
        if (!this.isUnlimited && this.tenant.editionId > 0) {
            this.tenant.subscriptionEndDateUtc = moment(this.subscriptionEndDateUtc);
            // tslint:disable-next-line:max-line-length
            // this.tenant.subscriptionEndDateUtc = moment($(this.subscriptionEndDateUtc.nativeElement).data('DateTimePicker').date().format('YYYY-MM-DDTHH:mm:ss') + 'Z');
        } else {
            this.tenant.subscriptionEndDateUtc = null;
        }

        this._tenantService.createTenant(this.tenant)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.msg.info(this.l('SavedSuccessfully'));
                this._model.destroy('onOk');
            });
    }

    close(): void {
        this._model.destroy();
    }

    onEditionChange(): void {
        this.tenant.isInTrialPeriod = this.tenant.editionId > 0 && !this.selectedEditionIsFree();
        this.toggleSubscriptionFields();
    }

    toggleSubscriptionFields() {
        console.log(this.tenant);
        if (this.tenant.editionId > 0) {
            this.isSubscriptionFieldsVisible = true;
        } else {
            this.isSubscriptionFieldsVisible = false;
        }
    }
}
