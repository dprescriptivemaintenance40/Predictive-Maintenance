import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, finalize, tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { CommonLoadingDirective } from "./shared/Loading/common-loading.directive";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    private totalRequests = 0;
    constructor(private router: Router,
        private commonLoadingDirective: CommonLoadingDirective) {

    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.totalRequests++;
        this.commonLoadingDirective.showLoading(true, 'Loading....');
        var clonedReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }

        });
        return next.handle(clonedReq).pipe(
            catchError(error => {
                if (error.status == 401) {
                    localStorage.removeItem('token');
                    this.router.navigateByUrl('Login');
                }
                throw error;
            }),
            finalize(() => {
                this.totalRequests--;
                if (this.totalRequests === 0) {
                    this.commonLoadingDirective.showLoading(false, '');
                }
            })
        );
    }
}