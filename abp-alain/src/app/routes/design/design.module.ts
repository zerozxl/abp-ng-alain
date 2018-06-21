import { LabelComponent } from './product/label.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { NzTreeModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { DesignRoutingModule } from './design-routing.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        DesignRoutingModule],
    providers: [

    ],
    declarations: [
        LabelComponent
    ],
    entryComponents: [
    ]
})
export class DesignModule { }
