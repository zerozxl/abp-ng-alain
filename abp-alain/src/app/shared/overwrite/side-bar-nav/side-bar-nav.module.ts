import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { SideBarNavComponent } from './side-bar-nav.component';

@NgModule({
  imports: [CommonModule, RouterModule, NgZorroAntdModule],
  declarations: [SideBarNavComponent],
  exports: [SideBarNavComponent],
})
export class AdSideBarNavModule {
  static forRoot(): ModuleWithProviders {
    return { ngModule: AdSideBarNavModule, providers: [] };
  }
}
