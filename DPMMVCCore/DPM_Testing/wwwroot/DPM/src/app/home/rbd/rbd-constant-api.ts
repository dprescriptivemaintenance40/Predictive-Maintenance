import { Injectable } from "@angular/core";


@Injectable({
    providedIn : 'root'
})

export class RBDConstantApi{
    public post : string = "/RBDAPI";
    public getAllRecords : string = "/RBDAPI/GetAllRBDTree";
    public put : string = "/RBDAPI";
}