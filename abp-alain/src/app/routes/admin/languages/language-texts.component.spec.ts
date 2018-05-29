import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageTextsComponent } from './language-texts.component';

describe('LanguageTextsComponent', () => {
  let component: LanguageTextsComponent;
  let fixture: ComponentFixture<LanguageTextsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LanguageTextsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageTextsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
