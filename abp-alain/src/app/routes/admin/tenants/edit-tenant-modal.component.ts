import { Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
// import { AppComponentBase } from '@shared/common/app-component-base';
import { AppComponentBase } from '@shared/app-component-base';
// import { ModalDirective } from 'ngx-bootstrap';
// tslint:disable-next-line:max-line-length
import { CommonLookupServiceProxy, SubscribableEditionComboboxItemDto, TenantEditDto, TenantServiceProxy } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import * as moment from 'moment';
import { NzModalRef } from 'ng-zorro-antd';




@Component({
    // tslint:disable-next-line:component-selector
    selector: 'editTenantModal',
    templateUrl: './edit-tenant-modal.component.html'
})
export class EditTenantModalComponent extends AppComponentBase
    implements OnInit {
    record: any;
    tenantPara: any;
    active = false;
    saving = false;
    isUnlimited = false;
    subscriptionEndDateUtcIsValid = false;
    tenant: TenantEditDto = undefined;
    currentConnectionString: string;
    editions: SubscribableEditionComboboxItemDto[] = [];
    isSubscriptionFieldsVisible = false;
    tenantEditionId = '0';
    subscriptionEndDateUtc = undefined;

    constructor(
        injector: Injector,
        private _tenantService: TenantServiceProxy,
        private _commonLookupService: CommonLookupServiceProxy,
        private _model: NzModalRef
    ) {
        super(injector);
    }

    show(tenantId: number): void {
        this.active = true;
        this._commonLookupService.getEditionsForCombobox(false).subscribe(editionsResult => {
            this.editions = editionsResult.items;
            const notSelectedEdition = new SubscribableEditionComboboxItemDto();
            notSelectedEdition.displayText = '没有分配';
            notSelectedEdition.value = '0';
            this.editions.unshift(notSelectedEdition);
            this._tenantService.getTenantForEdit(tenantId).subscribe(
                (tenantResult) => {
                    this.tenant = tenantResult;
                    this.currentConnectionString = tenantResult.connectionString;
                    this.tenant.editionId = this.tenant.editionId || 0;
                    this.isUnlimited = !this.tenant.subscriptionEndDateUtc;
                    this.subscriptionEndDateUtcIsValid = this.isUnlimited || this.tenant.subscriptionEndDateUtc !== undefined;
                    this.tenantEditionId = this.tenant.editionId.toString();
                    this.subscriptionEndDateUtc = this.tenant.subscriptionEndDateUtc;
                    this.toggleSubscriptionFields();
                });
        });
    }

    formatSubscriptionEndDate(date: any): string {
        if (this.isUnlimited) {
            return '';
        }
        if (!this.tenant.editionId) {
            return '';
        }
        if (!date) {
            return '';
        }
        return moment(date).format('L');
    }

    selectedEditionIsFree(): boolean {
        if (!this.tenant.editionId) {
            return true;
        }
        const selectedEditions = _.filter(this.editions, { value: this.tenant.editionId + '' });
        if (selectedEditions.length !== 1) {
            return true;
        }
        const selectedEdition = selectedEditions[0];
        return selectedEdition.isFree;
    }

    ngOnInit() {
        // console.log(this.record);
        this.show(this.tenantPara.id);
    }
    save(): void {
        this.saving = true;
        if (this.tenant.editionId === 0) {
            this.tenant.editionId = null;
        }
        // take selected date as UTC
        if (!this.isUnlimited && this.tenant.editionId) {
            const dt = moment(this.subscriptionEndDateUtc)
                .format('YYYY-MM-DDTHH:mm:ss') + 'Z';
            this.tenant.subscriptionEndDateUtc = moment(dt);
        } else {
            this.tenant.subscriptionEndDateUtc = null;
        }
        this._tenantService.updateTenant(this.tenant)
            .finally(() => this.saving = false)
            .subscribe(() => {
                this.msg.success(this.l('SavedSuccessfully'));
                this._model.destroy('onOk');
                // this.modalSave.emit(null);
            });
        /* */
        // this.close();
    }
    close(): void {
        this._model.destroy();
    }
    onEditionChange($event): void {

        if (this.selectedEditionIsFree()) {
            this.tenant.isInTrialPeriod = false;
        }

        this.toggleSubscriptionFields();
    }

    toggleSubscriptionFields() {

        if (this.tenant.editionId > 0) {
            this.isSubscriptionFieldsVisible = true;
        } else {
            this.isSubscriptionFieldsVisible = false;
        }
    }
}
