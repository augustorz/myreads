import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import createBooks from '../../mocks/books';

import BookList from '.';

describe('BookList', () => {
  let routerWrapper;
  let wrapper;
  let books;

  beforeEach(() => {
    fetch.resetMocks();

    const currentlyReading = createBooks({ quantity: 2, shelf: 'currentlyReading' });
    const wantToRead = createBooks({ quantity: 3, shelf: 'wantToRead' });
    const read = createBooks({ quantity: 1, shelf: 'read' });

    books = [
      ...currentlyReading,
      ...wantToRead,
      ...read,
    ];

    const shelves = {
      currentlyReading: [...currentlyReading],
      wantToRead: [...wantToRead],
      read: [...read],
    };

    fetch.mockResponse(JSON.stringify({
      books,
    }));

    routerWrapper = mount(
      <MemoryRouter>
        <BookList
          shelves={shelves}
          onMount={jest.fn()}
          onBooksLoad={jest.fn()}
          onChangeBookShelf={jest.fn()}
        />
      </MemoryRouter>,
    );

    wrapper = routerWrapper.find(BookList);
  });

  it('should match snapshot', () => {
    expect(routerWrapper.html()).toMatchSnapshot();
  });

  describe('loadBooks', () => {
    describe('when async call has no errors', () => {
      beforeEach(async (done) => {
        await wrapper.instance().loadBooks();
        done();
      });

      it('should call onBooksLoad with books', () => {
        expect(wrapper.props().onBooksLoad).toBeCalledWith(books);
      });
    });

    describe('when async calls has errors', () => {
      beforeEach(() => {
        fetch.mockReject(new Error('Network Error'));
      });

      it('should throw error', async (done) => {
        try {
          await wrapper.instance().loadBooks();
        } catch (e) {
          expect(e.message).toEqual('Network Error');
        }
        done();
      });
    });
  });

  describe('componentDidMount', () => {
    it('should call onMount', () => {
      expect(wrapper.props().onMount).toBeCalled();
    });
  });
});
