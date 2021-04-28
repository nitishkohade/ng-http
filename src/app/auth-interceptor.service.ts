import { HttpEventType, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { tap } from "rxjs/operators";

export class AuthInterceptorService implements HttpInterceptor{

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        console.log("request interceptor")
        const modifiedRequest = req.clone({
            headers: req.headers.append('auth', 'xyz')
        })
        return next.handle(modifiedRequest)
    }

}