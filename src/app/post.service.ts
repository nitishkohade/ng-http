import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { Post } from "./post.mode";

@Injectable({
    providedIn: 'root'
})
export class PostService {

    error = new Subject<string>()
    
    constructor(private http: HttpClient) {}

    onCreatePost(postData: Post) {
        this.http.post<{name: string}>(
            'https://angular-demo-bdba8-default-rtdb.firebaseio.com/posts.json', 
            postData,
            {
                // observe: 'body'
                observe: 'response'
            }
            
        )
        .subscribe(
            (res) => {
                console.log(res)
            },
            (error) => {
                this.error.next(error.message)
            }
        )
    }

    onFetchPosts(): Observable<Post[]> {
        // this.http.get('https://angular-demo-bdba8-default-rtdb.firebaseio.com/posts.json')
    // .pipe(
    //   map((res: {[key: string]: Post}) => {
    //     let posts: Post[] = [];
    //     for(let key in res) {
    //       posts.push({...res[key], id: key})
    //     }
    //     return posts
    //   })
    // )
    // .subscribe(
    //   (res: Post[]) => {
    //     console.log(res)
    //   }
    // )
        let searchParams = new HttpParams()
        searchParams = searchParams.append('print', 'pretty')
        return this.http
            .get<{[key: string]: Post}>(
                'https://angular-demo-bdba8-default-rtdb.firebaseio.com/posts.json',
                {
                    headers: new HttpHeaders({
                        "custom-headers": "hello"
                    }),
                    // params: new HttpParams().set('print', 'pretty')
                    params: searchParams
                }
            )
            .pipe(
                map((res) => {
                    let posts: Post[] = [];
                    for(let key in res) {
                    posts.push({...res[key], id: key})
                    }
                    return posts
                }),
                catchError(errorRes => {
                    return throwError(errorRes)
                })
            )
    }

    deletePosts() {
        return this.http.delete(
            'https://angular-demo-bdba8-default-rtdb.firebaseio.com/posts.json',
            {
                observe: 'events',
                responseType: 'json'
                // responseType: 'text'
            }
            
        ).pipe(
            tap(
                event => { 
                   console.log(event) 
                   if(event.type === HttpEventType.Response) {
                       console.log(event.body)
                   }
                   if(event.type === HttpEventType.Sent) {
                        console.log(event.type)
                    }
                }
            )
        )
    }
}