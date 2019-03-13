import React from 'react';
import { shallow } from 'enzyme';
import createBooks from '../../mocks/books';

import BooksGrid from '.';

describe('BooksGrid', () => {
  let wrapper;

  describe('when books is present', () => {
    beforeEach(() => {
      const books = createBooks({ quantity: 5, shelf: 'wantToRead' });

      wrapper = shallow(
        <BooksGrid
          books={books}
          onChangeBookShelf={jest.fn()}
        />,
      );
    });

    it('should match snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('when books is not present', () => {
    beforeEach(() => {
      wrapper = shallow(
        <BooksGrid
          onChangeBookShelf={jest.fn()}
        />,
      );
    });

    it('should match snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
