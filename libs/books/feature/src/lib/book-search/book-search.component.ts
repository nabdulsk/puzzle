import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  ReadingListBook,
  searchBooks,
  getBooksError,
  getBooksLoaded
} from '@tmo/books/data-access';
import { Book } from '@tmo/shared/models';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent {
  loaderConfig = {
    color: 'primary',
    mode: 'indeterminate',
    value: 50
  };

  searchForm: FormGroup = this.fb.group({ term: '' });

  books$: Observable<ReadingListBook[]> = this.store.select(getAllBooks);
  error$: Observable<any> = this.store.select(getBooksError);
  loader$: Observable<boolean> = this.store.select(getBooksLoaded);

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder
  ) {}

  get searchTerm(): string {
    return this.searchForm.value.term;
  }

  formatDate(date: string) {
    if (date) {
      return new Intl.DateTimeFormat('en-US').format(new Date(date));
    }
  }

  addBookToReadingList(book: Book) {
    this.store.dispatch(addToReadingList({ book }));
  }

  searchExample() {
    this.searchForm.controls.term.setValue('javascript');
    this.searchBooks();
  }

  searchBooks() {
    if (this.searchForm.value.term.trim()) {

      this.store.dispatch(searchBooks({ term: encodeURIComponent(this.searchTerm) }));
      return;
    }

    this.store.dispatch(clearSearch());
  }

  checkSearchKey() {
    if (!this.searchForm.value.term) {
      this.store.dispatch(clearSearch());
    }
  }
}
