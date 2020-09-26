import { Injectable } from '@angular/core';
import spotifyWebApi from 'spotify-web-api-node';
import { HttpClient } from '@angular/common/http';
import openSocket from 'socket.io-client';
import { Subject, BehaviorSubject } from 'rxjs';
import {CurrentTrack} from './types';





@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  http: HttpClient;

  spotifyApi: spotifyWebApi;
  io = openSocket('ws://localhost:8080');
  currentTrack = new Subject<CurrentTrack>();
  trackProgress =  new BehaviorSubject<number>(0);
  constructor(http: HttpClient) {
      this.spotifyApi =  new spotifyWebApi();
      this.http = http;
      setInterval(()=>{
        this.trackProgress.next(this.trackProgress.getValue() + 1000);
      }, 1000);

    }

   setAccessToken(accessToken = JSON.parse(localStorage.getItem('accessToken')), isNew = false){
     if(isNew){
       localStorage.setItem('accessExpiration',JSON.stringify(new Date((new Date()).getTime() + 3600000)));
       localStorage.setItem('accessToken', JSON.stringify(accessToken));
     }
      this.spotifyApi.setAccessToken(accessToken);
      console.log(this.spotifyApi);
   }

  getUserPlaylists(){
    console.log('getting playlists');
      return this.http.get('api/get_user_playlists?accessToken='+this.getCurrentAccessToken());
  }

  getPlaylist(playlistid: string){
    return this.http.get(`api/get_playlist?accessToken=${this.getCurrentAccessToken()}&playlistId=${playlistid}`);

  }

  async refreshToken(ms: number, instantRefresh = false){
      if(!instantRefresh){
        await delay(ms);
      }
      const refreshToken = JSON.parse(localStorage.getItem('refreshToken'));
      this.http.get('api/refresh_token?refreshToken='+ refreshToken).subscribe(
        (res: any) =>{
          this.setAccessToken(res.token, true);
        }
      );
      //autorefresh every 59mins
    this.refreshToken(3540000);
  }

  getCurrentAccessToken(){
    return this.spotifyApi._credentials.accessToken;
  }


  getCurrentDeviceId(){
    return this.spotifyApi.getMyCurrentPlaybackState({
    })
    .then(function(data) {
      console.log(data.body.device.id);
      return data.body.device.id;
    }, function(err) {
      console.log('Something went wrong!', err);
    });
  }

  getCurrentPlayback(){
      this.http.get(`api/get_player?accessToken=${this.getCurrentAccessToken()}`).subscribe((res: any) =>{
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
      }); //load current track for the first time
    return this.currentTrack;
  }

  connectToWebsocket(){
    this.io.emit('initiate', { accessToken: this.getCurrentAccessToken() });
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
    })
  }


}


function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

