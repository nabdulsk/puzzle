import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Observable, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  takeUntil
} from 'rxjs/operators';

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
export class BookSearchComponent implements OnInit, OnDestroy {
  loaderConfig = {
    color: 'primary',
    mode: 'indeterminate',
    value: 50
  };

  searchForm: FormGroup = this.fb.group({ term: '' });

  books$: Observable<ReadingListBook[]> = this.store.select(getAllBooks);
  error$: Observable<any> = this.store.select(getBooksError);
  loader$: Observable<boolean> = this.store.select(getBooksLoaded);
  searchKey$: Observable<{ term: string }> = this.searchForm.valueChanges.pipe(
    filter(key => key.term.trim()),
    debounceTime(500),
    distinctUntilChanged()
  );

  unSubscribe$ = new Subject();

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder
  ) { }

  ngOnInit() {
    this.searchKey$
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe(searchKey => { this.searchBooks(searchKey.term) });
  }

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
    this.searchBooks(null);
  }

  searchBooks(term: string | void) {
    const searchTerm = term ? term : this.searchTerm.trim();

    if (searchTerm) {
      this.store.dispatch(searchBooks({ term: encodeURIComponent(searchTerm) }));
      return;
    }

    this.store.dispatch(clearSearch());
  }

  checkSearchKey() {
    if (!this.searchForm.value.term) {
      this.store.dispatch(clearSearch());
    }
  }

  ngOnDestroy() {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }
}
