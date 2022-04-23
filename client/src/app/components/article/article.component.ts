import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { IArticle } from 'src/app/interfaces';
import { HttpService } from 'src/app/services/http.service';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

  public articleId!: string;
  public article!: IArticle;
  private routeSub!: Subscription;
  private articleSub!: Subscription;
  private voteSub!: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private httpService: HttpService
  ) { }

  ngOnInit(): void {
    this.routeSub = this.activatedRoute.params.subscribe((params: Params) => {
      this.articleId = params['id'];
      this.getArticleDetails(this.articleId);
    });
  }

  getArticleDetails(id: string): void {
    this.articleSub = this.httpService
      .getArticle(id)
      .subscribe((articleResp: IArticle) => {
        this.article = articleResp;
      });
  }

  voteArticle(_id: string, attr: string) {
    this.voteSub = this.httpService
      .voteArticle(_id, attr)
      .subscribe((articleResp: IArticle) => {
        console.log(articleResp)
        this.getArticleDetails(_id)
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
