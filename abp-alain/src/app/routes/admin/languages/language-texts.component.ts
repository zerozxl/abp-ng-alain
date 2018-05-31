import { Location } from '@angular/common';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Abp, abp } from '@core/abp/abp';
import { ReuseTabService, SimpleTableComponent, SimpleTableColumn } from '@delon/abc';
import { AppComponentBase } from '@shared/app-component-base';
import * as _ from 'lodash';
import { NzMessageService } from 'ng-zorro-antd';
import { LanguageServiceProxy, LanguageTextListDto } from '@shared/service-proxies/service-proxies';
import { EditLanguateTextModalComponent } from './edit-languate-text-modal.component';

@Component({
  selector: 'app-language-texts',
  templateUrl: './language-texts.component.html',
})
export class LanguageTextsComponent extends AppComponentBase implements OnInit {
  sourceNames: string[] = [];
  languages: abp.localization.ILanguageInfo[] = [];
  baseLanguageName: string;
  targetLanguageName: string;
  sourceName: string;
  targetValueFilter: string;
  filterText: string;
  data: any;
  defaultLanguageName: any;
  @ViewChild('st') st: SimpleTableComponent;

  columns: SimpleTableColumn[] = [
    {
      title: this.l('Key'),
      index: 'key'
    },
    { title: this.l('BaseValue'), index: 'baseValue' },
    { title: this.l('TargetValue'), index: 'targetValue' },
    {
      title: this.l('Actions'),
      buttons: [
        {
          text: this.l('Edit'),
          type: 'modal',
          paramName: 'languageText',
          params: (record: any) => ({
            baseLanguageName: this.baseLanguageName,
            targetLanguageName: this.targetLanguageName,
            sourceName: this.sourceName
          }),
          component: EditLanguateTextModalComponent,
          click: (record: any, modal: any) => this.getLanguageTexts()
        }
      ]
    }
  ];
  constructor(
    private route: ActivatedRoute,
    private languageService: LanguageServiceProxy,
    injector: Injector,
    private reuseTabService: ReuseTabService
  ) {

    super(injector);
  }
  // _onReuseInit() {
  //   console.log('_onReuseInit1');
  // }
  // _onReuseDestroy() {
  //   console.log('_onReuseDestroy3');
  // }
  ngOnInit(): void {
    // tslint:disable-next-line:max-line-length
    this.sourceNames = _.map(_.filter(Abp.localization.sources, source => source.type === 'MultiTenantLocalizationSource'), value => value.name);
    this.languages = Abp.localization.languages;
    this.init();
    this.getLanguageTexts();
  }
  init(): void {
    this.route.params.subscribe((params: Params) => {
      this.reuseTabService.title = `编辑语言` + params['name'];
      this.baseLanguageName = params['baseLanguageName'] || Abp.localization.currentLanguage.name;
      this.targetLanguageName = params['name'];
      this.sourceName = params['sourceName'] || 'AbpZeroTemplate';
      this.targetValueFilter = params['targetValueFilter'] || 'ALL';
      this.filterText = params['filterText'] || '';
      // console.log(this.baseLanguageName);
    });
  }
  getLanguageTexts() {
    this.loading = true;
    this.languageService.getLanguageTexts(
      this.st.ps,
      (this.st.pi - 1) * this.st.ps,
      '',
      this.sourceName,
      this.baseLanguageName,
      this.targetLanguageName,
      this.targetValueFilter,
      this.filterText
    ).finally(() => { this.loading = false; })
      .subscribe(result => {
        this.st.total = result.totalCount;
        this.data = result.items;
        const pi = this.st.pi;
        setTimeout(() => {
          this.st.pi = pi;
        }, 50);
      });
  }
}
