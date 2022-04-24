import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { APIResponse, IArticle } from 'src/app/interfaces';
import { HttpService } from 'src/app/services/http.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  public isMenuCollapsed = true;
  public searchArticleForm!: FormGroup;
  private articleSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.searchArticleForm =
    this.fb.group({
      search: [''],
    }
    );
  }

  onSubmit(form: FormGroup) {
    this.articleSub = this.httpService
      .getAllArticles("up_votes", "1", form.value.search)
      .subscribe((articlesList: APIResponse<IArticle>) => {
        this.messageService.sendMessage(articlesList)
      });
  }

  ngOnDestroy(): void {
    if (this.articleSub) {
      this.articleSub.unsubscribe();
    }
  }

}
