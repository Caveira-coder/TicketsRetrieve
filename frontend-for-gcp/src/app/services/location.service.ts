import { Injectable } from '@angular/core';
import { Observable, of, lastValueFrom } from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { catchError, map, tap, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private domain:string = "https://mynodejs-98748.wl.r.appspot.com/";
  // private domain:string = "http://127.0.0.1:3000/";

  constructor(
    private http:HttpClient
  ) { }

  getAutoDetectedInfo():Observable<any>{
    let url = "https://ipinfo.io/?token=69fa278a33807b";
    return this.http.get<any>(url).pipe(
      
      tap((data) => {
        console.log('fetched getAutoDetectedInfo');     
      }),
      
      catchError(err=>{
       console.log("ipinfo failed!");
       
        return of("")
      })

    );
  }


  getLatLongInfo(paramsData: string): Observable<any> {
    console.log('222');
    console.log(paramsData);
    
    let url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + paramsData + "&key=AIzaSyCoEW6w7dAIfi1drXBo2S3jRSSifeL0ZTA";

    console.log(url);
    return this.http.get<any>(url).pipe(
      
      tap((data) => {
        console.log('fetched latlongInfo'); 
      }),
      
      catchError(err=>{
        console.log("getLatLongInfo failed!");
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
