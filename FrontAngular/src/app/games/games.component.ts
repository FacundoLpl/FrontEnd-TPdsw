import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [GamesComponent],
  template: `
    <ul>
      @for (game of games; track game.id) {
        <li (click)="fav(game.title)">{{game.title}} ({{game.year}})</li>
      }
    </ul>
  `,
  styles: ``
})
export class GamesComponent {
  @Input() username = '';
  @Output() addFavoriteEvent = new EventEmitter<string>();

  fav(gameTitle: string ) {
    this.addFavoriteEvent.emit(gameTitle);
  }

  games = [{
    id: 1,
    title: 'Super Mario 64',
    year: 1996
  }, {
    id: 2,
    title: 'The Legend of Zelda: Ocarina of Time',
    year: 1998
  }, {
    id: 3,
    title: 'Final Fantasy VII',
    year: 1997
  }]
  

}
