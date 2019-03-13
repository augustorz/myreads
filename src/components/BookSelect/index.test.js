import React from 'react';
import { shallow } from 'enzyme';
import createBooks from '../../mocks/books';

import BookSelect from '.';

describe('BookSelect', () => {
  let wrapper;

  beforeEach(() => {
    const book = createBooks({ shelf: 'wantToRead' });

    wrapper = shallow(
      <BookSelect
        book={book}
        onChangeBookShelf={jest.fn()}
      />,
    );
  });

  it('should match snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('onChange', () => {
    beforeEach(() => {
      
    });
  });
});
