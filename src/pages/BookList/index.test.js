import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import createBooks from '../../mocks/books';

import BookList from '.';

describe('BookList', () => {
  let routerWrapper;

  beforeEach(() => {
    const currentlyReading = createBooks({ quantity: 2, shelf: 'currentlyReading' });
    const wantToRead = createBooks({ quantity: 3, shelf: 'wantToRead' });
    const read = createBooks({ quantity: 1, shelf: 'read' });

    const shelves = {
      currentlyReading: [...currentlyReading],
      wantToRead: [...wantToRead],
      read: [...read],
    };

    routerWrapper = mount(
      <MemoryRouter>
        <BookList
          shelves={shelves}
          onChangeBookShelf={jest.fn()}
        />
      </MemoryRouter>,
    );
  });

  it('should match snapshot', () => {
    expect(routerWrapper.html()).toMatchSnapshot();
  });
});
