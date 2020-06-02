import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import { faHeart, faArrowLeft, faPlayCircle, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { SpotifyService } from '../spotify.service';
import { PlayerService } from '../player.service';



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
  playerService: PlayerService;
  changeDetector: ChangeDetectorRef;

  currentTrack = {
    name: '',
    artist: '',
    cover: ''
  }
  constructor(spotifyService:SpotifyService, playerService: PlayerService, changeDetector: ChangeDetectorRef) {
    this.spotifyService = spotifyService;
    this.playerService = playerService;
    this.changeDetector = changeDetector;
  }

  ngOnInit(): void {
    this.playerService.currentTrack.subscribe(
      (res: any) =>
       {
         console.log('observed', res);
         this.currentTrack = res;
         this.changeDetector.detectChanges();

      });
  }


}
