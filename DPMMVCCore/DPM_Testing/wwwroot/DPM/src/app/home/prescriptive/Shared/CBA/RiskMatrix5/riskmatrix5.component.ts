import { Component, OnInit, Output,EventEmitter} from '@angular/core';



@Component({
  selector: 'app-Matrix5Component',
  templateUrl: './riskmatrix5.component.html',
  styleUrls: ['./riskmatrix5.component.css'],

})

export class RiskMatrix5Component implements OnInit {
   @Output() updatecriticalityClass = new EventEmitter<string>();
   
  ngOnInit() {
    
    } 
constructor(){

}
public hidden = false;
public url = "dist/DPM/assets/CBA/RiskMatrix5.png";

imageSource(){
    this.hidden = !this.hidden;
}
}