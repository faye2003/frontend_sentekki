import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslatorLastComponent } from './translator-last.component';

describe('TranslatorLastComponent', () => {
  let component: TranslatorLastComponent;
  let fixture: ComponentFixture<TranslatorLastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslatorLastComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TranslatorLastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
