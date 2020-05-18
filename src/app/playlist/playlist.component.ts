import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { SpotifyService } from '../spotify.service'
import { from } from 'rxjs';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
  tracksArray: any[];
  playlistName: string;
  spotifyService: SpotifyService;
  route: ActivatedRoute;

  constructor(route: ActivatedRoute, spotifyService: SpotifyService) {
    this.spotifyService = spotifyService;
    this.route = route;

  }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params) => {
        from(this.spotifyService.getPlaylist(params.id)).subscribe(
          (res: any) => {
            this.tracksArray = res.tracks.items;
            this.playlistName = res.name;
          }
        );
      }
    );
    console.log(this.tracksArray)
  }

}
