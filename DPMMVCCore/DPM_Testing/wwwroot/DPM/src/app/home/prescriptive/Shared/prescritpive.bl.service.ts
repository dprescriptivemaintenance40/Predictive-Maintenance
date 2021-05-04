import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { PrescriptiveDLService } from "./prescritpive.dl.service";

@Injectable({
    providedIn: 'root'
})
export class PrescriptiveBLService {

    constructor(private prescriptiveDLService: PrescriptiveDLService) {

    }

    public getPrescriptiveLookupMasterList() {
        return this.prescriptiveDLService.getPrescriptiveLookupMasterList()
            .pipe(map(res => {
                return res;
            }));
    }
}