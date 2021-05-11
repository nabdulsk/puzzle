import { initialState, reducer, State } from './books.reducer';
import * as BooksActions from './books.actions';

import { createBook } from '@tmo/shared/testing';
import { Book } from '@tmo/shared/models';

describe('Books Reducer', () => {
  describe('valid Books actions', () => {
    it('loadBooksSuccess should return set the list of known Books', () => {
      const books: Book[] = [createBook('A'), createBook('B'), createBook('C')];
      const action = BooksActions.searchBooksSuccess({ books });

      const result: State = reducer(initialState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(3);
    });

    it('should return state when searchBooks action dispatched', () => {
      const action = BooksActions.searchBooks({ term: 'JavaScript' });

      const result: State = reducer(initialState, action);

      expect(result.loaded).toBe(false);
      expect(result.searchTerm).toBe('JavaScript');
    });

    it('should show error message when searchBooksFailure action dispatched', () => {
      const action = BooksActions.searchBooksFailure({ error: 'Missing serach term' });

      const result: State = reducer(initialState, action);

      expect(result.error).toBe('Missing serach term');
    });

    it('should return the initial state when clearSearch action dispatched', () => {
      const action = BooksActions.clearSearch();

      const result: State = reducer(initialState, action);

      expect(result.ids.length).toBe(0);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result: State = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
