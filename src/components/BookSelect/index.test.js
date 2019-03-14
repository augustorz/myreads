import React from 'react';
import { mount } from 'enzyme';
import createBooks from '../../mocks/books';

import BookSelect from '.';

describe('BookSelect', () => {
  let wrapper;
  let book;

  beforeEach(() => {
    book = createBooks({ shelf: 'wantToRead' });

    wrapper = mount(
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
    let event;

    beforeEach(() => {
      event = {
        target: {
          value: 'currentlyReading',
        },
      };

      wrapper.find('.book-shelf-select').simulate('change', event);
    });

    it('should call onChangeBookShelf with book and newShelf', () => {
      expect(wrapper.props().onChangeBookShelf)
        .toBeCalledWith({ book, newShelf: event.target.value });
    });
  });
});
