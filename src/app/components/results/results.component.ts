import { Component, OnInit } from '@angular/core';
import { SharedDataService } from 'src/app/services/shared-data/shared-data.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

  showResults: boolean;
  result: any;
  ball: string;
  bet: string;
  resultsInfo:any;
  earnings:number;
  multiplier: number;


  constructor(private sdService:SharedDataService) {
    this.showResults = false;
    this.result = null;
    this.ball = "";
    this.bet = "";
    this.earnings = 0;
    this.multiplier = 1.5;
    
  }

  ngOnInit(): void {
    const animEndSubscriber = this.sdService.animationEnded.subscribe((ended:boolean)=>{
      this.ball = this.sdService.ballResult.value;
      if (ended !== true) return;
      
      setTimeout(() => {
        this.showResults = true;
      }, 1000);

      setTimeout(() => {
        this.showModal();
      }, 1300);

    });
  }

  showModal(){
    const ballChoosed = this.sdService.bettedData.ball;
    const ballResult = this.sdService.ballResult.value;
    if (ballChoosed == ballResult) {
      this.result = "win";
      this.bet = this.sdService.bettedData.bet;
      this.earnings = parseInt(this.bet) * this.multiplier;
    }
    else {
      this.result = "lose";
    }
  }

  closeModal(){
    this.showResults = false;
    this.result = null; 
  }

  resetGame(){
    this.closeModal();
    this.sdService.resetGame.next(true);
  }

}
