import { FlatPermissionDto } from '@shared/service-proxies/service-proxies';

export interface PermissionTreeEditModel {
    /**
     * 所有的权限
     */
    permissions: FlatPermissionDto[];
    /**
     * 已经获得的权限
     */
    grantedPermissionNames: string[];

}
