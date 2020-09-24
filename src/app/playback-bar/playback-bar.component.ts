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
    cover: '',
    progress: 0,
    duration: {min: 0, sec: 0}
  }
  constructor(spotifyService:SpotifyService, changeDetector: ChangeDetectorRef) {
    this.spotifyService = spotifyService;
    this.changeDetector = changeDetector;
  }

  ngOnInit(): void {
      this.spotifyService.getCurrentDeviceId();
      this.spotifyService.getCurrentPlayback().subscribe((res: any) =>{
        console.log('player: ',res);
        Object.assign(this.currentTrack, {
          name: res.item.name,
          artist: res.item.artists[0].name,
          cover: res.item.album.images[0].url,
          progress: res.progress_ms/res.item.duration_ms*100,
          duration: {min: (Math.floor((res.item.duration_ms/1000/60) << 0)),
            sec: (Math.floor((res.item.duration_ms/1000) % 60))}
        })
      })
  }


}
