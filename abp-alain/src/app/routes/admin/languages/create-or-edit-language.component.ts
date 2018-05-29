import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SFSchema, SFSchemaEnumType, SFUISchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { AppComponentBase } from '@shared/app-component-base';
import {
  ApplicationLanguageEditDto, ComboboxItemDto,
  CreateOrUpdateLanguageInput, LanguageServiceProxy
} from '@shared/service-proxies/service-proxies';
import { NzModalRef } from 'ng-zorro-antd';

@Component({
  selector: 'app-create-or-edit-language',
  templateUrl: './create-or-edit-language.component.html'
})
export class CreateOrEditLanguageComponent extends AppComponentBase implements OnInit {
  languagePara: any;
  schema: SFSchema = {
    properties: {
      id: { type: 'string', title: this.l('Id'), readOnly: true },
      name: {
        type: 'string', title: this.l('Name'),
        ui: {
          widget: 'select'
        },
        enum: []
      },
      icon: {
        type: 'string', title: this.l('Icon'),
        ui: {
          widget: 'select'
        },
        enum: []
      },
      isEnabled: { type: 'boolean', title: this.l('IsEnabled') },
    },
    required: ['name', 'icon'],
    type: 'object'
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 },
    },
    $href: {
      widget: 'string',
    },
    $description: {
      widget: 'textarea',
      grid: { span: 24 },
    },
  };
  language: ApplicationLanguageEditDto = new ApplicationLanguageEditDto();

  languageNames: ComboboxItemDto[] = [];
  flags: ComboboxItemDto[] = [];
  constructor(
    private modalRef: NzModalRef,
    injector: Injector,
    private languageService: LanguageServiceProxy,
    private route: ActivatedRoute
  ) {
    super(injector);
  }
  ngOnInit(): void {
    this.getLanuage(this.languagePara ? this.languagePara.id : undefined);

    // this.http.get(`/user/${this.record.id}`).subscribe(res => (this.i = res));
  }
  getLanuage(languageId?: number): void {

    this.languageService.getLanguageForEdit(languageId).subscribe(result => {
      this.language = result.language;
      // 对select选项进行转换 --考虑做通用方法
      const langNames: SFSchemaEnumType[] = [];
      result.languageNames.forEach(element => {
        langNames.push({ label: element.displayText, value: element.value });
      });
      const flgs: SFSchemaEnumType[] = [];
      result.flags.forEach(element => {
        flgs.push({ label: element.displayText, value: element.value });
        // tslint:disable-next-line:max-line-length
        // flgs.push({ label: '<i class="famfamfam-flags '+ element.displayText+'"</i>&nbsp;<span>'+element.displayText+'</span>', value: element.value });
      });
      this.schema.properties.name.enum = langNames;
      this.schema.properties.icon.enum = flgs;
    });
  }
  save(value: any) {
    const input = new CreateOrUpdateLanguageInput();
    input.language = new ApplicationLanguageEditDto(value);
    this.languageService.createOrUpdateLanguage(input)
      .subscribe(() => {
        this.msg.success('保存成功');
        this.modalRef.close(true);
      });
  }

  close() {
    this.modalRef.destroy();
  }
}
