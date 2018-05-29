import { Component, OnInit, ViewChild, Injector, Input } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { LanguageServiceProxy, UpdateLanguageTextInput, LanguageTextListDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { abp, Abp } from '@core/abp/abp';
import * as _ from 'lodash';
@Component({
  selector: 'app-edit-languate-text-modal',
  templateUrl: './edit-languate-text-modal.component.html'
})
export class EditLanguateTextModalComponent extends AppComponentBase implements OnInit {

  @Input() baseLanguageName: string;
  @Input() targetLanguageName: string;
  @Input() sourceName: string;
  baseText: string;
  baseLanguage: abp.localization.ILanguageInfo;
  targetLanguage: abp.localization.ILanguageInfo;
  languageText: LanguageTextListDto;
  model: UpdateLanguageTextInput = new UpdateLanguageTextInput();
  schema: SFSchema = {
    properties: {
      key: { type: 'string', title: this.l('Key'), readOnly: true },
      languageName: { type: 'string', title: this.l('LanguageName'), readOnly: true },
      sourceName: { type: 'string', title: this.l('SourceName'), readOnly: true },
      value: { type: 'string', title: this.l('Value') },
    },
    required: ['key'],
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

  constructor(
    private modalRef: NzModalRef,
    injector: Injector,
    private languageService: LanguageServiceProxy
  ) {
    super(injector);

  }

  ngOnInit(): void {
    this.model.sourceName = this.sourceName;
    this.model.key = this.languageText.key;
    this.model.languageName = this.targetLanguageName;
    this.model.value = this.languageText.targetValue;
    this.baseText = this.languageText.baseValue;
    this.baseLanguage = _.find(Abp.localization.languages, l => l.name === this.baseLanguageName);
    this.targetLanguage = _.find(Abp.localization.languages, l => l.name === this.targetLanguageName);
  }
  save(value: any): void {
    const updateLanguageTextInput = new UpdateLanguageTextInput(value);
    this.languageService.updateLanguageText(updateLanguageTextInput)
      .subscribe(() => {
        this.msg.success('保存成功');
        this.modalRef.close(true);
      });
  }
  close() {
    this.modalRef.destroy();
  }
}
