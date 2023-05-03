import { LocationService } from './../../services/location.service';
import { EventService } from './../../services/event.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';

import axios from 'axios';

import {
  debounceTime,
  catchError,
  tap,
  switchMap,
  finalize,
  distinctUntilChanged,
  filter,
} from 'rxjs/operators';
import { GoogleMap } from '@angular/google-maps';
import { MatTabGroup } from '@angular/material/tabs';
declare let $: any;
@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css'],
})
export class SearchFormComponent {


  searchForm = this.fb.group({
    keyword: ['', Validators.required],
    distance: [10],
    category: ['Default', Validators.required],
    location: ['', Validators.required],
  });
    

  isSubmitted = false;
  resultsDisplay = false;
  detailsDisplay = false;
  musicRelated = false;
  facebookLink = "";
  twitterLink = "";
  filteredMovies: any;
  isLoading = false;
  errorMsg!: string;
  minLengthTerm = 1;
  selectedEvent: any = '';
  ArtistsDetail:any = [];
  currentEvent:any;
  noArtistData:any = true;
  // selectedMovie: any = "";
  lat = 0;
  lng = 0;
  index = 0;
  eventsData:any;
  checkedEvent:any;
  venueData:any;
  isFav:any = false;
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
  indexKey:string = "dklsajfkljweaklfjsdnafklad";

  mapOptions = {
    center: { lat: 38.9987208, lng: -77.2538699 },
    zoom : 14
 }
 marker = {
    position: { lat: 38.9987208, lng: -77.2538699 },
 }
  events$!: Observable<Object>;
  @ViewChild('locationInput') locationInput: any;
  @ViewChild(GoogleMap) map!: GoogleMap;

  constructor(
    private eventService: EventService,
    private fb: FormBuilder,
    private locationService: LocationService
  ) {}

  isExisted(data:any) {
    if (data != undefined && data != "" && data.toLowerCase() != "undefined") {
      return true;
    } else {
      return false;
    }
  }

  ngAfterViewInit(){
  }

  goBack():void {
    this.detailsDisplay = false;
  }

  

  showSpotifyDetails():void{
    this.ArtistsDetail = [];
    let tmp:Array<string> = this.checkedEvent.team.split("|");
    this.noArtistData = true;
    for(var i=0; i<tmp.length; i++){
      
      this.eventService.searchArtistDetails(tmp[i].trim()).subscribe((data) => {
        // data is a object
        let dataValue : any = data;
        if(dataValue != "" && dataValue.message == true){
          this.noArtistData = false;
          let tmp:any = data;
          
          this.ArtistsDetail.push(tmp);
        }
      });
    }
    // let tmp1:any = {name: "",
    // followers: "",
    // spotify_link : "",
    // popularity : "100",
    // img : "",
    // albums : [],
    // message : false,
    // albumMsg : false};
    // this.ArtistsDetail.push(tmp1);
    
  }

  makeFav():void{
    let indexValue:any;
    try {
      let tmpValue = localStorage.getItem(this.indexKey);
      if(tmpValue != null){
        indexValue = JSON.parse(tmpValue);
      } 
      else{
        console.log("index array is null");
      }
    } catch (error) {
      console.log("no this index array");
    }

    try {
      let value = localStorage.getItem(this.currentEvent.id);
      if(value != null){
        alert("Event Removed from Favorites!");
        localStorage.removeItem(this.currentEvent.id);
        const index = indexValue.indexOf(this.currentEvent.id);
        if (index !== -1) {
          indexValue.splice(index, 1);
          localStorage.setItem(this.indexKey, JSON.stringify(indexValue));
        }else{
          console.log("cannot find id in this array!");
        }
        this.isFav = false;
      }
      else{
        alert("Event Added to Favorites!");
        this.isFav = true;
        const obj = {
          id: this.currentEvent.id,
          timestramp: Date.now(),
          event: this.checkedEvent.name,
          date: this.checkedEvent.date.split(" ")[0],
          category: this.checkedEvent.genres,
          venue: this.checkedEvent.venue
        };
        localStorage.setItem(String(this.currentEvent.id), JSON.stringify(obj));
        indexValue.push(String(this.currentEvent.id));

        
        localStorage.setItem(this.indexKey, JSON.stringify(indexValue));
      }        
    }
    catch (error) {
      alert("makeFav error!");
    }
  }

