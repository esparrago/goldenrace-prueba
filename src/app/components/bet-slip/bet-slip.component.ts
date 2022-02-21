import { Component,Output,EventEmitter, OnInit } from '@angular/core';
import { SharedDataService } from 'src/app/services/shared-data/shared-data.service';
import { FormData } from 'src/app/models/form-data/form-data';
import { Subscriber, Subscription } from 'rxjs';


@Component({
  selector: 'app-bet-slip',
  templateUrl: './bet-slip.component.html',
  styleUrls: ['./bet-slip.component.scss']
})

export class BetSlipComponent implements OnInit {
  @Output() started:EventEmitter<boolean> = new EventEmitter<boolean>();
  
  betData: FormData;
  subscription: Subscription;

  constructor(private sdService: SharedDataService) {
    this.betData = {
      bet: "5",
      ball: "",
      valid: false
    }

    this.subscription = this.sdService.betFormData.subscribe(data => {
      this.betData = data; 
    });
  }

  ngOnInit(): void {
    
  }

  initialize() {
    
  }

  start() {
    this.sdService.bettedData.ball = this.betData.ball;
    this.sdService.bettedData.bet = this.betData.bet;
    this.subscription.unsubscribe();
    this.sdService.getRandomInt();
    this.started.emit(true);

    const resetSuscription = this.sdService.resetGame.subscribe( (reset:boolean) => {
      if (!reset) return;
      this.reset();
      resetSuscription.unsubscribe();
    });
  }

  reset() {
    this.started.emit(false);
    this.betData.ball = "";
    this.betData.bet = "5";
    this.betData.valid = false;
    this.subscription = this.sdService.betFormData.subscribe(data => {
      this.betData = data; 
    });
  }

}
