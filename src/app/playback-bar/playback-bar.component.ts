import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import { faHeart, faArrowLeft, faPlayCircle, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { SpotifyService } from '../spotify.service';
import {CurrentTrack} from '../types';
import { HttpClient } from '@angular/common/http';





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
  http: HttpClient;

  currentTrack: CurrentTrack = {
    name: '',
    artist: '',
    cover: '',
    duration: {min: 0, sec: 0, ms: 0}
  };
  progress = '0%';
  progressString = '0:00';
  constructor(spotifyService:SpotifyService, changeDetector: ChangeDetectorRef, http: HttpClient) {
    this.spotifyService = spotifyService;
    this.changeDetector = changeDetector;
    this.http = http;
  }

  ngOnInit(): void {
      this.spotifyService.connectToWebsocket();
      this.spotifyService.getCurrentPlayback().subscribe((res: any) =>{
          Object.assign(this.currentTrack, res);
      });// subscribe to track changes
      this.spotifyService.trackProgress.subscribe((res) =>{
        this.progress = Math.floor(res/this.currentTrack.duration.ms *100) + '%'; // current track percentage
        this.progressString = `${(Math.floor((res/1000/60) << 0))}:${(Math.floor((res/1000) % 60))}` // minutes:seconds

      })
  }


}
