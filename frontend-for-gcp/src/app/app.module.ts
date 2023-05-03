import { LocationService } from './services/location.service';
import { EventService } from './services/event.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SearchFormComponent } from './components/search-form/search-form.component';

// Material Modules
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { HttpClientModule } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs'; 
// import {MaterialExampleModule} from '../material.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { GoogleMapsModule } from '@angular/google-maps';
import { FavoritesComponent } from './components/favorites/favorites.component'

@NgModule({
  declarations: [AppComponent, NavbarComponent, SearchFormComponent, FavoritesComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    HttpClientModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    GoogleMapsModule,
    // MaterialExampleModule
  ],
  providers: [EventService, LocationService],
  bootstrap: [AppComponent],
})
export class AppModule {}
