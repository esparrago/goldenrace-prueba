import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BallSelectorComponent } from './ball-selector.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


describe('BallSelectorComponent', () => {
  let component: BallSelectorComponent;
  let fixture: ComponentFixture<BallSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [ BallSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BallSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger click event', fakeAsync(() => {
    spyOn(component, 'getSelectedBall');
    let ball = fixture.debugElement.nativeElement.querySelector('.ball-option > img')
    ball.click();
    tick();
    expect(component.getSelectedBall).toHaveBeenCalled();
  }));

  it('should assign parameter value to ball input', fakeAsync(()=> {
    let trigger = component.getSelectedBall(1);
    tick();
    expect(component.selectorForm.controls["ball"].value).toBe(1);
  }));

});
