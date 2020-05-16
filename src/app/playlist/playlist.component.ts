import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { SpotifyService } from '../spotify.service'

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
  tracksArray;
  spotifyService: SpotifyService;
  route: ActivatedRoute;

  constructor(route: ActivatedRoute, spotifyService: SpotifyService) {
    this.spotifyService = spotifyService;
    this.route = route;

  }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params) => this.tracksArray=this.spotifyService.getPlaylist(params.id)
    );
    console.log(this.tracksArray)
  }

}
