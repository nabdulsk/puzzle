import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { ReplaySubject } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import {
  createBook,
  createReadingListItem,
  SharedTestingModule
} from '@tmo/shared/testing';
import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';
import { Book, ReadingListItem } from '@tmo/shared/models';

describe('ToReadEffects', () => {
  let actions: ReplaySubject<any>;
  let effects: ReadingListEffects;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule],
      providers: [
        ReadingListEffects,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.inject(ReadingListEffects);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('loadReadingList$', () => {
    it('should call ngrxOnInitEffects', () => {
      effects.ngrxOnInitEffects();
      expect(effects.ngrxOnInitEffects().type).toEqual('[Reading List] Initialize');
    });

    it('should work', done => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.init());

      effects.loadReadingList$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.loadReadingListSuccess({ list: [] })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list').flush([]);
    });

    it('should dispatch loadReadingListError when api throws an error', done => {
      const error = new ErrorEvent('error');
      actions = new ReplaySubject();
      actions.next(ReadingListActions.init());

      const readingListAction = ReadingListActions.loadReadingListError(error);
      effects.loadReadingList$
      .subscribe(action => {
        expect(action.type).toEqual(readingListAction.type);
        done();
      });

      httpMock.expectOne('/api/reading-list').error(error);
    });
  });

  describe('addBook$', () => {
    it('should add a book to reading list', done => {
      const book: Book = createBook('A');
      actions = new ReplaySubject();
      actions.next(ReadingListActions.addToReadingList({ book: book }));

      effects.addBook$
      .subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.confirmedAddToReadingList({ book })
        );
        done();
      });

      httpMock.expectOne({ url: '/api/reading-list', method: 'post' }).flush([]);
    });

    it('should dispatch failedAddToReadingList when api throws an error', done => {
      const book: Book = createBook('A');
      actions = new ReplaySubject();
      actions.next(ReadingListActions.addToReadingList({ book: book }));

      effects.addBook$
      .subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.failedAddToReadingList({ book })
        );
        done();
      });

      httpMock.expectOne({ url: '/api/reading-list', method: 'post' }).error(null);
    });
  });

  describe('removeBook$', () => {
    it('should remove book from reading list', done => {
      const item: ReadingListItem = createReadingListItem('A');
      actions = new ReplaySubject();
      actions.next(ReadingListActions.removeFromReadingList({ item }));

      effects.removeBook$
      .subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.confirmedRemoveFromReadingList({ item })
        );
        done();
      });

      httpMock.expectOne({
        url: `/api/reading-list/${item.bookId}`,
        method: 'delete'
      }).flush([]);
    });

    it('should dispatch failedRemoveFromReadingList when api throws an error', done => {
      const item: ReadingListItem = createReadingListItem('A');
      actions = new ReplaySubject();
      actions.next(ReadingListActions.removeFromReadingList({ item }));

      effects.removeBook$
      .subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.failedRemoveFromReadingList({ item })
        );
        done();
      });

      httpMock.expectOne({
        url: `/api/reading-list/${item.bookId}`,
        method: 'delete'
      }).error(null);
    });
  });
});
