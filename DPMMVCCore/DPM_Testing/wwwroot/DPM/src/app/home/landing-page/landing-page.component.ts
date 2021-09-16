import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  public user: any;

  constructor(private title: Title) {
    this.title.setTitle('8 Steps | Dynamic Prescriptive Maintenence');
    if (localStorage.getItem('userObject') != null) {
      this.user = JSON.parse(localStorage.getItem('userObject'))
    }
  }

  ngOnInit(): void {
      if(this.user.UserType === 0){
        var todaysDate= moment();
        var TrialEndDate = moment(this.user.CreatedDate).add(7,'days');
        if(TrialEndDate >= todaysDate){

        }else{
          var a : any = [];
          a= document.getElementById("overlay")
          a.style.display = 'block'
        }
      }
  }

}
