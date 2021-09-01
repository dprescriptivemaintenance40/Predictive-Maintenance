import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { CommonDLService } from "./common.dl.service";

@Injectable({
    providedIn: 'root'
})
export class CommonBLService {

    constructor(private commonDLService: CommonDLService) { }
    //Dynamic Get API with no Parameters
    public getWithoutParameters(url: string) {
        return this.commonDLService.getWithoutParameters(url)
            .pipe(map(res => {
                return res;
            }));
    }

    //Dynamic Get API with Parameters
    public getWithParameters(url: string, params) {
        return this.commonDLService.getWithParameters(url, params)
            .pipe(map(res => {
                return res;
            }));
    }

    //Dynamic Post API with no header
    public postWithoutHeaders(url: string, data: any) {
        return this.commonDLService.postWithoutHeaders(url, data)
            .pipe(map(res => {
                return res;
            }));
    }

    //Dynamic Post API with header
    public postWithHeaders(url: string, data: any) {
        return this.commonDLService.postWithHeaders(url, data)
            .pipe(map(res => {
                return res;
            }));
    }

    public postWithoutHeadersWithParameters(url: string, data: any, params) {
        return this.commonDLService.postWithoutHeadersWithParameters(url, data, params)
            .pipe(map(res => {
                return res;
            }));
    }

    //Dynamic PUT 
    public PutData(url: string, data: any, id?: number) {
        return this.commonDLService.PutData(url, data, id)
            .pipe(map(res => {
                return res;
            }, err => { return err }));
    }

    //Dynamic Delete with Param
    public DeleteWithParam(url: string, params) {
        return this.commonDLService.DeleteWithParam(url, params)
            .pipe(map(res => {
                return res;
            }, err => { return err }));
    }

    //Dynamic Delete without Param
    public DeleteWithID(url: string, id) {
        return this.commonDLService.DeleteWithID(url, id)
            .pipe(map(res => {
                return res;
            }, err => { return err }));
    }



    public GetMSSLibrary() {
        return this.commonDLService.GetMSSLibrary()
            .pipe(map(res => {
                return res;
            }));
    }

    public GetFailureComponents() {
        return this.commonDLService.GetFailureComponents()
            .pipe(map(res => {
                return res;
            }));
    }

    public GetFailureCause() {
        return this.commonDLService.GetFailureCause()
            .pipe(map(res => {
                return res;
            }));
    }

    public GetFailureModeNames() {
        return this.commonDLService.GetFailureModeNames()
            .pipe(map(res => {
                return res;
            }));
    }

}