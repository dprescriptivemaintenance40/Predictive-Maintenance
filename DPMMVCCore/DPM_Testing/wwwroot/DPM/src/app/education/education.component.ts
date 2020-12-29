import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent {
  constructor( private title: Title){}
  ngOnInit(){
    this.title.setTitle('DPM/Education');
  }

  article1(){
    let link = document.createElement("a");
    link.download = "DPM Article 1.1-v0.2";
    link.href = "DPM/dist/DPM/assets/DPM Article 1.1-v0.2.pdf";
    link.click();
  }
  

}
