import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent {

  article1(){
    let link = document.createElement("a");
    link.download = "DPM Article 1.1-v0.2";
    link.href = "DPM/dist/DPM/assets/DPM Article 1.1-v0.2.pdf";
    link.click();
  }
  

}
