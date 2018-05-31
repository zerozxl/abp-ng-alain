import {
    Component,
    OnInit,
    AfterViewInit,
    ElementRef,
    ViewChild,
    Injector,
    Input,
    Output,
    EventEmitter

} from '@angular/core';
import { EditionServiceProxy, ComboboxItemDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';

/*

<select #EditionCombobox
        class="form-control"
        [(ngModel)]="selectedEdition"
        (ngModelChange)="selectedEditionChange.emit($event)"
        [attr.data-live-search]="true">
            <option *ngFor="let edition of editions" [value]="edition.value">{{edition.displayText}}</option>
    </select>

*/

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'edition-combo',
    template:
        `
    <nz-select name="EditionCombobox" 
        [nzSize]="'middle'"
        [nzShowSearch]="true" 
        [(ngModel)]="selectedEdition" 
        (ngModelChange)="selectedEditionChange.emit($event)">
        <nz-option *ngFor="let edition of editions" [nzLabel]="edition.displayText" [nzValue]="edition.value"></nz-option>
    </nz-select>
    `
})
export class EditionComboComponent extends AppComponentBase implements OnInit, AfterViewInit {

    @ViewChild('EditionCombobox') editionComboboxElement: ElementRef;

    editions: ComboboxItemDto[] = [];

    @Input() selectedEdition: string = undefined;
    @Output() selectedEditionChange: EventEmitter<string> = new EventEmitter<string>();

    constructor(
        private _editionService: EditionServiceProxy,
        injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
        const self = this;
        this._editionService.getEditionComboboxItems(0, true, false).subscribe(editions => {
            this.editions = editions;
            setTimeout(() => {
                this.selectedEdition = '-1';
                // $(self.editionComboboxElement.nativeElement).selectpicker('refresh');
            }, 0);
        });
    }

    ngAfterViewInit(): void {
        /*
        $(this.editionComboboxElement.nativeElement).selectpicker({
            iconBase: 'famfamfam-flag',
            tickIcon: 'fa fa-check'
        });
        */
    }
}
