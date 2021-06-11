import { HttpClient } from "@angular/common/http";
import { APP_INITIALIZER } from "@angular/core";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PumpConfigService {
    private config: any;
    constructor(private http: HttpClient) { }

}

export function ConfigFactory(config: PumpConfigService) {
  
}

export function init() {

}

const ConfigModule = {
    init: init
}

export { ConfigModule };