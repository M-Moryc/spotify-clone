import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../spotify.service'
import { Observable } from 'rxjs';
import {faPlusCircle, faHeart } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent implements OnInit {
  spotifyService;
  faPlusCircle = faPlusCircle;
  faHeart = faHeart;
  playlistArray: Observable<any>;

  constructor(SpotifyService: SpotifyService) {
    this.spotifyService = SpotifyService;




  }

  async ngOnInit() {
    this.playlistArray = await this.spotifyService.getUserPlaylists();
  }


}
