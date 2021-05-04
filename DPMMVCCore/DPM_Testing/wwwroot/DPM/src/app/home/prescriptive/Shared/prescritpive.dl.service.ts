import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from "src/app/shared/config.service";

@Injectable({
    providedIn: 'root'
})
export class PrescriptiveDLService {
    public options = {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    };
    private URL: string = "";
    constructor(private http: HttpClient,
        private configService: ConfigService) {
        this.URL = this.configService.getApi('URL');
    }
    //#region Get API
    public getPrescriptiveLookupMasterList() {
        return this.http.get(`${this.URL}/PrescriptiveLookupMasterAPI`, this.options);
    }
    //#endregion

    //#region POST API

    //#endregion
}