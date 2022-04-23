import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IArticle } from 'src/app/interfaces';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.scss']
})
export class CreateArticleComponent implements OnInit {

  public articleCreationForm!: FormGroup;
  public article!: IArticle;
  private articleSub!: Subscription;
  public message!: {
    status: number,
    message: string
  }
  public submitted = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private httpService: HttpService
  ) { }

  ngOnInit(): void {
    this.articleCreationForm =
      this.fb.group({
        title: ['', Validators.required],
        author: ['', [Validators.required]],
        content: ['', [Validators.required]],
      }
      );
  }

  get articleCreationFormControl() {
    return this.articleCreationForm.controls;
  }

  onSubmit(form: FormGroup) {
    this.submitted = true
    this.httpService
      .createArticle({ ...form.value, up_votes: 0, down_votes: 0 })
      .subscribe((articleResp: IArticle) => {

        if (articleResp._id && this.articleCreationForm.valid) {
          this.message = {
            status: 200,
            message: "Article created with success, you will be redirected to home..."
          }
        }
        if (!articleResp._id && this.articleCreationForm.valid) {
          this.message = {
            status: 400,
            message: "Something went wrong, your article wasn't created with success, you will be redirected to home..."
          }
        }

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 3000);

      });
  }

  ngOnDestroy(): void {
    if (this.articleSub) {
      this.articleSub.unsubscribe();
    }
  }

}