  showVenueDetails():void{
    

    this.lat = 0;
    this.lng = 0;
    this.marker.position.lat = 0;
    this.marker.position.lng = 0;
    
    this.mapOptions.center.lat = 0;
    this.mapOptions.center.lng = 0;
    this.venueData = "";
    if(this.checkedEvent.venue != ""){
      this.eventService.getVenueDetails(this.checkedEvent.venue).subscribe((data) => {
        // data is a object
        
        if(data == "" || data == null){
          alert("Cannot show venue! Maybe too many request! Please retry!");
          this.venueData = data;
        }else{
          this.venueData = data;
          this.lat = Number(this.venueData.lat);
          this.lng = Number(this.venueData.lng);
          
          this.marker.position.lat = this.lat;
          this.marker.position.lng = this.lng;
          
          this.mapOptions.center.lat = this.lat;
          this.mapOptions.center.lng = this.lng;

        }
      }); 
    }
    
  }

  clearAll(): void{
    if ($("#gridCheck").is(":checked")) {
      this.toggleInput();
      $("#gridCheck").prop("checked",false);
      
    }
    this.searchForm.patchValue({
      keyword: '',
      distance: 10,
      category: 'Default',
      location: ''
    });
    this.noArtistData = true;
    this.isSubmitted = false;
    this.venueData = "";
    this.eventsData = "";
    this.resultsDisplay = false;
    this.detailsDisplay = false;
    this. musicRelated = false;
    this.facebookLink = "";
    this.twitterLink = "";
    this.isLoading = false;
    this.selectedEvent = '';
    this.ArtistsDetail= [];
    this.currentEvent = "";
    this.filteredMovies = [];
    // selectedMovie: any = "";
    this.lat = 0;
    this.lng = 0;
    this.index = 0;
    this.checkedEvent = "";
    console.log("clear done!");
    
  }

  showDetails(id:Object): void {
    this.currentEvent = {};
    this.currentEvent = id;
    try {
      let value = localStorage.getItem(this.currentEvent.id);
      if(value != null){
        this.isFav = true;
      }else{
        this.isFav = false;
      }      
    } catch (error) {
      this.isFav = false;
      
    }
    console.log(this.isFav);
    

    this.tabGroup.selectedIndex = 0;

    this.checkedEvent = "";
    this.musicRelated = false;
    this.currentEvent.id = this.currentEvent.id;
    this.eventService.searchEventDetails(this.currentEvent.id).subscribe((data) => {
      // data is a object

      if(data == ""){
        alert("event details request failed!");
        this.checkedEvent = data;
        this.detailsDisplay = false;
      }else{
        
        this.detailsDisplay = true;
        this.checkedEvent = data;
        // facebook and twitter link
        try {
          let _link = this.checkedEvent.buyTicketAt;
          if(_link != undefined && _link != null && _link != ""){
            
            this.facebookLink = "https://www.facebook.com/dialog/feed?app_id=721176329752695&display=popup&link=" + _link;
            $("#facebook_link").attr("href", this.facebookLink);
            this.twitterLink = "https://twitter.com/intent/tweet?text=" + this.checkedEvent.name + " on Ticketmaster."+ "&url=" + _link;
            $("#twitter_link").attr("href", this.twitterLink);
          }else{
            this.facebookLink = "";
            $("#facebook_link").removeAttr("href");
            this.twitterLink = "";
            $("#twitter_link").removeAttr("href");
          }
        } catch (error) {
          
        }
        // spotifydetails
        console.log(this.checkedEvent.isMusicRelated);
        try {
          this.musicRelated = this.checkedEvent.isMusicRelated;
          if(this.checkedEvent.isMusicRelated == true){
            // this.musicRelated = true;
            try {
              this.showSpotifyDetails();
            } catch (error) {
              console.log("showSpotifyDetails failed");
              
            }
          }
          else{
            this.musicRelated = false;
          }
          console.log(this.musicRelated);
        } catch (error) {
          this.musicRelated = false;
        }
        // venuedetails
        
        setTimeout(() => {
          try {

            this.showVenueDetails();
          } catch (error) {
            console.log("showVenueDetails failed");
            
          }
        }, 500);
        
        
      }
    });

    
    
  }

  eventDetaisSearch():void{

  }

  searchEvent(): void {
    if (this.searchForm.valid) {
      let jLocation = $(this.locationInput.nativeElement);
      if (jLocation.prop('disabled')) {
        // this.getDetectedInfo();
        this.getDetectedInfo();
      } else {
        this.getLocationInfo(this.searchForm.controls['location'].value);
      }
      
    }else{
      console.log("failed");
      
    }
  }

