import * as ReadingListActions from './reading-list.actions';
import {
  initialState,
  readingListAdapter,
  reducer,
  State
} from './reading-list.reducer';
import { createBook, createReadingListItem } from '@tmo/shared/testing';
import { ReadingListItem } from '@tmo/shared/models';

describe('ReadingList Reducer', () => {
  describe('valid reading list actions', () => {
    let state: State;

    beforeEach(() => {
      state = readingListAdapter.setAll(
        [createReadingListItem('A'), createReadingListItem('B')],
        initialState
      );
    });

    it('should load books from reading list on loadReadingListSuccess', () => {
      const list = [
        createReadingListItem('A'),
        createReadingListItem('B'),
        createReadingListItem('C')
      ];
      const action = ReadingListActions.loadReadingListSuccess({ list });

      const result: State = reducer(initialState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toEqual(3);
    });

    it('init should load initial state', () => {
      const action = ReadingListActions.init();

      const result: State = reducer(initialState, action);

      expect(result.loaded).toBe(false);
      expect(result.ids.length).toEqual(0);
    });

    it('should add book to reading list on addToReadingList', () => {
      const action = ReadingListActions.addToReadingList({
        book: createBook('B')
      });

      const result: State = reducer(state, action);

      expect(result.ids).toEqual(['A', 'B']);
    });

    it('should undo book addition to the state on removeFromReadingList', () => {
      const item: ReadingListItem = createReadingListItem('B');
      const action = ReadingListActions.removeFromReadingList({ item });

      const result: State = reducer(state, action);

      expect(result.ids).toEqual(['A']);
    });

    it('should undo book addition to the state on failedAddToReadingList', () => {
      const action = ReadingListActions.failedAddToReadingList({
        book: createBook('B')
      });

      const result: State = reducer(state, action);

      expect(result.ids).toEqual(['A']);
    });

    it('should undo book removal from the state on failedRemoveFromReadingList', () => {
      const action = ReadingListActions.failedRemoveFromReadingList({
        item: createReadingListItem('C')
      });

      const result: State = reducer(state, action);

      expect(result.ids).toEqual(['A', 'B', 'C']);
    });

    it('should display error on loadReadingListError', () => {
      const action = ReadingListActions.loadReadingListError({
        error: 'Internal server error'
      });

      const result: State = reducer(state, action);

      expect(result.error).toEqual('Internal server error');
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });
});
