import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { getTotalUnread } from '@tmo/books/data-access';

@Component({
  selector: 'tmo-total-count',
  templateUrl: './total-count.component.html'
})
export class TotalCountComponent {
  totalUnread$: Observable<number> = this.store.select(getTotalUnread);

  constructor(private readonly store: Store) { }
}