  submitData() {
    let keywordValue:any;
    let tmp:any = this.searchForm.controls['keyword'].value;
    
    if(typeof(tmp) != "string"){
      keywordValue = tmp.name;
    }else{
      keywordValue = tmp;
    }

    
    
    let paramsData = {
      keyword: keywordValue,

      distance: this.searchForm.get('distance')?.value,
      category: this.searchForm.get('category')?.value,
      lat: this.lat,
      lng: this.lng,
    };
    this.eventsData = "";
    this.eventService
      .searchEvent(JSON.stringify(paramsData))
      .subscribe((data) => {
        // data is a object
        if(data == ""){
          alert("searchevent failed!");
          let newData = {
            data : [],
            message : false
          }
        }else{
          this.eventsData = data;
        }

        this.isSubmitted = true;
        this.resultsDisplay = true;
        this.detailsDisplay = false;
      });
  }


  getDetectedInfo(): void {

    this.eventsData = "";
    this.lat = 0;
    this.lng = 0;
    this.locationService.getAutoDetectedInfo().subscribe((data) => {


      if(data == ""){
        alert("ipinfo connect wrong!");
        let newData = {
          data : [],
          message : false
        }
        this.eventsData = newData;
        this.isSubmitted = true;
        this.resultsDisplay = true;
        this.detailsDisplay = false;
      }else{
        try {
          this.lat = data.loc.split(',')[0];
          this.lng = data.loc.split(',')[1];
          console.log(this.lat);
          console.log(this.lng);
          this.submitData();
        } catch (error) {
          alert("no lat or lng value--ipinfo")
          console.log('lat.....lng....');
          let newData = {
            data : [],
            message : false
          }
          this.eventsData = newData;
          this.isSubmitted = true;
          this.resultsDisplay = true;
          this.detailsDisplay = false;
        }
        
      }
    });
  }

  getLocationInfo(location: any): void {
    this.eventsData = "";
    this.lat = 0;
    this.lng = 0;
    this.locationService.getLatLongInfo(location).subscribe((data) => {

      console.log('bbbbbbbbb');
      console.log(data);
      if(data == "" || data.status == "ZERO_RESULTS"){
        let newData = {
          data : [],
          message : false
        }
        this.eventsData = newData;
        this.isSubmitted = true;
        this.resultsDisplay = true;
        this.detailsDisplay = false;
      }else{
        try {
          this.lat = data.results[0].geometry.location.lat;
          this.lng = data.results[0].geometry.location.lng;
          this.submitData();
        } catch (error) {
          let newData = {
            data : [],
            message : false
          }
          this.eventsData = newData;
          this.isSubmitted = true;
          this.resultsDisplay = true;
          this.detailsDisplay = false;
          alert("no lat or lng value--geometry");
          console.log("no lat or lng value");
        }
        
      }
      
    });
  }

  onSelected() {

    this.selectedEvent = this.searchForm.controls['keyword'].value;

  }

  displayWith(value: any) {
    return value?.name;
  }

  clearSelection() {
    this.filteredMovies = [];
  }

  ngOnInit() {

    try {
      let value = localStorage.getItem(this.indexKey);
      if(value == null){
        let items:[] = [];
        localStorage.setItem(this.indexKey, JSON.stringify(items));
      }
    } catch (error) {
      console.log("cannot find index");
    }
    
    this.searchForm.controls['keyword'].valueChanges
      .pipe(
        filter((res) => {
          
          // when keyword valuechanges, the res is the value of the keyword
          return (
            res !== undefined &&
            res !== null &&
            res.length >= this.minLengthTerm
          );
        }),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => {
          this.errorMsg = '';
          this.filteredMovies = [];
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.eventService.suggestEvents(value).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((data: any) => {


        let attractions = '';
        try {
          attractions = data._embedded.attractions;
          if (attractions != undefined) {
            this.errorMsg = '';
            this.filteredMovies = attractions;
          } else {
            this.errorMsg = 'no matched event';
            this.filteredMovies = [];
          }
        } catch (error) {
          this.errorMsg = 'no matched event';
          this.filteredMovies = [];
        }
      });
  }

  toggleInput(): void {
    let jLocation = $(this.locationInput.nativeElement);
    if (jLocation.prop('required')) {
      this.searchForm.controls['location'].clearValidators();
      this.searchForm.controls['location'].updateValueAndValidity();
    } else {
      this.searchForm.controls['location'].setValidators([Validators.required]);
      this.searchForm.controls['location'].updateValueAndValidity();
    }
    jLocation.prop('disabled', !jLocation.prop('disabled'));
    jLocation.prop('required', !jLocation.prop('required'));

    this.searchForm.patchValue({
      location: '',
    });
  }
}
