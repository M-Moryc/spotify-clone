import { Injectable } from '@angular/core';
import spotifyWebApi from 'spotify-web-api-node';
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
    return this.http.get(`api/get_player?accessToken=${this.getCurrentAccessToken()}`);
  }

}


function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

