import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { createReadingListItem, SharedTestingModule } from '@tmo/shared/testing';
import { BooksFeatureModule } from '@tmo/books/feature';
import { getReadingList, removeFromReadingList } from '@tmo/books/data-access';

import { ReadingListComponent } from './reading-list.component';

describe('ReadingList Component', () => {
  let component: ReadingListComponent;
  let fixture: ComponentFixture<ReadingListComponent>;
  let store: MockStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, SharedTestingModule],
      providers: [provideMockStore()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadingListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    store.overrideSelector(getReadingList, [
      createReadingListItem('9U5I_tskq9MC'),
      createReadingListItem('qU3rAgAAQBAJ')
    ]);
    spyOn(store, 'dispatch').and.callFake(() => { });
    store.refreshState();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove book from readinglist on remove', () => {
    const readingListItem = createReadingListItem('9U5I_tskq9MC');
    fixture.detectChanges();
    const btnRemove = fixture.debugElement.query(By.css('#btnRemove-9U5I_tskq9MC'));
    btnRemove.nativeElement.click();

    expect(store.dispatch).toHaveBeenCalledWith(removeFromReadingList({ item: readingListItem }));
  });
});
