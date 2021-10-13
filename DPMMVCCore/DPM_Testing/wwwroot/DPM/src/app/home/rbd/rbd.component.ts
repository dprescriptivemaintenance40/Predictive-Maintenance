import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rbd',
  templateUrl: './rbd.component.html',
  styleUrls: ['./rbd.component.scss']
})
export class RBDComponent implements OnInit {

  constructor() { }
  public MainTree : any;
  
  ngOnInit(): void {
    this.MainTree = [{
      label: '',
      intialNode : true,
      gate:true,
      final:false,
      L:0.0,
      M:0.0,
      gateType:'',
      expanded: true,
      children: [
      ]
  }];
  }

}
