import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

export const flipAnimation = trigger('flipState', [
  state(
    'front',
    style({
      transform: 'rotateY(0)',
    })
  ),
  state(
    'back',
    style({
      transform: 'rotateY(180deg)',
    })
  ),
  transition('front => back', animate('400ms ease-out')),
  transition('back => front', animate('400ms ease-in')),
]);

export const starAnimation = trigger('starAnimation', [
  state('favorited', style({ color: 'gold', transform: 'scale(1.2)' })),
  state('unfavorited', style({ color: 'gray', transform: 'scale(1)' })),
  transition('favorited <=> unfavorited', animate('300ms ease-in-out')),
]);
