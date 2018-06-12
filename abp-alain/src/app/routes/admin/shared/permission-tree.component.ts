import { AfterViewChecked, AfterViewInit, Component, ElementRef, Injector, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { FlatPermissionDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { NzFormatEmitEvent, NzTreeNode, NzTreeNodeOptions, NzTreeComponent } from 'ng-zorro-antd';
import { PermissionTreeEditModel } from './permission-tree-edit.model';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'permission-tree',
    template:
        `<nz-tree #tree [(ngModel)]="nodes"
            [nzCheckable]="true"
            [nzMultiple]="true"
            [nzCheckStrictly]="true"
              [nzDefaultCheckedKeys]="checkedKeys"
              [nzDefaultExpandAll]="expandDefault"
           >
        </nz-tree>`
})
export class PermissionTreeComponent extends AppComponentBase {
    @ViewChild('tree') tree: NzTreeComponent;
    nodes: NzTreeNode[] = [];
    expandDefault = true;
    editPermission: PermissionTreeEditModel;
    checkedKeys: any;
    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    getGrantedPermissionNames(): string[] {
        const nodes = this.tree.nzTreeService.getCheckedNodeList();
        return _.map(nodes, node => {
            return node.key;
        });
    }
    /**
     * 设置权限值
     */
    set editData(val: PermissionTreeEditModel) {
        this.editPermission = val;
        this.checkedKeys = this.editPermission.grantedPermissionNames;
        this.nodes = this.convertNzTreeNode(this.editPermission.permissions, null);
    }
    /**
     * 转换NzTreeNode
     * @param permissions 权限列表
     * @param parentName 父权限名称
     */
    convertNzTreeNode(
        permissions: FlatPermissionDto[],
        parentName: string): NzTreeNode[] {
        const treenodes = _.filter(permissions, { parentName: parentName }).map(permission => {
            const node = new NzTreeNode({
                title: permission.displayName,
                key: permission.name,
                selectable: false
            });
            const childrens = this.convertNzTreeNode(permissions, permission.name);
            if (childrens && childrens.length > 0) {
                node.addChildren(childrens);
            }
            return node;
        });
        return treenodes;
    }

}
