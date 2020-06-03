import { Injectable } from '@angular/core';
import { get } from 'scriptjs';
import { SpotifyService } from './spotify.service';
import { Subject } from 'rxjs';

declare let Spotify;

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  spotifyService: SpotifyService;
  player;
  deviceId: string;
  currentTrack = new Subject();

  constructor( SpotifyService: SpotifyService) {
    this.spotifyService = SpotifyService;

    get("https://sdk.scdn.co/spotify-player.js", () => {

      (window as any).onSpotifyWebPlaybackSDKReady = () => {
        //const token = [SpotifyService.getCurrentAccessToken()];
        this.player = new Spotify.Player({
          name: 'Web Playback SDK Quick Start Player',
          getOAuthToken: cb => cb(SpotifyService.getCurrentAccessToken())
        });
        this.player._options.id = 'c0047022f18a973a99ece86e757065810ff953f8';
        console.log('player: ' ,this.player);
        // Error handling
      this.player.addListener('initialization_error', ({ message }) => { console.error(message); });
      this.player.addListener('authentication_error', ({ message }) => { console.error(message); });
      this.player.addListener('account_error', ({ message }) => { console.error(message); });
      this.player.addListener('playback_error', ({ message }) => { console.error(message); });

      // Playback status updates
      this.player.addListener('player_state_changed', ({
        position,
        duration,
        track_window: { current_track }
      }) => {
        let currentTrack = {name: current_track.name,
        artist: current_track.artists[0].name,
        cover: current_track.album.images[2].url
        };
        this.currentTrack.next(
          currentTrack
        );
      });

      // Ready
      this.player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
      });

      // Not Ready
      this.player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      // Connect to the player!
      this.player.connect();
    };


    });
    }
    play = ({
      spotify_uri,
      playerInstance: {
        _options: {
          getOAuthToken,
          id
        }
      }
    }) => {
      getOAuthToken(access_token => {
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
          method: 'PUT',
          body: JSON.stringify({ uris: [spotify_uri] }),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
          },
        });
      });
    };

    async playSong(contextUri: string, offset: number){
      fetch("https://api.spotify.com/v1/me/player/play?device="+await this.spotifyService.getCurrentDeviceId(), {
        body: JSON.stringify({'context_uri': contextUri, offset: {position: offset}}),
        headers: {
          Accept: "application/json",
          Authorization: "Bearer "+this.spotifyService.getCurrentAccessToken(),
          "Content-Type": "application/json"
        },
        method: "PUT"
    }).then((res) => console.log(res));
  }

   async skipSong(direction){
    fetch("https://api.spotify.com/v1/me/player/"+direction+"?device_id="+await this.spotifyService.getCurrentDeviceId(), {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer "+this.spotifyService.getCurrentAccessToken(),
        "Content-Type": "application/json"
      },
      method: "POST"
    })
 }

}

