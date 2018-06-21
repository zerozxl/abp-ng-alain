import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
    templateUrl: './label.component.html',
    styleUrls: ['./label.component.less'],
})
export class LabelComponent extends AppComponentBase implements OnInit {

    constructor(
        injector: Injector) {
        super(injector);
    }
    /**
     * 初始化
     */
    ngOnInit(): void {
    }

}
