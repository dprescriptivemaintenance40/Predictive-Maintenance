import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import{Chart} from 'chart.js';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
     

  time_data:Array<any>;
  water_data:Array<any>;
 
  constructor( private title: Title){
  }
 
  ngOnInit(){
    let items = [];
          const start = moment(moment().subtract(30, 'm').format("YYYY-MM-DD hh:mm:ss"));        
          for(let i=0; i<=30; i++){
              items.push(start.format("DD MM YYYY hh:mm:ss"));
              start.add(1, 'minute');
          }
  
      var i:any;
      var options = {
      type: 'line',
  
      
        
      data: {
                 labels:items, 
        
        datasets: [
          {
            label: 'Incipent',
            data: [0,1,1,1,1,1,2,3,3,3,4,4,4,4,5,5,6,6,7,8,8,8,9],
            borderWidth: 1,
            borderColor: '#FFA500'
            
          }, 
          {
            label: 'Normal',
           
            data: [1,1,1,2,3,3,3,4,4,4,4,5,5,5,6,8,8,8,9,9,10,10,11,12],
            borderWidth: 1,
             borderColor: '#008000'
          },
          {
            label: 'Degrade                           Time vs Count',
            data: [0,0,1,3,3,3,5,5,5,5,6,6,7,7,7,8,8,9,9,10,10,11,11,13,14,15],
            borderWidth: 2,
             borderColor: ' #FF0000'
          }
        ]
      },
      options: {
        scales: {
         xAxes: [{
            ticks: {
              reverse: false
            }
          }]
         
        }
      },
     
    }
    
    var ctx = document.getElementById('LineContainer');
    new Chart(ctx, options);

    var ctx2 = document.getElementById("pie");
   var myChart = new Chart(ctx2, {
  type: 'pie',
  data: {
    labels: ["Normal", "incipient", "Degrade"],
    datasets: [{
      backgroundColor: [
        "#2ecc71",
        "#f1c40f",
        "#e74c3c"
      ],
      data: [30, 20, 50]
    }]
  }
});
    
    
    }
}
