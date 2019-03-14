import React from 'react';
import { shallow } from 'enzyme';
import createBooks from '../../mocks/books';

import Book from '.';

describe('Book', () => {
  let wrapper;

  beforeEach(() => {
    const book = createBooks({ quantity: 1 });

    wrapper = shallow(
      <Book
        book={book[0]}
        onChangeBookShelf={jest.fn()}
      />,
    );
  });

  it('should match snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
