import { Component, OnInit } from '@angular/core';
import { SharedDataService } from 'src/app/services/shared-data/shared-data.service';

export interface BetData {
  ball?: string;
  bet?: string;
}

@Component({
  selector: 'app-bet-slip',
  templateUrl: './bet-slip.component.html',
  styleUrls: ['./bet-slip.component.scss']
})

export class BetSlipComponent implements OnInit {
  
  betData:BetData;

  constructor(private SDService: SharedDataService) {
    this.betData = {};
    this.SDService.betFormData.subscribe((data:BetData)=>{
      console.log(data);
      this.betData = data;
    });
  }

  ngOnInit(): void {
  }

}
