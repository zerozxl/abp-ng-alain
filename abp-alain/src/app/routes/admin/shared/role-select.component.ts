// tslint:disable-next-line:max-line-length
import { Component, OnInit, AfterViewInit, AfterViewChecked, ElementRef, ViewChild, Injector, Input, Output, EventEmitter } from '@angular/core';
import { RoleServiceProxy, RoleListDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'role-select',
    template:
        `<nz-select #RoleSelectbox  [(ngModel)]="selectedRole"
        (ngModelChange)="selectedPermissionChange.emit($event)" nzShowSearch nzAllowClear>
        <nz-option *ngFor="let role of roles" [nzValue]="role.id" [nzLabel]="role.displayName"></nz-option>
        </nz-select>`
})
export class RoleSelectComponent extends AppComponentBase implements OnInit {
    @ViewChild('RoleSelectbox') roleselectboxElement: ElementRef;
    roles: RoleListDto[] = [];
    @Input() selectedRole: string = undefined;
    @Output() selectedRoleChange: EventEmitter<string> = new EventEmitter<string>();
    @Input() emptyText = '';
    constructor(
        private roleService: RoleServiceProxy,
        injector: Injector) {
        super(injector);
    }
    ngOnInit(): void {
        this.roleService.getRoles(undefined).subscribe(result => {
            this.roles = result.items;
        });
    }
}
