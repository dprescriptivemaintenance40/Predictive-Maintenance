import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router) {

    }
    

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
       
        if (localStorage.getItem('token') != null) {
           var clonedReq = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${localStorage.getItem('token')}` ,
                }
            });
            return next.handle(clonedReq).pipe(
                tap(
                    succ => { },
                    err => {
                        if (err.status == 401){
                            localStorage.removeItem('token');
                            this.router.navigateByUrl('Login');
                        }
                    }
                )
            )
        }
        else
            return next.handle(req.clone());
    }

    // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //     const token = localStorage.getItem('token')
    
    //     if (token) {
    //         request = request.clone({
    //         setHeaders: {
    //           Authorization: 'Bearer ' +  token
    //         }
    //       });
    //     }
    
    //     return next.handle(request);
    //   }


}