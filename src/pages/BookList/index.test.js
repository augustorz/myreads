import React from 'react';
import { mount } from 'enzyme';
import { waitForElement } from 'enzyme-async-helpers';
import { MemoryRouter } from 'react-router-dom';
import createBooks from '../../mocks/books';

import BookList from '.';
import BookShelf from '../../components/BookShelf';

describe('BookList', () => {
  let wrapper;

  beforeEach(() => {
    fetch.resetMocks();
  });

  describe('componentDidMount', () => {
    beforeEach(async (done) => {
      const currentlyReading = createBooks({ quantity: 2, shelf: 'currentlyReading' });
      const wantToRead = createBooks({ quantity: 3, shelf: 'wantToRead' });
      const read = createBooks({ quantity: 1, shelf: 'read' });

      fetch.mockResponse(JSON.stringify({
        books: [
          ...currentlyReading,
          ...wantToRead,
          ...read,
        ],
      }));

      wrapper = mount(
        <MemoryRouter>
          <BookList
            shelves={{}}
            onBooksLoad={jest.fn()}
            onChangeBookShelf={jest.fn()}
          />
        </MemoryRouter>,
      );

      await waitForElement(wrapper, BookShelf);
      done();
    });

    it('should match snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
