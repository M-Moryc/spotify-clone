import { Component, OnInit } from '@angular/core';
import { faHeart, faArrowLeft, faPlayCircle, faArrowRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-playback-bar',
  templateUrl: './playback-bar.component.html',
  styleUrls: ['./playback-bar.component.css']
})
export class PlaybackBarComponent implements OnInit {
  heart = faHeart;
  arrowLeft = faArrowLeft;
  arrowRight = faArrowRight;
  playCircle = faPlayCircle;
  constructor() { }

  ngOnInit(): void {
  }

}
