import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private domain: string = 'https://mynodejs-98748.wl.r.appspot.com/';
  // private domain:string = "http://127.0.0.1:3000/";

  constructor(private http: HttpClient) {}

  suggestEvents(term: any): Observable<Object> {
    const eventsUrl = `${this.domain}suggest/`;
    return this.http.get<Object>(eventsUrl + term).pipe(
      tap((_) => console.log('fetched suggestions')),
      catchError(this.handleError<Object>('suggestEvents', []))
    );
  }
  
  searchEventDetails(id: string): Observable<string> {
    // if(id == "vvG1OZ9pNPuVvv"){
    //   id = "2envawjoi391";
    // }
    
    let url = `${this.domain}details/${id}`;
    console.log(url);
    
    return this.http.get<string>(url).pipe(
      tap((value) => {console.log('fetched details'); console.log(value)}
      ),
      catchError(err=>{
        console.log("searchEventDetails failed!");
         return of("")
       })
    );
  }

  searchArtistDetails(artistName:string): Observable<string>{
    // if(artistName == "KidCutUp" || artistName == "Brandi Carlile" || artistName == "Grouplove"|| artistName == "P!NK") artistName = "klsvmzdcnjviuafj";
    let url = `${this.domain}spotify/${artistName}`;
    console.log(url);
    
    return this.http.get<string>(url).pipe(
      tap((_) => console.log('fetched Artistdetails')),
      catchError(err=>{
        console.log("searchArtistDetails failed!");
        
         return of("")
       })
    );
  }


  getVenueDetails(vName:string): Observable<string>{
    // if(vName == "Comerica Park") vName = "awioejgjknbgiouajfioe";
    let url = `${this.domain}venue/${vName}`;
    console.log(url);
    
    return this.http.get<string>(url).pipe(
      tap((_) => console.log('fetched getVenueDetails')),
      catchError(err=>{
        console.log("getVenueDetails failed!");
        
         return of("")
       })
    );
  }

  searchEvent(paramsData: string): Observable<string> {
    console.log('222');
    let url = `${this.domain}search`;
    paramsData = JSON.parse(paramsData);
    for (var item of Object.values(paramsData)) {
      url += '/' + item;
    }
    console.log(url);

    return this.http.get<string>(url).pipe(
      tap((_) => console.log('fetched events')),
      catchError(err=>{
        console.log("searchEvent failed!");
        
        return of("")
      })
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
