import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from "src/app/shared/config.service";

@Injectable({
    providedIn: 'root'
})
export class CommonDLService {
    private headers = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    public options = {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    };
    private URL: string = "";
    constructor(private http: HttpClient,
        private configService: ConfigService) {
        this.URL = this.configService.getApi('URL');
    }



    //#region  GET API's

    //Dynamic get without parameter
    public getWithoutParameters(url) {
        return this.http.get(`${this.URL}${url}`);
    }

    //Dynamic get with parameter
    public getWithParameters(url: string, params) {
        return this.http.get(`${this.URL}${url}`, {params});
    }

    //#endregion



    //#region Post API's

 
    //Dynamic post without header
    public postWithoutHeaders(url, data) {
        return this.http.post(`${this.URL}${url}`, data);
    }

    //Dynamic post with header
    public postWithHeaders(url: string, data) {
        return this.http.post(`${this.URL}${url}`, JSON.stringify(data), this.headers);
    }

    public postWithoutHeadersWithParameters(url: string, data: any, params) {
        return this.http.post(`${this.URL}${url}`, data, {params});
    }


    //#endregion


    //#region  Put API's

    //Dynamic PUT
    public PutData(url: string, data: any, id?:number){
        if(id){
            return this.http.put(`${this.URL}${url}/${id}`, data) 
        }else{
            return this.http.put(`${this.URL}${url}`, data)
        }
    }


    //#endregion
    
   
    //#region Delete API
    public DeleteWithParam(url: string, params){
        return this.http.delete(`${this.URL}${url}`, {params}) 
    }
    public DeleteWithID(url: string, ID: number){
        return this.http.delete(`${this.URL}${url}/` + ID) 
        
    }


    //#endregion


    public GetMSSLibrary(){
        return this.http.get('dist/DPM/assets/Library/MSS_Library.xlsx', {responseType: 'blob'})
    }

    public GetFailureComponents(){
        return this.http.get('dist/DPM/assets/Library/FailureComponents.xlsx', {responseType: 'blob'})
    }

    public GetFailureCause(){
        return this.http.get('dist/DPM/assets/Library/FailureCause.xlsx', {responseType: 'blob'})
    }
    public GetFailureModeNames(){
        return this.http.get('dist/DPM/assets/Library/FailureModeNames.xlsx', {responseType: 'blob'})
    }

}