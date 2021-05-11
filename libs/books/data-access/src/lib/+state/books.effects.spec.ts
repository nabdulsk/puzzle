import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { ReplaySubject } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { createBook, SharedTestingModule } from '@tmo/shared/testing';

import { BooksEffects } from './books.effects';
import * as BooksActions from './books.actions';

describe('BooksEffects', () => {
  let actions: ReplaySubject<any>;
  let effects: BooksEffects;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule],
      providers: [
        BooksEffects,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.inject(BooksEffects);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('loadBooks$', () => {
    it('should work', done => {
      actions = new ReplaySubject();
      actions.next(BooksActions.searchBooks({ term: '' }));

      effects.searchBooks$.subscribe(action => {
        expect(action).toEqual(
          BooksActions.searchBooksSuccess({ books: [createBook('A')] })
        );
        done();
      });

      httpMock.expectOne('/api/books/search?q=').flush([createBook('A')]);
    });

    it('should throw error', done => {
      const error = new ErrorEvent('error');
      actions = new ReplaySubject();
      actions.next(BooksActions.searchBooks({ term: '#' }));

      effects.searchBooks$
      .subscribe(action => {
        expect(action.type).toEqual(
          BooksActions.searchBooksFailure(error).type
        );
        done();
      });

      httpMock.expectOne('/api/books/search?q=#').error(error);
    });
  });
});
