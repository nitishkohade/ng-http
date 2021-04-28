import { HttpEventType, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { tap } from "rxjs/operators";

export class LoggingInterceptorService implements HttpInterceptor{

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        console.log("outgoing request")
        return next.handle(req).pipe(tap(
            (events) => {
                if (events.type == HttpEventType.Response ) {
                    console.log("response arrived")
                    console.log(events.body)
                }
            }
        ))
    }

}