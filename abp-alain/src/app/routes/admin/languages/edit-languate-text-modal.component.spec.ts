import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditLanguateTextModalComponent } from './edit-languate-text-modal.component';

describe('EditLanguateTextModalComponent', () => {
  let component: EditLanguateTextModalComponent;
  let fixture: ComponentFixture<EditLanguateTextModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLanguateTextModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLanguateTextModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
