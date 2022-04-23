import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment as env } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { APIResponse, IArticle } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  getAllArticles(
    order: string,
    type: string,
    search?: string
  ): Observable<APIResponse<IArticle>> {
    let params = new HttpParams().set('order', order).set('type', type);

    if (search) {
      params = new HttpParams().set('order', order).set('search', search);
    }

    return this.http.get<APIResponse<IArticle>>(`${env.BASE_URL}/api/v1/article`, {
      params: params,
    });
  }

  getArticle(_id: string): Observable<IArticle> {
    return this.http.get<IArticle>(`${env.BASE_URL}/api/v1/article/${_id}`);
  }

  voteArticle(_id: string, attr: string): Observable<IArticle> {
    let params = new HttpParams().set('attr', attr);
    return this.http.put<IArticle>(`${env.BASE_URL}/api/v1/article/${_id}`, {}, {
      params
    });
  }

  createArticle(article: IArticle): Observable<IArticle> {
    return this.http.post<IArticle>(`${env.BASE_URL}/api/v1/article`, article);
  }
}

