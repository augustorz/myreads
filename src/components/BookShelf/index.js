import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

import BooksGrid from '../BooksGrid';

const BookShelf = ({ title, books, onChangeBookShelf }) => (
  <div className="bookshelf">
    <h2 className="bookshelf-title">{title}</h2>
    <div className="bookshelf-books">
      {books.length
        ? <BooksGrid books={books} onChangeBookShelf={onChangeBookShelf} />
        : <p className="bookshelf__message">No books to show.</p>
      }
    </div>
  </div>
);

BookShelf.propTypes = {
  title: PropTypes.string.isRequired,
  books: PropTypes.instanceOf(Array),
  onChangeBookShelf: PropTypes.func.isRequired,
};

BookShelf.defaultProps = {
  books: [],
};

export default BookShelf;
