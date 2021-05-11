import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { createBook, SharedTestingModule } from '@tmo/shared/testing';
import {
  getAllBooks,
  addToReadingList,
  clearSearch,
  getBooksError,
  getBooksLoaded,
  searchBooks,
} from '@tmo/books/data-access';

import { BooksFeatureModule } from '../books-feature.module';
import { BookSearchComponent } from './book-search.component';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('BookSearch Component', () => {
  let component: BookSearchComponent;
  let fixture: ComponentFixture<BookSearchComponent>;
  let store: MockStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, NoopAnimationsModule, SharedTestingModule],
      providers: [provideMockStore()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookSearchComponent);
    component = fixture.componentInstance;

    store = TestBed.inject(MockStore);

    store.overrideSelector(getAllBooks, [
      { ...createBook('9U5I_tskq9MC'), isAdded: false, publishedDate: null },
      { ...createBook('qU3rAgAAQBAJ'), isAdded: false },
      { ...createBook('PXa2bby0oQ0C'), isAdded: false }
    ]);

    store.overrideSelector(getBooksLoaded, true);
    spyOn(store, 'dispatch').and.callFake(() => { });
    store.overrideSelector(getBooksError, null);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should show list of books on search with a search keyword', () => {
    store.overrideSelector(getAllBooks, [
      { ...createBook('9U5I_tskq9MC'), isAdded: false },
      { ...createBook('qU3rAgAAQBAJ'), isAdded: false },
      { ...createBook('PXa2bby0oQ0C'), isAdded: false }
    ]);

    const searchControl = fixture.debugElement.query(By.css('#searchInput'));
    searchControl.nativeElement.value = 'JavaScript';
    searchControl.nativeElement.dispatchEvent(new Event('input'));

    const btnSearch = fixture.debugElement.query(By.css('#btnSearch'));
    btnSearch.nativeElement.click();
    store.refreshState();
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(searchBooks({ term: 'JavaScript' }));

    const books = fixture.debugElement.queryAll(By.css('div.book'));
    expect(books.length).toEqual(3);
  });

  it('should clear search results when user clears the search input', () => {
    const searchControl = fixture.debugElement.query(By.css('#searchInput'));
    searchControl.nativeElement.value = '';
    searchControl.nativeElement.dispatchEvent(new Event('input'));

    const btnSearch = fixture.debugElement.query(By.css('#btnSearch'));
    btnSearch.nativeElement.click();

    const books = fixture.debugElement.queryAll(By.css('div.book'));

    expect(books.length).toEqual(0);
    expect(store.dispatch).toHaveBeenCalledWith(clearSearch());
  });

  it('should set JavaScript text in search input and get results on click of example topic', () => {
    const anchorControl = fixture.debugElement.query(By.css('a'));
    anchorControl.nativeElement.click();

    expect(component.searchForm.value.term).toEqual('javascript');
    expect(store.dispatch).toHaveBeenCalledWith(searchBooks({ term: 'javascript' }));
  });

  it('should add a book to reading list on click of WantToRead', () => {
    const bookToRead = { ...createBook('9U5I_tskq9MC'), isAdded: false };

    store.overrideSelector(getAllBooks, [
      { ...bookToRead },
      { ...createBook('qU3rAgAAQBAJ'), isAdded: false },
      { ...createBook('PXa2bby0oQ0C'), isAdded: false }
    ]);

    const searchControl = fixture.debugElement.query(By.css('#searchInput'));
    searchControl.nativeElement.value = 'JavaScript';
    searchControl.nativeElement.dispatchEvent(new Event('input'));

    const btnSearch = fixture.debugElement.query(By.css('#btnSearch'));
    btnSearch.nativeElement.click();
    store.refreshState();
    fixture.detectChanges();

    const btnWantToRead = fixture.debugElement.query(By.css('#wantToRead-9U5I_tskq9MC'));
    btnWantToRead.nativeElement.click();
    expect(store.dispatch).toHaveBeenCalledWith(addToReadingList({ book: bookToRead }));
  });

  it('should clear search results and clear error message when search term cleared', () => {
    store.overrideSelector(getAllBooks, []);
    store.refreshState();

    const searchControl = fixture.debugElement.query(By.css('#searchInput'));
    searchControl.nativeElement.value = '';

    const backspaceEvent = new KeyboardEvent("keyup", { "key": "Backspace" });
    searchControl.nativeElement.dispatchEvent(backspaceEvent);

    expect(component.searchForm.value.term).toEqual('');
    expect(store.dispatch).toHaveBeenCalledWith(clearSearch());
  });

  it('should not clear previous search results when search term is not cleared', () => {
    store.overrideSelector(getAllBooks, [
      { ...createBook('qU3rAgAAQBAJ'), isAdded: false },
      { ...createBook('PXa2bby0oQ0C'), isAdded: false }
    ]);
    store.refreshState();

    const searchInput = fixture.nativeElement.querySelector('#searchInput');

    searchInput.value = 'aa';
    searchInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    component.searchForm.valueChanges
      .subscribe(searchKey => {
        expect(searchKey).toEqual('aa');
      });

    expect(store.dispatch).not.toHaveBeenCalledWith(clearSearch());
  });

  it('should show books with respect to user input while typing', fakeAsync(() => {
    const searchCtrl = fixture.debugElement.query(By.css('#searchInput'));
    searchCtrl.nativeElement.value = 'nodejs';
    searchCtrl.nativeElement.dispatchEvent(new Event('input'));
    tick(500);

    expect(component.searchForm.value.term).toEqual('nodejs');
    expect(store.dispatch).toHaveBeenCalledWith(searchBooks({ term: 'nodejs' }));
  }));

  it('should show error message when user types an input input', fakeAsync(() => {
    const searchCtrl = fixture.debugElement.query(By.css('#searchInput'));
    searchCtrl.nativeElement.value = '#';
    searchCtrl.nativeElement.dispatchEvent(new Event('input'));
    tick(500);

    expect(component.searchForm.value.term).toEqual('#');
    expect(store.dispatch).toHaveBeenCalledWith(searchBooks({ term: encodeURIComponent('#') }));
  }));
});
