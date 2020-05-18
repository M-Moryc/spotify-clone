import { Injectable } from '@angular/core';
import spotifyWebApi from 'spotify-web-api-node';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http'




@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  http: HttpClient;

  spotifyApi: spotifyWebApi;
  constructor(http: HttpClient) {
      this.spotifyApi =  new spotifyWebApi();
      this.http = http;

    }

   setAccessToken(accessToken = JSON.parse(localStorage.getItem('accessToken')), isNew = false){
     if(isNew){
       localStorage.setItem('accessExpiration',JSON.stringify(new Date((new Date()).getTime() + 3600000)));
       localStorage.setItem('accessToken', JSON.stringify(accessToken));
     }
      this.spotifyApi.setAccessToken(accessToken);
      console.log(accessToken);
   }

  getUserPlaylists(){
    return from(this.spotifyApi.getUserPlaylists( {limit: '50'}))
      .pipe(map((res: any) => res.body.items));
  }

  getPlaylist(playlistid: string){
    return this.spotifyApi.getPlaylist( playlistid).then(
    (res: any) => {console.log(res.body); return res.body});

  }

  async refreshToken(ms: number, instantRefresh = false){
      if(!instantRefresh){
        await delay(ms);
      }
      const refreshToken = JSON.parse(localStorage.getItem('refreshToken'));
      this.http.get('api?refreshToken='+ refreshToken).subscribe(
        (res: any) =>{
          this.setAccessToken(res.token, true);
        }
      );
      //autorefresh every 59mins
    this.refreshToken(3540000);
  }




}


function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

