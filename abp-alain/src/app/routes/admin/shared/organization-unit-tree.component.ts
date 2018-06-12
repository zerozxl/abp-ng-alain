import { Component, Injector, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { OrganizationUnitDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { NzTreeComponent, NzTreeNode } from 'ng-zorro-antd';

export interface IOrganizationUnitsTreeComponentData {
    allOrganizationUnits: OrganizationUnitDto[];
    selectedOrganizationUnits: string[];
}

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'organization-unit-tree',
    template:
        `
        <nz-input-group [nzSuffix]="suffixIcon">
          <input type="text" nz-input placeholder="{{'Search'|translate}}" [(ngModel)]="filter">
        </nz-input-group>
        <ng-template #suffixIcon>
          <i class="anticon anticon-search"></i>
        </ng-template>
        <nz-tree #tree [(ngModel)]="nodes"
        [nzSearchValue]="filter"
        [nzCheckable]="true"
        [nzMultiple]="true"
        [nzCheckStrictly]="true"
        [nzDefaultCheckedKeys]="selectedOrganizationUnits"
        [nzDefaultExpandAll]="expandDefault">
        </nz-tree>
    `
})
export class OrganizationUnitsTreeComponent extends AppComponentBase {
    @ViewChild('tree') tree: NzTreeComponent;
    nodes: NzTreeNode[] = [];
    _createdTreeBefore;
    allOrganizationUnits: OrganizationUnitDto[];
    selectedOrganizationUnits: string[] = [];
    filter = '';
    expandDefault = true;
    constructor(
        injector: Injector
    ) {
        super(injector);
    }
    set editData(data: IOrganizationUnitsTreeComponentData) {

        const selectedCodes = data.selectedOrganizationUnits;
        const allOrganizationUnits = data.allOrganizationUnits;

        _.forEach(selectedCodes, u => {
            const org = _.find(allOrganizationUnits, function (o) { return o.code === u; });
            if (org) {
                this.selectedOrganizationUnits.push(org.id.toString());
            }
        });
        this.allOrganizationUnits = allOrganizationUnits;

        this.nodes = this.convertNzTreeNode(this.allOrganizationUnits, null);
    }
    /**
     * 转换NzTreeNode
     * @param permissions 权限列表
     * @param parentName 父权限名称
     */
    convertNzTreeNode(
        organizations: OrganizationUnitDto[],
        parentId: number): NzTreeNode[] {
        const treenodes = _.filter(organizations, { parentId: parentId })
            .map((o: OrganizationUnitDto) => {
                const node = new NzTreeNode({
                    title: o.displayName,
                    key: o.id.toString(),
                    selectable: false
                });
                const childrens = this.convertNzTreeNode(organizations, o.id);
                if (childrens && childrens.length > 0) {
                    node.addChildren(childrens);
                }
                return node;
            });
        return treenodes;
    }
    /**
     * 获取选中的组织值
     */
    getSelectedOrganizations(): number[] {
        const nodes = this.tree.nzTreeService.getCheckedNodeList();
        return _.map(nodes, node => {
            return node.key;
        });
    }
}
