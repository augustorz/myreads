import React from 'react';
import { shallow } from 'enzyme';
import { createBook } from '../../mocks/books';

import Book from '.';

describe('Book', () => {
  let wrapper;

  describe('when book has at least one author', () => {
    beforeEach(() => {
      const book = createBook({});

      wrapper = shallow(
        <Book
          book={book}
          onChangeBookShelf={jest.fn()}
        />,
      );
    });

    it('should match snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('when book has no authors', () => {
    beforeEach(() => {
      const book = createBook({});
      delete book.authors;

      wrapper = shallow(
        <Book
          book={book}
          onChangeBookShelf={jest.fn()}
        />,
      );
    });

    it('should match snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
