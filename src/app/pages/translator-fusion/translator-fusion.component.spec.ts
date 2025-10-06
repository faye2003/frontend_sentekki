import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslatorFusionComponent } from './translator-fusion.component';

describe('TranslatorFusionComponent', () => {
  let component: TranslatorFusionComponent;
  let fixture: ComponentFixture<TranslatorFusionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslatorFusionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TranslatorFusionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
