import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

import { Store } from '@ngrx/store';

import {
  getReadingList,
  removeFromReadingList,
  addToReadingList
} from '@tmo/books/data-access';
import { Book, ReadingListItem } from '@tmo/shared/models';

@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReadingListComponent {
  readingList$: Observable<ReadingListItem[]> = this.store.select(getReadingList);

  constructor(
    private readonly store: Store,
    private readonly snackBar: MatSnackBar
  ) { }

  removeFromReadingList(item: ReadingListItem) {
    this.store.dispatch(removeFromReadingList({ item }));

    const snackBarUndoRemove = this.snackBar.open(
      `${item.title} - is removed from your reading list`,
      'Undo',
      { duration: 10000 }
    );

    snackBarUndoRemove.onAction().pipe(take(1)).subscribe(() => {
      const book: Book = {
        ...item,
        id: item.bookId
      };

      this.store.dispatch(addToReadingList({ book }));
      this.snackBar.dismiss();
    });
  }
}
