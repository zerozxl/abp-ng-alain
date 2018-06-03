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
    private _createdTreeBefore;
    private allOrganizationUnits: OrganizationUnitDto[];
    private selectedOrganizationUnits: string[];
    private filter = '';
    private expandDefault = true;
    constructor(
        injector: Injector
    ) {
        super(injector);
    }
    set editData(data: IOrganizationUnitsTreeComponentData) {
        this.allOrganizationUnits = data.allOrganizationUnits;
        this.selectedOrganizationUnits = data.selectedOrganizationUnits;
        console.log(this.selectedOrganizationUnits);
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
        var treenodes = _.filter(organizations, { parentId: parentId })
            .map((o: OrganizationUnitDto) => {
                var node = new NzTreeNode({
                    title: o.displayName,
                    key: o.code,
                    selectable: false
                });
                var childrens = this.convertNzTreeNode(organizations, o.id);
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
        var nodes = this.tree.nzTreeService.getCheckedNodeList();
        return _.map(nodes, node => {
            return node.key;
        });
    }
}
