import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DashboardChartModel } from '../dashboard/dashboard_chart.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardChartService {
    url='api/ScrewCompressureAPI'
    constructor(private http: HttpClient) { }

    
 

    
    getDashboardChart(): Observable<DashboardChartModel[]> {
      //   return this.http.get<DataModel[]>(this.url+'?_sort=Id&_order=desc');
      return this.http.get<DashboardChartModel[]>(this.url);
}

}


