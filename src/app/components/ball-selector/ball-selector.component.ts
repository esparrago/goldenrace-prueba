import { Component, OnInit} from '@angular/core';
import { FormGroup, Validators, FormBuilder} from '@angular/forms';
import { SharedDataService } from 'src/app/services/shared-data/shared-data.service';


@Component({
  selector: 'app-ball-selector',
  templateUrl: './ball-selector.component.html',
  styleUrls: ['./ball-selector.component.scss']
})
export class BallSelectorComponent implements OnInit {

  optionsNumber: number = 10; //number of ball options
  optionsArr: Array<any>;
  selectorForm: FormGroup;

  constructor( private fb: FormBuilder, private sdService: SharedDataService) {
    //Fill array with optionsNumber number of options for ngFor
    this.optionsArr = Array(this.optionsNumber).fill(null).map((x,i)=>i+1);
    
    //Create Selector Form
    this.selectorForm = this.fb.group({
      ball: ['', [Validators.required] ],
      bet: ['5', [Validators.required, Validators.pattern("^[0-9]*$")] ],
    });
    this.sendData();
  }

  ngOnInit(): void {
    this.selectorForm.valueChanges.subscribe((val:any) => {
      this.sendData();
    });

    const resetSuscription = this.sdService.resetGame.subscribe( (reset:boolean) => {
      if (!reset) return;
      this.reset();
      resetSuscription.unsubscribe();
    });
  }


  sendData(){
    const data = {
      bet: this.selectorForm.controls["bet"].value,
      ball: this.selectorForm.controls["ball"].value,
      valid: this.selectorForm.valid
    }
    this.sdService.betFormData.next(data);
  }

  getSelectedBall(ball:number){
    this.selectorForm.controls["ball"].setValue(ball);
  }

  reset(){
    this.selectorForm.controls["ball"].setValue("");
    this.selectorForm.controls["bet"].setValue("5");
  }
}
