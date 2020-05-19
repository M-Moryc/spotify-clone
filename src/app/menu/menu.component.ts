import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  ShowLinks = false;
  constructor() { }

  ngOnInit(): void {
  }
  showLinks () {
    this.ShowLinks = !this.ShowLinks;
  }

}
