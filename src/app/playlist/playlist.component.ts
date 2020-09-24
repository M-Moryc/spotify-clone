import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { SpotifyService } from '../spotify.service'
import { from } from 'rxjs';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
  tracksArray: any[];
  playlistName: string;
  playlistUri: string;
  spotifyService: SpotifyService;
  route: ActivatedRoute;
  faPlay = faPlay;

  constructor(route: ActivatedRoute, spotifyService: SpotifyService) {
    this.spotifyService = spotifyService;
    this.route = route;

  }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params) => {
        from(this.spotifyService.getPlaylist(params.id)).subscribe(
          (res: any) => {
            console.log(res);
            this.tracksArray = res.tracks.items;
            this.playlistName = res.name;
            this.playlistUri = res.uri;
          }
        );
      }
    );
    console.log(this.tracksArray)
  }

}
