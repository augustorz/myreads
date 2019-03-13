import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import createBooks from '../../mocks/books';

import BookSearch from '.';

describe('BookSearch', () => {
  let routerWrapper;
  let wrapper;

  beforeEach(() => {
    routerWrapper = mount(
      <MemoryRouter>
        <BookSearch
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

        wrapper.instance().searchBooks = jest.fn();
        wrapper.instance().handleSearch(event);
      });

      it('should set books state as an empty array', () => {
        expect(wrapper.state('books')).toEqual([]);
      });

      it('should set query state as an empty string', () => {
        expect(wrapper.state('query')).toEqual('');
      });

      it('should not call searchBooks', () => {
        expect(wrapper.instance().searchBooks).not.toBeCalled();
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

      it('should call searchBooks', () => {
        expect(wrapper.instance().searchBooks).toBeCalled();
      });
    });

    describe('searchBooks', () => {
      beforeEach(() => {
        fetch.resetMocks();
      });

      describe('if response is empty', () => {
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

      describe('if response is present and has no errors', () => {
        let books;

        beforeEach(async (done) => {
          books = createBooks({ quantity: 2 });

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

      describe('if response is present but has errors', () => {
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
    });
  });
});
