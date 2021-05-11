Problems/ Code smells:- all fixed

- Unsubscribe not done in `book.search.component.ts`
- Unused methods `ngOnInit` in `total-count.component.ts`
- Empty `total-count.component.scss` file can be removed
- `alt` attribute is not added for `img` tags
- Test cases are failing
- Descriptions are not matching with the specs provided

Improvements:

- Loader experience on search - fixed
- Error handling - fixed
- Safely accessing books collection properties with `?` in html templates to avoid app crashes due to `cannot read property of undefined` - fixed
- Using declarative pattern for datastreams with `async` pipe in templates when possible.- fixed
- changeDetection: `OnPush` should be used where ever applicable
- `Validating query string` - fixed
  - query string encoding (if query string has special characters, few of the API calls may not be processed) encodeURIComponent
  - `Validating whitespaces` for search action (unnecessary api calls can be avoided, if we trim the search key)
- Keeping API URLs and other constant values in a separate `constants` file.
- `Type checking` is missing for method aurguments
- Full material design - fixed (partially)
- Responsive behaviour
- Semantic HTML tags can be used.
- Imports can be segregated properly (example: angular, third party, NgRx & app imports etc.)
- Custom result can be retured in catch block when api fails, for better user experience. Example return an empty observable array - of([]) / of('') etc. and show info message accordingly according to result count. [books.service.ts]

Accessibility:

scanner: - fixed

- couple of color contrast issues in header and book.search.component

manual:- fixed

- `JavaScript` anchor tag is not accessible using tab navigation, as it does not have `href` attribute, to make it accessible we need to add `tabindex`
- `Want to read` does not have `aria-label` with respect to each book.
- `aria-labels` are not added for buttons and images
- `aria-hidden="true"` added for icon tags to hide content from screen readers as they have seperate button tags to access
- `aria-disabled="true"` for disabled buttons