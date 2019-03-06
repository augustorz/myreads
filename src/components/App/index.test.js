import React from 'react';
import { shallow } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import createBooks from '../../mocks/books';

import App from '.';
import { create } from 'handlebars';
import { doesNotReject } from 'assert';

describe('App', () => {
  let wrapper;
  let routerWrapper;

  beforeEach(() => {
    routerWrapper = shallow(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    wrapper = routerWrapper.find(App).dive();
  });

  it('should match snapshot', () => {
    expect(routerWrapper.html()).toMatchSnapshot();
  });

  describe('addBooktoShelves', () => {
    let expected;

    describe('when books array is not empty', () => {
      beforeEach(() => {
        const currentlyReading = createBooks({ quantity: 3, shelf: 'currentlyReading' });
        const wantToRead = createBooks({ quantity: 1, shelf: 'wantToRead' });
        const read = createBooks({ quantity: 2, shelf: 'read' });

        const books = [
          ...currentlyReading,
          ...wantToRead,
          ...read,
        ];

        expected = {
          currentlyReading: [...currentlyReading],
          wantToRead: [...wantToRead],
          read: [...read],
        };

        wrapper.instance().addBooksToShelves(books);
      });

      it('should set shelves state like expected shelves object', () => {
        expect(wrapper.state('shelves')).toEqual(expected);
      });
    });

    describe('when books array is empty', () => {
      beforeEach(() => {
        wrapper.instance().addBooksToShelves();
      });

      it('should set shelves as an empty object', () => {
        expect(wrapper.state('shelves')).toEqual({});
      });
    });
  });

  describe('changeBookShelf', () => {
    let book;
    let payload;

    beforeEach(() => {
      wrapper.instance().removeBookFromShelf = jest.fn();
      wrapper.instance().addBookToShelf = jest.fn();
      wrapper.instance().updateBookShelf = jest.fn();

      book = createBooks({ quantity: 1, shelf: 'read' });
      payload = { book, newShelf: 'currentlyReading' };

      wrapper.instance().changeBookShelf(payload);
    });

    it('should call removeBookFromShelf with book', () => {
      expect(wrapper.instance().removeBookFromShelf).toHaveBeenCalledWith(book);
    });

    it('should call addBookToShelf with payload', () => {
      expect(wrapper.instance().addBookToShelf).toHaveBeenCalledWith(payload);
    });

    it('should call updateBookShelf with payload', () => {
      expect(wrapper.instance().updateBookShelf).toHaveBeenCalledWith(payload);
    });
  });

  describe('removeBookFromShelf', () => {
    let book;
    let filteredRead;
    let expected;

    beforeEach(() => {
      const currentlyReading = createBooks({ quantity: 4, shelf: 'currentlyReading' });
      const wantToRead = createBooks({ quantity: 2, shelf: 'wantToRead' });
      const read = createBooks({ quantity: 5, shelf: 'read' });
      [book, ...filteredRead] = read;

      const shelves = {
        currentlyReading: [...currentlyReading],
        wantToRead: [...wantToRead],
        read: [...read],
      };

      expected = {
        currentlyReading: [...currentlyReading],
        wantToRead: [...wantToRead],
        read: [...filteredRead],
      };

      wrapper.setState({ shelves });
    });

    describe('when book is present and has a shelf', () => {
      beforeEach(() => {
        wrapper.instance().removeBookFromShelf(book);
      });

      it('should remove book from shelf', () => {
        expect(wrapper.state('shelves')).toEqual(expected);
      });
    });

    describe('when book is present but does not have a shelf', () => {
      beforeEach(() => {
        book.shelf = undefined;
        wrapper.setState = jest.fn();
        wrapper.instance().removeBookFromShelf(book);
      });

      it('should not call setState', () => {
        expect(wrapper.setState).not.toHaveBeenCalled();
      });
    });

    describe('when book is undefined', () => {
      beforeEach(() => {
        wrapper.setState = jest.fn();
        wrapper.instance().removeBookFromShelf();
      });

      it('should not call setState', () => {
        expect(wrapper.setState).not.toHaveBeenCalled();
      });
    });
  });

  describe('addBookToShelf', () => {
    let book;
    let expected;

    beforeEach(() => {
      const currentlyReading = createBooks({ quantity: 2, shelf: 'currentlyReading' });
      const wantToRead = createBooks({ quantity: 4, shelf: 'wantToRead' });
      const read = createBooks({ quantity: 6, shelf: 'read' });
      [book] = createBooks({ quantity: 1, shelf: 'currentlyReading' });

      const shelves = {
        currentlyReading: [...currentlyReading],
        wantToRead: [...wantToRead],
        read: [...read],
      };

      expected = {
        currentlyReading: [...currentlyReading],
        wantToRead: [...wantToRead],
        read: [...read, book],
      };

      wrapper.setState({ shelves });
    });

    describe('when book is present and has a shelf', () => {
      let newShelf;

      beforeEach(() => {
        newShelf = 'read';
        wrapper.instance().addBookToShelf({ book, newShelf });
      });

      it('should add book to new shelf array', () => {
        expect(wrapper.state('shelves')).toEqual(expected);
      });

      it('should set shelf and oldShelf if any', () => {
        const { shelf, oldShelf } = wrapper.state('shelves')[newShelf].pop();
        expect(oldShelf).toEqual('currentlyReading');
        expect(shelf).toEqual(newShelf);
      });
    });

    describe('when book is empty', () => {
      let newShelf;

      beforeEach(() => {
        newShelf = 'wantToRead';
        wrapper.instance().addBookToShelf({ newShelf });
      });

      it('should set shelf as newShelf and oldShelf as undefined', () => {
        const { shelf, oldShelf } = wrapper.state('shelves')[newShelf].pop();
        expect(oldShelf).toBeUndefined();
        expect(shelf).toEqual(newShelf);
      });
    });

    describe('when function is called with no paramters', () => {
      beforeEach(() => {
        wrapper.setState = jest.fn();
        wrapper.instance().addBookToShelf();
      });

      it('should not call setState', () => {
        expect(wrapper.setState).not.toHaveBeenCalled();
      });
    });
  });

  describe('updateBookShelf', () => {
    let book;

    beforeEach(() => {
      book = createBooks({ quantity: 1, shelf: 'currentlyReading' });
      book.oldShelf = 'wantToRead';
      
      fetch.resetMocks();
      fetch.mockResponse(JSON.stringify({
        shelves: 'isdahihsd',
      }));

      wrapper.instance().addBookToShelf = jest.fn();
      wrapper.instance().removeBookFromShelf = jest.fn();
    });

    it('should call removeBookFromShelf on error', async (done) => {
      await expect(wrapper.instance().updateBookShelf({ book })).toThrow();
      done();
    });
  });
});
