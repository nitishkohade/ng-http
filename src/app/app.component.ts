import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Post } from './post.mode';
import { PostService } from './post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching: boolean = false;
  subscription: Subscription;
  error = null;

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.fetchPosts()
    this.subscription = this.postService.error.subscribe(
      (error) => {
        this.error = error
        this.isFetching = false
      }
    )
  }

  onCreatePost(postData: { title: string; content: string }) {
    this.postService.onCreatePost(postData)
  }

  onFetchPosts() {
    this.fetchPosts()
  }

  onClearPosts() {
    this.postService.deletePosts().subscribe(
      (res) => {
        this.loadedPosts = []
      }
    )
  }

  private fetchPosts() {
    this.isFetching = true;
    this.postService.onFetchPosts()
      .subscribe(
        (res: Post[]) => {
          this.loadedPosts = res
          this.isFetching = false
        },
        (error: HttpErrorResponse) => {
          this.isFetching = false
            this.error = error.message
        }
      )
  }

  onHandleError( ) {
    this.error = null;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
