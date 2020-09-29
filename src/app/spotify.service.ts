import { Injectable } from '@angular/core';
import spotifyWebApi from 'spotify-web-api-node';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import openSocket from 'socket.io-client';
import { Subject, BehaviorSubject } from 'rxjs';
import {CurrentTrack} from './types';





@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  http: HttpClient;

  spotifyApi
  router: Router;
  tokenIsFresh: boolean | Promise<boolean>;
  io = openSocket('ws://localhost:8080');
  currentTrack = new Subject<CurrentTrack>();
  trackProgress =  new BehaviorSubject<number>(0);
  isPlaying = new BehaviorSubject<boolean>(false);
  constructor(http: HttpClient, router: Router) {
      this.spotifyApi =  new spotifyWebApi();
      this.http = http;
      this.router = router;
      this.tokenIsFresh = new Promise(async (resolve) =>{
        const expirationDate: Date | null = new Date(JSON.parse(localStorage.getItem('accessExpiration')));
        if(expirationDate != null && expirationDate.getTime() > new Date().getTime()){
          this.setAccessToken();
          this.refreshToken(expirationDate.getTime() - new Date().getTime());
          resolve(true);
        }
        else if(JSON.parse(localStorage.getItem('accessToken'))){
          resolve(await this.refreshToken(0));
        }
        else{
          this.router.navigate(['/login']);
          resolve(true);
        }});
      setInterval(() => {
        if(!this.isPlaying.getValue())
          return;
        this.trackProgress.next(this.trackProgress.getValue() + 1000);
      }, 1000);

    }

   setAccessToken(accessToken = JSON.parse(localStorage.getItem('accessToken')), isNew = false){ //if token is fresh it will be saved to localstorage with an expiracy date
     if(isNew){
       localStorage.setItem('accessExpiration',JSON.stringify(new Date((new Date()).getTime() + 3600000)));
       localStorage.setItem('accessToken', JSON.stringify(accessToken));
     }
      this.spotifyApi.setAccessToken(accessToken);
      console.log(this.spotifyApi);
   }

  async getUserPlaylists(){
    console.log('getting playlists');
      return this.http.get('api/get_user_playlists?accessToken='+await this.getCurrentAccessToken());
  }

  async getPlaylist(playlistid: string){
    return this.http.get(`api/get_playlist?accessToken=${await this.getCurrentAccessToken()}&playlistId=${playlistid}`);

  }

  async refreshToken(ms: number){
    await delay(ms);
    const refreshToken = JSON.parse(localStorage.getItem('refreshToken'));
    console.log('refreshing token');
    const { token } = await this.http.get<any>('api/refresh_token?refreshToken='+ refreshToken).toPromise();
    console.log(token);
    this.setAccessToken(token, true);
    this.refreshToken(3540000);
    return true;
  }

  async getCurrentAccessToken(){
    console.log(this.tokenIsFresh);
    if(await this.tokenIsFresh)
      return this.spotifyApi._credentials.accessToken;
  }


  async getCurrentPlayback(){
      this.http.get(`api/get_player?accessToken=${await this.getCurrentAccessToken()}`).subscribe((res: any) =>{
        console.log(res);
        this.currentTrack.next({
          name: res.item.name,
            artist: res.item.artists[0].name,
            cover: res.item.album.images[0].url,
            duration: {min: (Math.floor((res.item.duration_ms/1000/60) << 0)),
              sec: (Math.floor((res.item.duration_ms/1000) % 60)),
            ms: res.item.duration_ms}
        })
        this.trackProgress.next(res.progress_ms);
        console.log(res.progress_ms);
        this.isPlaying.next(res.is_playing);
      }); //load current track for the first time
    return this.currentTrack;
  }

  async connectToWebsocket(){
    this.io.emit('initiate', { accessToken: await this.getCurrentAccessToken() });
    this.io.on('track_change', track => {
      console.log(track);
      this.currentTrack.next({
        name: track.name,
          artist: track.artists[0].name,
          cover: track.album.images[0].url,
          duration: {min: (Math.floor((track.duration_ms/1000/60) << 0)),
            sec: (Math.floor((track.duration_ms/1000) % 60)),
            ms: track.duration_ms
          }
      });
      this.trackProgress.next(0);
    });
    this.io.on('seek', progress => {
      this.trackProgress.next(progress);
    });
    this.io.on('playback_started', () =>{
      this.isPlaying.next(true);
    });
    this.io.on('playback_paused', () =>{
      this.isPlaying.next(false);
    });
  }


}


function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

