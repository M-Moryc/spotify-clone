import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { PlaylistsComponent } from './playlists/playlists.component';
import { MainWindowComponent } from './main-window/main-window.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PlaybackBarComponent } from './playback-bar/playback-bar.component';


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    PlaylistsComponent,
    MainWindowComponent,
    HomeComponent,
    LoginComponent,
    PlaylistComponent,
    PlaybackBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
