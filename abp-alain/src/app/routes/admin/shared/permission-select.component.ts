import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Injector, Input, Output, EventEmitter } from '@angular/core';
import { PermissionServiceProxy, FlatPermissionWithLevelDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import * as _ from 'lodash';
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'permission-select',
    template:
        `<nz-select #PermissionSelect
        [(ngModel)]="selectedPermission"
        (ngModelChange)="selectedPermissionChange.emit($event)"
        nzShowSearch nzAllowClear>
            <nz-option *ngFor="let permission of permissions" [nzValue]="permission.name" [nzLabel]="permission.displayName"></nz-option>
    </nz-select>`
})
export class PermissionSelectComponent extends AppComponentBase implements OnInit {

    @ViewChild('PermissionSelect') permissionSelectElement: ElementRef;

    permissions: FlatPermissionWithLevelDto[] = [];

    @Input() selectedPermission: string = undefined;
    @Output() selectedPermissionChange: EventEmitter<string> = new EventEmitter<string>();

    constructor(
        private permissionService: PermissionServiceProxy,
        injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
        this.permissionService.getAllPermissions().subscribe(result => {
            _(result.items).forEach(item => {
                item.displayName = Array(item.level + 1).join('---') + ' ' + item.displayName;
            });
            this.permissions = result.items;
        });
    }

}
