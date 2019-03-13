import React from 'react';
import { shallow } from 'enzyme';
import createBooks from '../../mocks/books';

import BookShelf from '.';

describe('BookShelf', () => {
  let wrapper;

  describe('when books is present', () => {
    beforeEach(() => {
      const books = createBooks({ quantity: 4 });

      wrapper = shallow(
        <BookShelf
          title="read"
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
        <BookShelf
          title="currentlyReading"
          onChangeBookShelf={jest.fn()}
        />,
      );
    });

    it('should match snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
