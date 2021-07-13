import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as pbi from 'powerbi-client'; 
declare var powerbi: any;
@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent {

   constructor(private title: Title) {
    this.title.setTitle('Education | Dynamic Prescriptive Maintenence');
  }
  ngOnInit() {
    this.showReport()
    this.showReport1()
  }
  article1() {
    let link = document.createElement("a");
    link.download = "DPM Article 1.1-v0.2";
    link.href = "dist/DPM/assets/DPM Article 1.1-v0.2.pdf";
    link.click();
  }


  showReport() {
    let embedUrl = 'https://app.powerbi.com/reportEmbed?reportId=8229f0b7-523d-46d9-9a54-b53438061991&autoAuth=true&ctid=606acdf9-2783-4b1f-9afc-a0919c38927d&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXdlc3QtZXVyb3BlLWUtcHJpbWFyeS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D';
    let embedReportId = '8229f0b7-523d-46d9-9a54-b53438061991';
    let reportContainer = <HTMLElement>document.getElementById('reportContainer');
    let powerbi = new pbi.service.Service(pbi.factories.hpmFactory, pbi.factories.wpmpFactory, pbi.factories.routerFactory);
  }

  
  showReport1() {
    let embedUrl = 'https://app.powerbi.com/reportEmbed?reportId=2c517729-b2cc-413b-9b52-c641d53085e3&autoAuth=true&ctid=606acdf9-2783-4b1f-9afc-a0919c38927d&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXdlc3QtZXVyb3BlLWUtcHJpbWFyeS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D';
}
}
