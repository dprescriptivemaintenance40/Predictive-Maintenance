import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  constructor(private title: Title) {
    this.title.setTitle('8 Steps | Dynamic Prescriptive Maintenence');
  }

  ngOnInit(): void {
  }

}
