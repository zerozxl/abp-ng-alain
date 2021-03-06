import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';
import { AppComponentBase } from '@shared/app-component-base';
import { LanguageServiceProxy, ApplicationLanguageListDto, SetDefaultLanguageInput } from '@shared/service-proxies/service-proxies';
import { CreateOrEditLanguageComponent } from './create-or-edit-language.component';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html'
})
export class LanguagesComponent extends AppComponentBase implements OnInit {
  @ViewChild('st') st: SimpleTableComponent;
  data: any;
  defaultLanguageName: any;
  columns: SimpleTableColumn[] = [
    { title: 'Name', i18n: 'Name', render: 'displayName' },
    { title: 'Code', i18n: 'Code', index: 'name' },
    { title: 'CreationTime', i18n: 'CreationTime', type: 'date', index: 'creationTime' },
    { title: 'IsEnabled', i18n: 'IsEnabled', render: 'isEnabled' },
    {
      title: 'Actions',
      i18n: 'Actions',
      buttons: [
        {
          text: 'Edit',
          i18n: 'Edit',
          type: 'modal',
          paramName: 'languagePara',
          acl: 'Pages.Administration.Languages.Edit',
          component: CreateOrEditLanguageComponent,
          click: (record: any, modal: any) => this.getLanguages()
        },
        {
          text: 'ChangeTexts',
          i18n: 'ChangeTexts',
          type: 'none',
          click: (record: any) => this.editLanguageText(record)
        },
        {
          text: 'More',
          i18n: 'More',
          children: [
            {
              text: 'SetAsDefaultLanguage',
              i18n: 'SetAsDefaultLanguage',
              click: (record: any) => this.setAsDefaultLanguage(record)
            },
            {
              text: 'Delete',
              i18n: 'Delete',
              click: (record: any) => this.deleteLanguage(record)
            }
          ]
        }
      ]
    }
  ];
  constructor(
    injector: Injector,
    private router: Router,
    private languageService: LanguageServiceProxy
  ) {
    super(injector);
  }

  ngOnInit() {
    this.getLanguages();
  }
  /**
   * 获取支持的语言列表
   */
  getLanguages() {
    this.loading = true;
    this.languageService.getLanguages()
      .finally(() => { this.loading = false; })
      .subscribe(result => {
        this.data = result.items;
        this.defaultLanguageName = result.defaultLanguageName;
      });
  }
  /**
     * 改变语言文本
     * @param language 列表的语言DTO
     */
  editLanguageText(language: ApplicationLanguageListDto) {
    this.router.navigate(['admin/languages', language.name, 'texts']);
  }

  /**
   * 创建新支持语言
   */
  createLanguage() {
    this.modalHelper.open(
      CreateOrEditLanguageComponent,
      {
        languagePara: null
      }).subscribe(() => {
        this.getLanguages();
      });
  }
  /**
     * 删除支持的语言
     * @param language  列表的语言DTO
     */
  deleteLanguage(language: ApplicationLanguageListDto): void {
    this.modal.confirm(
      {
        nzTitle: this.l('LanguageDeleteWarningMessage', language.displayName),
        nzOnOk: () => {
          this.languageService.deleteLanguage(language.id).subscribe(() => {
            this.getLanguages();
            this.msg.success('SuccessfullyDeleted');
          });

        }
      }
    );
  }
  /**
     * 设置默认支持语言
     * @param language 列表的语言DTO
     */
  setAsDefaultLanguage(language: ApplicationLanguageListDto): void {
    const input = new SetDefaultLanguageInput();
    input.name = language.name;
    this.languageService.setDefaultLanguage(input).subscribe(() => {
      this.getLanguages();
      this.msg.success(this.l('SuccessfullySaved'));
    });
  }

}

