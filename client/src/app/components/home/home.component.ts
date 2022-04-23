import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APIResponse, IArticle } from 'src/app/interfaces';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  public order!: string;
  public articles!: Array<IArticle>;
  private routeSub!: Subscription;
  private articleSub!: Subscription;
  private voteSub!: Subscription;


  constructor(
    private httpService: HttpService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.routeSub = this.activatedRoute.params.subscribe((params: Params) => {
      if (params['search']) {
        this.getArticles('up_votes-1', params['search']);
      } else {
        this.getArticles('up_votes-1');
      }
    });
  }

  getArticles(order: string, search?: string): void {
    let orderValue: string = "up_votes";
    let orderType: string = "1";

    switch (order) {
      case "up_votes-1":
        orderValue = "up_votes";
        orderType = "1";
        break;
      case "up_votes-0":
        orderValue = "up_votes";
        orderType = "0";
        break;
      case "down_votes-1":
        orderValue = "down_votes";
        orderType = "1";
        break;
      case "down_votes-0":
        orderValue = "down_votes";
        orderType = "0";
        break;

      default:
        break;
    }

    this.articleSub = this.httpService
      .getAllArticles(orderValue, orderType, search)
      .subscribe((articlesList: APIResponse<IArticle>) => {
        this.articles = articlesList;
      });
  }

  voteArticle(_id: string, attr: string) {
    this.voteSub = this.httpService
      .voteArticle(_id, attr)
      .subscribe((articleResp: IArticle) => {
        console.log(articleResp)
        // TODO : this is a temp. fix, we can integrate state management to remove the refresh
        this.getArticles(`${attr}-1`)
      });
  }

  ngOnDestroy(): void {
    if (this.articleSub) {
      this.articleSub.unsubscribe();
    }

    if (this.voteSub) {
      this.voteSub.unsubscribe();
    }

    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
