import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import { faHeart, faArrowLeft, faPlayCircle, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { SpotifyService } from '../spotify.service';



@Component({
  selector: 'app-playback-bar',
  templateUrl: './playback-bar.component.html',
  styleUrls: ['./playback-bar.component.css'],
})
export class PlaybackBarComponent implements OnInit {
  heart = faHeart;
  arrowLeft = faArrowLeft;
  arrowRight = faArrowRight;
  playCircle = faPlayCircle;
  spotifyService:SpotifyService;
  changeDetector: ChangeDetectorRef;

  currentTrack = {
    name: '',
    artist: '',
    cover: ''
  }
  constructor(spotifyService:SpotifyService, changeDetector: ChangeDetectorRef) {
    this.spotifyService = spotifyService;
    this.changeDetector = changeDetector;
  }

  ngOnInit(): void {
      this.spotifyService.getCurrentDeviceId();
  }


}
