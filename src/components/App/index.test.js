import React from 'react';
import { shallow } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import createBooks from '../../mocks/books';

import App from '.';

describe('App', () => {
  let wrapper;
  let routerWrapper;

  describe('when route is /search', () => {
    beforeEach(() => {
      routerWrapper = shallow(
        <MemoryRouter initialEntries={['/search']}>
          <App />
        </MemoryRouter>,
      );
    });

    it('should match snapshot', () => {
      expect(routerWrapper.html()).toMatchSnapshot();
    });
  });

  describe('when route is /', () => {
    beforeEach(() => {
      routerWrapper = shallow(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>,
      );

      wrapper = routerWrapper.find(App).dive();
    });

    it('should match snapshot', () => {
      expect(routerWrapper.html()).toMatchSnapshot();
    });

    describe('setShelvesFromStorage', () => {
      describe('when shelves from localStorage is empty', () => {
        beforeEach(() => {
          wrapper.setState = jest.fn();
          wrapper.instance().setShelvesFromStorage();
        });

        it('should not setState', () => {
          expect(wrapper.setState).not.toBeCalled();
        });
      });

      describe('when shelves from localStorage exists', () => {
        let shelves;

        beforeEach(() => {
          shelves = {
            currentlyReading: [],
            wantToRead: [],
            read: [],
          };

          window.localStorage.setItem('shelves', JSON.stringify(shelves));
          wrapper.instance().setShelvesFromStorage();
        });

        it('should set shelves state', () => {
          expect(wrapper.state('shelves')).toEqual(shelves);
        });
      });
    });

    describe('updateShelvesState', () => {
      let shelves;
      beforeEach(() => {
        shelves = {
          read: [],
          wantToRead: [],
          currentlyReading: [],
        };

        wrapper.instance().updateShelvesState(shelves);
      });

      it('should set shelves state as payload', () => {
        expect(wrapper.state('shelves')).toEqual(shelves);
      });

      it('should set shelves in localStorage', () => {
        expect(localStorage.getItem('shelves')).toEqual(JSON.stringify(shelves));
      });
    });

    describe('addBooksToShelves', () => {
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

          wrapper.instance().updateShelvesState = jest.fn();
          wrapper.instance().addBooksToShelves(books);
        });

        it('should call updateShelvesState with expected', () => {
          expect(wrapper.instance().updateShelvesState).toBeCalledWith(expected);
        });
      });

      describe('when books array is empty', () => {
        beforeEach(() => {
          wrapper.instance().updateShelvesState = jest.fn();
          wrapper.instance().addBooksToShelves();
        });

        it('should call updateShelvesState with an empty object', () => {
          expect(wrapper.instance().updateShelvesState).toBeCalledWith({});
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
        expect(wrapper.instance().removeBookFromShelf).toBeCalledWith(book);
      });

      it('should call addBookToShelf with payload', () => {
        expect(wrapper.instance().addBookToShelf).toBeCalledWith(payload);
      });

      it('should call updateBookShelf with payload', () => {
        expect(wrapper.instance().updateBookShelf).toBeCalledWith(payload);
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
        wrapper.instance().updateShelvesState = jest.fn();
      });

      describe('when book is present and has a shelf', () => {
        beforeEach(() => {
          wrapper.instance().removeBookFromShelf(book);
        });

        it('should call updateShelvesState with expected', () => {
          expect(wrapper.instance().updateShelvesState).toBeCalledWith(expected);
        });
      });

      describe('when book is present but does not have a shelf', () => {
        beforeEach(() => {
          book.shelf = undefined;
          wrapper.instance().removeBookFromShelf(book);
        });

        it('should not call updateShelvesState', () => {
          expect(wrapper.instance().updateShelvesState).not.toBeCalled();
        });
      });

      describe('when book is undefined', () => {
        beforeEach(() => {
          wrapper.instance().removeBookFromShelf();
        });

        it('should not call updateShelvesState', () => {
          expect(wrapper.instance().updateShelvesState).not.toBeCalled();
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
        wrapper.instance().updateShelvesState = jest.fn();
      });

      describe('when book is present and has a shelf', () => {
        let newShelf;

        beforeEach(() => {
          newShelf = 'read';
          wrapper.instance().addBookToShelf({ book, newShelf });
        });

        it('should call updateShelvesState with expected', () => {
          expect(wrapper.instance().updateShelvesState).toBeCalledWith(expected);
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
          wrapper.instance().addBookToShelf();
        });

        it('should not call updateShelvesState', () => {
          expect(wrapper.instance().updateShelvesState).not.toBeCalled();
        });
      });
    });

    describe('updateBookShelf', () => {
      let book;

      beforeEach(() => {
        book = createBooks({ quantity: 1, shelf: 'currentlyReading' });
        book.oldShelf = 'wantToRead';

        fetch.resetMocks();

        wrapper.instance().addBookToShelf = jest.fn();
        wrapper.instance().removeBookFromShelf = jest.fn();
      });

      describe('when async call gets rejected', () => {
        beforeEach(() => {
          fetch.mockReject(new Error('Network Error'));
        });

        it('should call removeBookFromShelf', async (done) => {
          try {
            await wrapper.instance().updateBookShelf({ book, newShelf: 'read' });
          } catch (e) {
            expect(wrapper.instance().removeBookFromShelf).toBeCalledWith(book);
          }
          done();
        });

        it('should call addBookToShelf', async (done) => {
          try {
            await wrapper.instance().updateBookShelf({ book, newShelf: 'read' });
          } catch (e) {
            expect(wrapper.instance().addBookToShelf)
              .toBeCalledWith({ book, newShelf: book.oldShelf });
          }
          done();
        });

        it('should throw error', async (done) => {
          try {
            await wrapper.instance().updateBookShelf({ book, newShelf: 'read' });
          } catch (e) {
            expect(e.message).toEqual('Network Error');
          }
          done();
        });
      });
    });
  });
});
