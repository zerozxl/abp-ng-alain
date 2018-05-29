import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateOrEditLanguageComponent } from './create-or-edit-language.component';

describe('CreateOrEditLanguateComponent', () => {
  let component: CreateOrEditLanguageComponent;
  let fixture: ComponentFixture<CreateOrEditLanguageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateOrEditLanguageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrEditLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
