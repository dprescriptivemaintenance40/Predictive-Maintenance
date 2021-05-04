import { HttpClient } from "@angular/common/http";
import { APP_INITIALIZER } from "@angular/core";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    private config: any;
    constructor(private http: HttpClient) { }
    load() {
        return new Promise((resolve, reject) => {
            this.http.get(`dist/DPM/assets/config/appsettings.json`)
                .subscribe((data) => {
                    this.config = data;
                    resolve(true);
                }, (err: any) => {
                    return Observable.throw(err.error || 'Server error');
                });
        });
    }
    // Gets API route based on the provided key
    getApi(key: string): string {
        return this.config["API_ENDPOINTS"][key];
    }
    // Gets a value of specified property in the configuration file
    get(key: any) {
        return this.config[key];
    }
}

export function ConfigFactory(config: ConfigService) {
    return () => config.load();
}

export function init() {
    return {
        provide: APP_INITIALIZER,
        useFactory: ConfigFactory,
        deps: [ConfigService],
        multi: true
    }
}

const ConfigModule = {
    init: init
}

export { ConfigModule };