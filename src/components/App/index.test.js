import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { shallow } from 'enzyme';
import { waitForElement } from 'enzyme-async-helpers';
import generateBooks from '../../mocks/book';
import App from '.';
import BookList from '../../pages/BookList';

describe('App', () => {
  let wrapper;

  beforeEach(() => {
    fetch.resetMocks();
  });

  describe('componentDidMount', () => {
    let readBooks;
    let wantToReadBooks;
    let currentlyReadingBooks;

    beforeEach(async (done) => {
      readBooks = generateBooks(1, 'read');
      wantToReadBooks = generateBooks(1, 'wantToRead');
      currentlyReadingBooks = generateBooks(1, 'currentlyReading');

      fetch.mockResponse(JSON.stringify({
        books: [
          ...readBooks,
          ...wantToReadBooks,
          ...currentlyReadingBooks,
        ],
      }));

      wrapper = shallow(
        <BrowserRouter>
          <App />
        </BrowserRouter>,
      );
      await waitForElement(wrapper, BookList);
      done();
    });

    it('should match snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
