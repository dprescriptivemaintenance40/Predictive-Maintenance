import { Component, OnInit, Output, EventEmitter } from '@angular/core';



@Component({
    selector: 'app-Matrix6Component',
    templateUrl: './riskmatrix6.component.html',
    styleUrls: ['./riskmatrix6.component.css'],

})

export class RiskMatrix6Component implements OnInit {
    @Output() updatecriticalityClass = new EventEmitter<string>();

    ngOnInit() {

    }
    constructor() {

    }
    public hidden = false;
    public url = "dist/DPM/assets/CBA/RiskMatrix6.png";

    imageSource() {
        this.hidden = !this.hidden;
    }
}