import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BingoAnimationComponent } from './bingo-animation.component';

describe('BingoAnimationComponent', () => {
  let component: BingoAnimationComponent;
  let fixture: ComponentFixture<BingoAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BingoAnimationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BingoAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
