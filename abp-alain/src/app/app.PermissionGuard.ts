import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
@Injectable()
export class PermissionGuard implements CanActivate {
    canActivate() {
        const hasPermission = true;
        if (!hasPermission) {
            console.log('用户无权限访问');
        }
        else {
            console.log('使用权限进入');
        }
        return hasPermission;
        // 返回值true时进入路由
    }
}
