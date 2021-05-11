import {
  createEntityAdapter,
  EntityAdapter,
  EntityState
} from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import { Book } from '@tmo/shared/models';
import * as BooksActions from './books.actions';

export const BOOKS_FEATURE_KEY = 'books';

export interface State extends EntityState<Book> {
  loaded: boolean;
  error?: any | null;
  searchTerm?: string;
}

export interface BooksPartialState {
  readonly [BOOKS_FEATURE_KEY]: State;
}

export const booksAdapter: EntityAdapter<Book> = createEntityAdapter<Book>();

export const initialState: State = booksAdapter.getInitialState({
  loaded: true
});

const booksReducer = createReducer(
  initialState,
  on(BooksActions.searchBooks, (state, { term }) => ({
    ...state,
    searchTerm: term,
    loaded: false,
    error: null
  })),
  on(BooksActions.searchBooksSuccess, (state, action) =>
    booksAdapter.setAll(action.books, {
      ...state,
      loaded: true
    })
  ),
  on(BooksActions.searchBooksFailure, (state, { error }) => booksAdapter.removeAll({
    ...state,
    error,
    loaded: true
  })),
  on(BooksActions.clearSearch, state => booksAdapter.removeAll({
    ...state,
    error: null,
    loaded: true
  }))
);

export function reducer(state: State | undefined, action: Action) {
  return booksReducer(state, action);
}
