import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn:'root'
})
export class CommonLoadingDirective {

    public subject = new Subject<any>();
    showLoading(loading: boolean, message: string) {
        this.subject.next({
            loading: loading,
            message: message
        })
    }

    getLoading(): Observable<any> {
        return this.subject.asObservable();
    }
}