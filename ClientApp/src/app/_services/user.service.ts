import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { User } from '../_models/User';
import { Observable, throwError, of, observable } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { PaginatedResult, Pagination } from '../_models/pagination';
import { UserParams } from '../_models/UserParams';
import { Message } from '../_models/Message';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  requestOptions() {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      observe: 'response' as 'body'
    };
  }

  getUsers(userParams?: UserParams) {
    // console.log(userParams);
    return this.http
      .get<HttpResponse<any>>(
        this.baseUrl +
          'users' +
          (userParams || userParams != null
            ? '?' +
              (userParams.pageNumber != null
                ? 'pageNumber=' + userParams.pageNumber + '&'
                : '') +
              (userParams.itemsPerPage != null
                ? 'pageSize=' + userParams.itemsPerPage + '&'
                : '') +
              (userParams.gender != null
                ? 'gender=' + userParams.gender + '&'
                : '') +
              (userParams.orderBy != null
                ? 'orderBy=' + userParams.orderBy + '&'
                : '') +
              (userParams.minAge != null
                ? 'minAge=' + userParams.minAge + '&'
                : '') +
              (userParams.maxAge != null
                ? 'maxAge=' + userParams.maxAge + '&'
                : '') +
              (userParams.Likees ? 'likees=' + userParams.Likees : '') +
              (userParams.Likers ? 'likers=' + userParams.Likers : '')
            : ''),
        this.requestOptions()
      )
      .pipe(
        map(response => {
          const paginatedResult = new PaginatedResult<User[]>();
          paginatedResult.pagination = JSON.parse(
            response.headers.get('Pagination')
          ) as Pagination;
          paginatedResult.result = response.body;
          return paginatedResult;
        })
      );
  }

  sendLike(id: number, likeeId: number) {
    return this.http.post(
      this.baseUrl + 'users/' + id + '/like' + '/' + likeeId,
      {}
    );
  }

  getMessages(
    id: number,
    pageSize?: number,
    pageNumber?: number,
    messageContainer?: string
  ) {
    let queryString = '?messageContainer=' + messageContainer;
    if (pageSize != null && pageNumber != null) {
      queryString += '&pageSize=' + pageSize + '&pageNumber=' + pageNumber;
    }
    return this.http
      .get<HttpResponse<any>>(
        this.baseUrl + 'users/' + id + '/messages' + queryString,
        this.requestOptions()
      )
      .pipe(
        map(response => {
          const paginatedResult = new PaginatedResult<Message[]>();
          paginatedResult.pagination = JSON.parse(
            response.headers.get('Pagination')
          ) as Pagination;
          paginatedResult.result = response.body;
          return paginatedResult;
        })
      );
  }

  getMessagesThread(id: number, recipientId: number): Observable<Message[]> {
    return this.http.get(
      this.baseUrl + 'users/' + id + '/messages/thread/' + recipientId
    ) as Observable<Message[]>;
  }

  sendMessage(id: number, message: Message) {
    return this.http.post(this.baseUrl + 'users/' + id + '/messages', message);
  }

  deleteMessage(id: number, userId: number) {
    return this.http.delete(
      this.baseUrl + 'users/' + userId + '/messages/' + id
    );
  }

  markMessageAsRead(id: number, userId: number) {
    return this.http.put(
      this.baseUrl + 'users/' + userId + '/messages/' + id,
      {}
    );
  }

  getUser(id: number): Observable<User> {
    return this.http.get(this.baseUrl + 'users/' + id) as Observable<User>;
  }

  updateUser(id: number, user: User) {
    return this.http.put(this.baseUrl + 'users/' + id, user);
  }

  setMainPhoto(userId: number, id: number) {
    return this.http.post(
      this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain',
      {}
    );
  }

  deletePhoto(userId: number, id: number) {
    return this.http.delete(
      this.baseUrl + 'users/' + userId + '/photos/' + id,
      {}
    );
  }
}
