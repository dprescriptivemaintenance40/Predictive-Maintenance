import { Component, OnInit,Input } from '@angular/core';
import {FMEAPrescriptiveModel,CentrifugalPumpFailureMode} from './fmeanew.model';

@Component({
  selector: 'app-fmeanew',
  templateUrl: './fmeanew.component.html',
  styleUrls: ['./fmeanew.component.scss']
})
export class FMEANEWComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
 public type:string="FMEA";
}
