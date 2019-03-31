import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import debounce from 'lodash/debounce';
import { createBooks, createBook } from '../../mocks/books';

import BookSearch from '.';
import { create } from 'handlebars';

jest.mock('lodash/debounce');
debounce.mockImplementation(fn => fn);

describe('BookSearch', () => {
  let shelves;
  let routerWrapper;
  let wrapper;

  beforeEach(() => {
    const currentlyReading = createBooks({ quantity: 5, shelf: 'currentlyReading' });
    const wantToRead = createBooks({ quantity: 2, shelf: 'wantToRead' });
    const read = createBooks({ quantity: 1, shelf: 'read' });

    shelves = {
      currentlyReading,
      wantToRead,
      read,
    };

    routerWrapper = mount(
      <MemoryRouter>
        <BookSearch
          shelves={shelves}
          onChangeBookShelf={jest.fn()}
        />
      </MemoryRouter>,
    );

    wrapper = routerWrapper.find(BookSearch);
  });

  it('should match snapshot', () => {
    expect(routerWrapper.html()).toMatchSnapshot();
  });

  describe('handleSearch', () => {
    let event;

    describe('when query is empty', () => {
      beforeEach(() => {
        event = {
          target: {
            value: '',
          },
        };

        wrapper.instance().handleSearch(event);
      });

      it('should set books state as an empty array', () => {
        expect(wrapper.state('books')).toEqual([]);
      });

      it('should set query state as an empty string', () => {
        expect(wrapper.state('query')).toEqual('');
      });

      it('should not call debounce', () => {
        expect(debounce).not.toBeCalled();
      });
    });

    describe('when query is present', () => {
      beforeEach(() => {
        event = {
          target: {
            value: 'Search Query',
          },
        };

        wrapper.instance().searchBooks = jest.fn();
        wrapper.instance().handleSearch(event);
      });

      it('should set books state as an empty array', () => {
        expect(wrapper.state('books')).toEqual([]);
      });

      it('should set query state as event value', () => {
        expect(wrapper.state('query')).toEqual(event.target.value);
      });

      it('should call debounce with searchBooks', () => {
        expect(debounce).toBeCalledWith(wrapper.instance().searchBooks, 1000);
      });
    });

    describe('searchBooks', () => {
      beforeEach(() => {
        fetch.resetMocks();
      });

      describe('when response is empty', () => {
        beforeEach(async (done) => {
          wrapper.setState = jest.fn();

          fetch.mockResponse(JSON.stringify({}));

          await wrapper.instance().searchBooks();
          done();
        });

        it('should not call setState', () => {
          expect(wrapper.setState).not.toBeCalled();
        });
      });

      describe('when response is present and has no query errors', () => {
        let books;

        beforeEach(async (done) => {
          books = createBooks({ quantity: 2, shelf: 'currentlyReading' });

          fetch.mockResponse(JSON.stringify({
            books,
          }));

          await wrapper.instance().searchBooks();
          done();
        });

        it('should set books state as response data', () => {
          expect(wrapper.state('books')).toEqual(books);
        });
      });

      describe('when response is present but has query errors', () => {
        beforeEach(async (done) => {
          wrapper.setState = jest.fn();

          fetch.mockResponse(JSON.stringify({
            books: {
              error: {},
            },
          }));

          await wrapper.instance().searchBooks();
          done();
        });

        it('should not call setState', () => {
          expect(wrapper.setState).not.toBeCalled();
        });
      });

      describe('when async calls has errors', () => {
        beforeEach(() => {
          fetch.mockReject(new Error('Network Error'));
        });

        it('should throw error', async (done) => {
          try {
            await wrapper.instance().searchBooks();
          } catch (e) {
            expect(e.message).toEqual('Network Error');
          }
          done();
        });
      });
    });
  });

  describe('isBookInShelf', () => {
    let shelf;
    let isBookInShelf;

    beforeEach(() => {
      shelf = createBooks({ quantity: 10, shelf: 'currentlyReading' });
    });

    describe('when book is in shelf', () => {
      beforeEach(() => {
        const book = shelf[0];
        isBookInShelf = wrapper.instance().isBookInShelf({ book, shelf });
      });

      it('should return true', () => {
        expect(isBookInShelf).toBeTruthy();
      });
    });

    describe('when book is not in shelf', () => {
      beforeEach(() => {
        const book = createBooks({ shelf: 'read' });
        isBookInShelf = wrapper.instance().isBookInShelf({ book, shelf });
      });

      it('should return false', () => {
        expect(isBookInShelf).toBeFalsy();
      });
    });
  });

  describe('putShelfInBook', () => {
    let bookWithShelf;
    let book;

    describe('when book has a shelf', () => {
      beforeEach(() => {
        [book] = shelves.currentlyReading;
        delete book.shelf;
        bookWithShelf = wrapper.instance().putShelfInBook(book);
      });

      it('should return book with shelf attribute', () => {
        expect(bookWithShelf.shelf).toEqual('currentlyReading');
      });
    });

    describe('when book has not a shelf', () => {
      beforeEach(() => {
        book = createBook({ quantity: 1 });
        delete book.shelf;
        bookWithShelf = wrapper.instance().putShelfInBook(book);
      });

      it('should return book without modifyng it', () => {
        expect(bookWithShelf).toEqual(book);
      });
    });
  });

  describe('putShelvesInBooks', () => {
    describe('when books is present', () => {
      let booksWithShelf;
      let books;

      beforeEach(() => {
        books = createBooks({ quantity: 8 });
        booksWithShelf = wrapper.instance().putShelvesInBooks(books);
      });

      it('should return books without modifyng it', () => {
        expect(booksWithShelf).toEqual(books);
      });
    });

    describe('when books does not exist', () => {
      let booksWithShelf;
      beforeEach(() => {
        booksWithShelf = wrapper.instance().putShelvesInBooks();
      });

      it('should return an empty array', () => {
        expect(booksWithShelf).toEqual([]);
      });
    });
  });
});
