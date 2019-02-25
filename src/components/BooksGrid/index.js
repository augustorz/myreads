import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

import Book from '../Book';

const BooksGrid = ({ books, onChangeBookShelf }) => (
  <ol className="books-grid">
    {books.map(book => (
      <li key={book.id}>
        <Book
          book={book}
          onChangeBookShelf={onChangeBookShelf}
        />
      </li>
    ))}
  </ol>
);

BooksGrid.propTypes = {
  books: PropTypes.instanceOf(Array),
  onChangeBookShelf: PropTypes.func.isRequired,
};

BooksGrid.defaultProps = {
  books: [],
};

export default BooksGrid;
