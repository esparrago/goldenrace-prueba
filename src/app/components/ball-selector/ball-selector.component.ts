import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl  } from '@angular/forms';
import { SharedDataService } from 'src/app/services/shared-data/shared-data.service';


@Component({
  selector: 'app-ball-selector',
  templateUrl: './ball-selector.component.html',
  styleUrls: ['./ball-selector.component.scss']
})
export class BallSelectorComponent implements OnInit {

  @Output() started:EventEmitter<boolean> = new EventEmitter<boolean>();

  OPTIONS_NUMBER: number = 10; //number of ball options
  optionsArr: Array<any>;
  selectorForm: FormGroup;
  
  constructor( private fb: FormBuilder, private SDService: SharedDataService) {
    //Fill array with OPTIONS_NUMBER number of options for ngFor
    this.optionsArr = Array(this.OPTIONS_NUMBER).fill(null).map((x,i)=>i+1);
    
    //Create Selector Form
    this.selectorForm = this.fb.group({
      ball: ['', [Validators.required] ],
      bet: ['5', [Validators.required, Validators.pattern("^[0-9]*$")] ],
    });
  }

  ngOnInit(): void {
    this.selectorForm.valueChanges.subscribe((val:any) => {
      if (!val.bet) return;
      this.modifyBetInput(this.selectorForm.controls["bet"]);
    });
  }


  getSelectedBall(ball:number){
    this.selectorForm.controls["ball"].setValue(ball);
    this.SDService.betFormData.next(this.selectorForm.value);
  }

  modifyBetInput(betControl:AbstractControl) {
    if (!this.isNumeric(betControl.value)){
      betControl.setValue(betControl.value.replace(/[^\d.-]/g,''));
      if (!betControl.value.lenght)betControl.setValue("5");
    }
    else if (parseInt(betControl.value) < 5 ) {
      betControl.setValue("5");
    }
    this.SDService.betFormData.next(this.selectorForm.value);
  }

  isNumeric(n:any) {
    return !isNaN(parseInt(n)) && isFinite(n);
  }

  start() {
    this.started.emit(true);
  }

}
