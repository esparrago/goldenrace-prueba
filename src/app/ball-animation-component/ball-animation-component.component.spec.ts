import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BallAnimationComponentComponent } from './ball-animation-component.component';

describe('BallAnimationComponentComponent', () => {
  let component: BallAnimationComponentComponent;
  let fixture: ComponentFixture<BallAnimationComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BallAnimationComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BallAnimationComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
